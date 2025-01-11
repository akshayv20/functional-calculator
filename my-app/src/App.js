import React, { useState, useRef, useEffect } from "react";
import InitialInput from "./components/InitialInput";
import FunctionCard from "./components/FunctionCard";
import FinalOutput from "./components/FinalOutput";
import "./App.css";

const App = () => {
  const [initialValue, setInitialValue] = useState(0);
  const [functions, setFunctions] = useState([
    { id: 1, equation: "x^2", next: 2 },
    { id: 2, equation: "2x+4", next: 4 },
    { id: 3, equation: "x^2+20", next: null },
    { id: 4, equation: "x-2", next: 5 },
    { id: 5, equation: "x/2", next: 3 }
  ]);
  const [positions, setPositions] = useState({
    initial: { x: 10, y: 30 },
    1: { x: 100, y: 80 },
    2: { x: 250, y: 80 },
    3: { x: 400, y: 80 },
    4: { x: 250, y: 220 },
    5: { x: 400, y: 220 },
    final: { x: 550, y: 250 }
  });

  const svgRef = useRef(null);

  // Calculate the final output by applying the function chain
  const calculateOutput = (value) => {
    let currentValue = value;
    const order = [1, 2, 4, 5, 3];
    order.forEach((id) => {
      const func = functions.find((f) => f.id === id);
      if (func) {
        currentValue = evaluate(func.equation, currentValue);
      }
    });
    return currentValue;
  };

  // Evaluate the equation string for the current value of x
  const evaluate = (equation, x) => {
    try {
      const result = Function(`return ${equation.replace(/x/g, x)}`)();
      return result;
    } catch {
      return NaN; // Handle invalid equation
    }
  };

  const finalOutput = calculateOutput(initialValue);

  // Connect elements in the SVG based on their positions
  const connectElements = (from, to) => {
    const svg = svgRef.current;
    const rect1 = from.getBoundingClientRect();
    const rect2 = to.getBoundingClientRect();

    const startX = rect1.right;
    const startY = rect1.top + rect1.height / 2;
    const endX = rect2.left;
    const endY = rect2.top + rect2.height / 2;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    line.setAttribute(
      "d",
      `M ${startX} ${startY} C ${(startX + endX) / 2} ${startY}, ${
        (startX + endX) / 2
      } ${endY}, ${endX} ${endY}`
    );
    line.setAttribute("stroke", "#007bff");
    line.setAttribute("stroke-width", "2");
    line.setAttribute("fill", "none");

    svg.appendChild(line);
  };

  // Update connections when function positions change
  const updateConnections = () => {
    if (svgRef.current) {
      svgRef.current.innerHTML = ""; // Clear previous connections

      // Connect InitialInput to the first FunctionCard
      const initialOutput = document.querySelector("#initial-connector");
      const firstFunctionInput = document.querySelector("#input-1");
      if (initialOutput && firstFunctionInput) {
        connectElements(initialOutput, firstFunctionInput);
      }

      // Connect FunctionCards as per the chain
      functions.forEach((func) => {
        if (func.next) {
          const outputElem = document.querySelector(`#output-${func.id}`);
          const inputElem = document.querySelector(`#input-${func.next}`);
          if (outputElem && inputElem) {
            connectElements(outputElem, inputElem);
          }
        }
      });

      // Connect the last FunctionCard to FinalOutput (if needed)
      const lastFunctionOutput = document.querySelector("#output-3");
      const finalInput = document.querySelector("#final-connector");
      if (lastFunctionOutput && finalInput) {
        connectElements(lastFunctionOutput, finalInput);
      }
    }
  };

  useEffect(() => {
    updateConnections();
  }, [functions, positions]);

  // Handle the drag of components (InitialInput, FunctionCard, FinalOutput)
  const handleDrag = (id, newPosition) => {
    setPositions((prevPositions) => ({
      ...prevPositions,
      [id]: newPosition
    }));
  };

  return (
    <div className='app-container'>
      <InitialInput
        value={initialValue}
        setValue={setInitialValue}
        position={positions["initial"]} // Pass initial position for InitialInput
        onDrag={(data) => handleDrag("initial", data.position)} // Update position when dragging
      />

      <div className='function-chain'>
        <svg ref={svgRef} className='line-canvas'></svg>
        {functions.map((func) => (
          <FunctionCard
            key={func.id}
            functionData={func}
            functions={functions}
            setFunctions={setFunctions}
            position={positions[func.id]}
            onDrag={handleDrag} // Pass handleDrag directly
          />
        ))}
      </div>

      <FinalOutput
        value={finalOutput}
        position={positions["final"]} // Pass initial position for the FinalOutput
        onDrag={(data) => handleDrag("final", data.position)} // Update position when dragging
      />
    </div>
  );
};

export default App;

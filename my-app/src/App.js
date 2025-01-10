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

  const svgRef = useRef(null);
  const positionsRef = useRef({});

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

  const evaluate = (equation, x) => {
    try {
      const result = Function(`return ${equation.replace(/x/g, x)}`)();
      return result;
    } catch {
      return NaN; // Handle invalid equation
    }
  };

  const finalOutput = calculateOutput(initialValue);

  const connectElements = (from, to) => {
    const svg = svgRef.current;
    const rect1 = from.getBoundingClientRect();
    const rect2 = to.getBoundingClientRect();

    // Calculate positions
    const startX = rect1.right;
    const startY = rect1.top + rect1.height / 2;
    const endX = rect2.left;
    const endY = rect2.top + rect2.height / 2;

    // Create a new line
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

    // Append to SVG
    svg.appendChild(line);
  };

  const updateConnections = () => {
    if (svgRef.current) {
      svgRef.current.innerHTML = ""; // Clear previous connections
      functions.forEach((func) => {
        if (func.next) {
          const outputElem = document.querySelector(`#output-${func.id}`);
          const inputElem = document.querySelector(`#input-${func.next}`);
          if (outputElem && inputElem) {
            connectElements(outputElem, inputElem);
          }
        }
      });
    }
  };

  useEffect(() => {
    updateConnections();
  }, [functions]);

  const handleDrag = (id, newPosition) => {
    positionsRef.current[id] = newPosition;
    updateConnections();
  };

  return (
    <div className='app-container'>
      <InitialInput value={initialValue} setValue={setInitialValue} />
      <div className='function-chain'>
        <svg ref={svgRef} className='line-canvas'></svg>
        {functions.map((func) => (
          <FunctionCard key={func.id} functionData={func} onDrag={handleDrag} />
        ))}
      </div>
      <FinalOutput value={finalOutput} />
    </div>
  );
};

export default App;

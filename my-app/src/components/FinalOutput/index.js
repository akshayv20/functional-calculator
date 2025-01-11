import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
const FinalOutput = ({ value, position, onDrag }) => {
  const [outputPosition, setOutputPosition] = useState(position); // Initialize position from parent
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (e) => {
      const newX = outputPosition.x + (e.clientX - startX);
      const newY = outputPosition.y + (e.clientY - startY);

      setOutputPosition({ x: newX, y: newY });
      if (onDrag) onDrag({ id: "final", position: { x: newX, y: newY } }); // Notify parent of new position
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${outputPosition.x}px, ${outputPosition.y}px)`;
    }
  }, [outputPosition]);

  return (
    <div
      ref={containerRef}
      className='final-output-container'
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: outputPosition.x,
        top: outputPosition.y
      }}
    >
      <label className='output-label'>Final Output (y)</label>
      <div className='final-output'>
        <p className='output-field'>{value}</p>
        <div className='connector' id='final-connector'>
          <div
            className='connector-label-output'
            id='final-connector-label'
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FinalOutput;

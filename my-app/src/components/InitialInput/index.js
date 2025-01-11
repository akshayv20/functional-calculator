import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
const InitialInput = ({ value, setValue, position, onDrag }) => {
  const [inputPosition, setInputPosition] = useState(position); // Initialize position from parent
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (e) => {
      const newX = inputPosition.x + (e.clientX - startX);
      const newY = inputPosition.y + (e.clientY - startY);

      setInputPosition({ x: newX, y: newY });
      if (onDrag) onDrag({ id: "initial", position: { x: newX, y: newY } }); // Notify parent of new position
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
      containerRef.current.style.transform = `translate(${inputPosition.x}px, ${inputPosition.y}px)`;
    }
  }, [inputPosition]);

  return (
    <div
      ref={containerRef}
      className='initial-input-container'
      onMouseDown={handleMouseDown}
      style={{
        position: "absolute",
        left: inputPosition.x,
        top: inputPosition.y
      }}
    >
      <label className='input-label'>Initial value of x</label>
      <div className='initial-input'>
        <input
          type='number'
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className='input-field'
        />
        <div className='connector' id='initial-connector'>
          <div
            className='connector-label-input'
            id='connector-label-input'
          ></div>
        </div>
      </div>
    </div>
  );
};

export default InitialInput;

import React, { useState, useEffect, useRef } from "react";

const InitialInput = ({ value, setValue, onDrag }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = containerRef.current.getBoundingClientRect();

    const handleMouseMove = (e) => {
      const newX = position.x + (e.clientX - startX);
      const newY = position.y + (e.clientY - startY);

      setPosition({ x: newX, y: newY });
      if (onDrag) onDrag({ x: rect.left + newX, y: rect.top + newY });
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
      containerRef.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  return (
    <div
      ref={containerRef}
      className='initial-input-container'
      onMouseDown={handleMouseDown}
      style={{ position: "absolute", left: position.x, top: position.y }}
    >
      <label className='input-label'>Initial value of x</label>
      <div className='initial-input'>
        <input
          type='number'
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className='input-field'
        />
        <div className='connector' id='initial-connector'></div>
      </div>
    </div>
  );
};

export default InitialInput;

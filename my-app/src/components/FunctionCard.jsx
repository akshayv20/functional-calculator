import React, { useRef, useEffect, useState } from "react";

const FunctionCard = ({ functionData, onDrag }) => {
  const { id, equation, next } = functionData;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    const card = cardRef.current;
    const startX = e.clientX;
    const startY = e.clientY;
    const rect = card.getBoundingClientRect();

    const handleMouseMove = (e) => {
      const newX = position.x + (e.clientX - startX);
      const newY = position.y + (e.clientY - startY);

      setPosition({ x: newX, y: newY });
      onDrag(id, { x: rect.left + newX, y: rect.top + newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      card.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }, [position]);

  return (
    <div
      ref={cardRef}
      className='function-card'
      onMouseDown={handleMouseDown}
      style={{ position: "absolute", left: position.x, top: position.y }}
    >
      <div className='card-header'>
        <span className='dots'>•••</span> Function: {id}
      </div>
      <div className='card-content'>
        <label className='input-label-card'>Equation</label>
        <input type='text' value={equation} readOnly className='input-box' />
        <label className='input-label-card'>Next function</label>
        <select disabled className='dropdown'>
          <option>{next ? `Function: ${next}` : "-"}</option>
        </select>
      </div>
      <div className='card-footer'>
        <span id={`input-${id}`} className='connector-label'>
          input
        </span>
        <span id={`output-${id}`} className='connector-label'>
          output
        </span>
      </div>
    </div>
  );
};

export default FunctionCard;

import React, { useRef, useEffect, useState } from "react";
import "./styles.css";

const FunctionCard = ({
  functionData,
  position,
  setFunctions,
  functions,
  onDrag
}) => {
  const { id, equation, next } = functionData;
  const [cardPosition, setCardPosition] = useState(position); // Set the initial position using the prop
  const cardRef = useRef(null);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newX = cardPosition.x + deltaX;
      const newY = cardPosition.y + deltaY;

      setCardPosition({ x: newX, y: newY });
      onDrag(id, { x: newX, y: newY }); // Notify parent component about the new position
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
      card.style.transform = `translate(${cardPosition.x}px, ${cardPosition.y}px)`;
    }
  }, [cardPosition]);

  return (
    <div
      ref={cardRef}
      className='function-card'
      style={{
        position: "absolute",
        left: cardPosition.x,
        top: cardPosition.y
      }}
    >
      <div className='card-header'>
        <span className='dots' onMouseDown={handleMouseDown}>
          •••
        </span>{" "}
        Function: {id}
      </div>
      <div className='card-content'>
        <label className='input-label-card'>Equation</label>
        <input
          type='text'
          value={equation}
          onChange={(e) => {
            setFunctions((prev) =>
              prev.map((itm) =>
                itm.id === id ? { ...itm, equation: e.target.value } : itm
              )
            );
          }}
          className='input-box'
        />
        <label className='input-label-card'>Next function</label>
        <select
          className='dropdown'
          value={next}
          onChange={(e) =>
            setFunctions((prev) =>
              prev.map((itm) =>
                itm.id === id ? { ...itm, next: e.target.value } : itm
              )
            )
          }
        >
          <option value=''>-</option>
          {functions.map((itm) =>
            itm.id !== id ? (
              <option key={itm.id} value={itm.id}>
                Function: {itm.id}
              </option>
            ) : null
          )}
        </select>
      </div>
      <div className='card-footer'>
        <span id={`input-${id}`} className='connector-label-input'>
          input
        </span>
        <span id={`output-${id}`} className='connector-label-output'>
          output
        </span>
      </div>
    </div>
  );
};

export default FunctionCard;

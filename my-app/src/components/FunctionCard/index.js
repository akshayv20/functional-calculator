import React, { useRef, useEffect, useState } from "react";
import "./styles.css";

const FunctionCard = ({
  functionData,
  position,
  setFunctions,
  functions,
  onDrag
}) => {
  const { id, equation, next, prev } = functionData;

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
          value={functions.find((f) => f.id === next) ? next : "-1"}
          disabled={prev === null} // Disables dropdown if `prev` is null
          onChange={(e) =>
            setFunctions((prev) =>
              prev.map((itm) => {
                if (itm.prev === id) {
                  return { ...itm, prev: null };
                }
                if (itm.id === id) {
                  // Update the 'next' of the current function
                  return {
                    ...itm,
                    next: e.target.value === "-1" ? null : e.target.value
                  };
                }
                if (itm.id === +e.target.value) {
                  // Set the 'prev' of the selected function
                  return { ...itm, prev: id };
                }
                if (itm.prev === id && e.target.value === "-1") {
                  // Remove 'prev' of the previously linked function when unselected
                  return { ...itm, prev: null };
                }
                return itm; // Return the function object unchanged
              })
            )
          }
        >
          <option value='-1'>-</option>
          {functions
            .filter((itm) => itm.id !== id && itm.prev == null) // Exclude current function and those already linked
            .map((itm) => (
              <option key={itm.id} value={itm.id}>
                Function: {itm.id}
              </option>
            ))}
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

import React from 'react';
import Square from "./Square";

function Board({ squares, onClick }) {
  return (
    
    <div className="grid grid-cols-3 gap-2 mb-4">
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
      </div>
  );
}

export default Board;

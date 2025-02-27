import Square from "./Square"

function Board({ squares, onClick }) {
  return (
    <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full max-w-[300px] mx-auto">
      {squares.map((square, i) => (
        <Square key={i} value={square} onClick={() => onClick(i)} />
      ))}
    </div>
  )
}

export default Board





function Board({squares,onClick}) {
    return (
        <div>
            {squares.map((square, i)=>(
                <Square key={i} values={ square} onClick={()=>onClick(i)}   />
        ))}
    </div>
    )
}

export default Board;
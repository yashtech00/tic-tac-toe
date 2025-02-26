
 function Square({value, onClick}) {
    return (
        <div>
            <button onClick={onClick} className="square">
                {value}
            </button>
        </div>
    )
}
export default Square;
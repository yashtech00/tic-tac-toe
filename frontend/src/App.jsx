import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
    winner: null
  });
  const [winner,setWinner] = useState(null);
  const [gameover, setGameOver] = useEffect(false);
  useEffect(() => {
    socket.on('gameState', (state) => {
      setGameState(state);
      const gameWinner = calculateWinner(state.board);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameOver(true);
      } else if (isBoardFull) {
        setWinner('Tie');
        setGameOver(true)
      }
    });

    return () => { socket.off('gameState') };
  }, []);

  const handleClick = (index) => {
    if (gameState.board[index] || gameState.winner) { return };
    socket.emit('makeMove', index);
  };
   
  const handleRestart = () => {
    socket.emit('restartGame');
    setWinner(null);
    setGameOver(false);
  }

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  const isBoardfull = (board) => {
    return board.every((cell) => cell !== null);
  };

  const renderStatusMessage = () => {
    if (winner === 'Tie') {
      return <h2>It's a tie</h2>
    }
  }







  const renderCell = (index) => (
    <button onClick={() => handleClick(index)}>{gameState.board[index]}</button>
  );

  return (
    <div>
      <h1>Multiplayer Tic-Tac-Toe</h1>
      <div className="board">
        {[...Array(9)].map((_, i) => renderCell(i))}
      </div>
      <button onClick={() => socket.emit('restartGame')}>Restart Game</button>
    </div>
  );
}

export default App;
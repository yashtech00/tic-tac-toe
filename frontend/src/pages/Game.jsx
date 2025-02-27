import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Board from "../components/Board";
import { Button, TextField } from "@mui/material";

const socket = io("http://localhost:3000");

function Game() {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
  });
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.on("gameState", (state) => {
      setGameState(state);
      const gameWinner = calculateWinner(state.board);
      if (gameWinner) {
        setWinner(gameWinner);
        setGameOver(true);
      } else if (isBoardFull(state.board)) {
        setWinner("Tie");
        setGameOver(true);
      }
    });

    return () => {
      socket.off("gameState");
    };
  }, []);

  const handleClick = (index) => {
    if (gameState.board[index] || gameOver) {
      return;
    }
    socket.emit("makeMove", index);
  };

  const handleRestart = () => {
    socket.emit("restartGame");
    setWinner(null);
    setGameOver(false);
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (board) => {
    return board.every((cell) => cell !== null);
  };

  const renderStatusMessage = () => {
    if (winner === "Tie") {
      return <h2>It's a tie</h2>;
    } else if (winner) {
      return <h2>Winner : {winner}</h2>;
    } else {
      return <h2>Next Player: {gameState.xIsNext ? "X" : "O"}</h2>;
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 ">
    <div className="flex flex-col items-center   ">
      <h1 className=" text-4xl font-extrabold text-orange-500">X O</h1>
      <div className="bg-white rounded-lg m-6 flex justify-between p-6 gap-32">
      <div className="">
      <Board squares={gameState.board} onClick={handleClick} />
      </div>
      <div>
        chat
        <TextField id="filled-basic" label="Filled" variant="filled" />
        <Button variant="contained">Send</Button>
      </div>
      </div>
    
      <div className="status mb-4 text-2xl">{renderStatusMessage()}</div>
      <div className="flex justify-center mt-4">
        {gameOver && (
          <button
            onClick={handleRestart}
            className="bg-blue-500 text-white py-2 px-4 rounded-md 
                hover:bg-blue-600 focus:outline-none focus:ring-2 
                focus:ring-blue-600 focus:ring-offset-2 transition 
                duration-300 ease-in-out transform hover:scale-105"
          >
            Restart Game
          </button>
        )}
      </div>
      </div>
      </div>
  );
}

export default Game;

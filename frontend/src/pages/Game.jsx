import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Board from "../components/Board";
import { Button, Stack, TextField, Typography } from "@mui/material";
import copy from "copy-to-clipboard";

const socket = io("http://localhost:3000");

function Game() {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
  });
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [room, setRoom] = useState("");
  const [msg, setMsg] = useState([]);
  const [message, setMessage] = useState("");
  
  const [socketId, setSocketId] = useState("");
  console.log(message, "yash message");
  const textRef = useRef();

  //Function to add text to clipboard
  const copyToClipboard = () => {
    // Text from the html element
    let copyText = textRef.current.value;
    // Adding text value to clipboard using copy function
    let isCopy = copy(copyText);
    
  };
  const handleMessage = (e) => {
    e.preventDefault();
    socket.emit("message", { message,room });
    setMessage("");
  };

  
  useEffect(() => {

    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });
    
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
    socket.on("receive-msg", (data) => {
      console.log(data, "yashdataa");
      setMsg((msg) => [...msg, data]);
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
        <h1 className=" text-4xl font-extrabold text-cyan-900  ">Tic Tac Toe</h1>
        



        <div className="bg-white rounded-lg m-6 p-8 ">
        <div className=" flex justify-between gap-32">
          <div className=" flex items-center ">
            <Board squares={gameState.board} onClick={handleClick} />
          </div>
          
          <form onSubmit={handleMessage}>
            <div>
              <div>
                <h5 className="text-center italic text-gray-500 mb-2">Send Your Id to Opponent</h5>
                  <div className="bg-cyan-800 p-4 rounded-lg text-white">Your Room Id :  
                  <input value={socketId} disabled type="text" ref={textRef}  />
                    <button onClick={copyToClipboard}>Copy</button>
                    </div>
                <h5 className="text-center italic text-gray-500 my-2">Set Opponent Id here</h5>
                <h5 className="mb-2 font-medium"> Set Room </h5>
                <TextField
                  label="Room Name"
                  value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    fullWidth
                />
              </div>
              <div className="border-2 overflow-auto border-gray-200 mt-4">
              <div>
                <Stack className="h-[200px]">
                  {msg.map((m, i) => (
                    <Typography key={i}>{m}</Typography>
                  ))}
                </Stack>
              </div>

              <input
                  placeholder="Message " 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="border-2 border-cyan-800 p-4"
                  
                />
              <button  type="submit" className=" p-4 px-10 bg-cyan-900 text-white">
                Send
                </button>
                </div>
            </div>
          </form>
        </div>
        <div className="status mb-4 mt-6 font-semibold text-2xl text-center">{renderStatusMessage()}</div>
        <div className="flex justify-center mt-4 ">
          {gameOver && (
            <button
              onClick={handleRestart}
              className="bg-cyan-900 text-white py-2 px-4 rounded-md 
                hover:bg-cyan-800 focus:outline-none focus:ring-2 
                focus:ring-cyan-800 focus:ring-offset-2 transition 
                duration-300 ease-in-out transform hover:scale-105"
            >
              Restart Game
            </button>
          )}
        </div>
        </div>

       
      </div>
    </div>
  );
}

export default Game;

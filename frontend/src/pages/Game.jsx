"use client"

import { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import Board from "../components/Board"
import { TextField, Typography, Stack } from "@mui/material"
import copy from "copy-to-clipboard"
import { toast } from "react-toastify"
import { Copy } from "lucide-react"

const socket = io("http://localhost:3000")

function Game() {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(null),
    xIsNext: true,
  })
  const [winner, setWinner] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [room, setRoom] = useState("")
  const [msg, setMsg] = useState([])
  const [message, setMessage] = useState("")
  const [socketId, setSocketId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [joinedRoom, setJoinedRoom] = useState(false)

  const textRef = useRef()

  // Function to add text to clipboard
  const copyToClipboard = () => {
    const copyText = textRef.current.value
    const isCopy = copy(copyText)
    if (isCopy) {
      toast.success("Room ID copied to clipboard!", {
        icon: "📋",
      })
    }
  }

  const handleMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error("Message cannot be empty")
      return
    }

    if (!room) {
      toast.error("Please enter a room ID first")
      return
    }

    socket.emit("message", { message, room })
    toast.info("Message sent", {
      icon: "💬",
      autoClose: 2000,
    })
    setMessage("")
  }

  const handleJoinRoom = () => {
    if (!room.trim()) {
      toast.error("Please enter a room ID")
      return
    }

    socket.emit("joinRoom", room)
    setJoinedRoom(true)
    toast.success(`Joined room: ${room}`, {
      icon: "🚪",
    })
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      setIsConnected(true)
      toast.success("Connected to server!", {
        icon: "🔌",
      })
    })

    socket.on("disconnect", () => {
      setIsConnected(false)
      toast.error("Disconnected from server", {
        icon: "🔌",
      })
    })

    socket.on("gameState", (state) => {
      setGameState(state)
      const gameWinner = calculateWinner(state.board)
      if (gameWinner) {
        setWinner(gameWinner)
        setGameOver(true)
        toast.success(`Player ${gameWinner} wins!`, {
          icon: "🏆",
        })
      } else if (isBoardFull(state.board)) {
        setWinner("Tie")
        setGameOver(true)
        toast.info("Game ended in a tie!", {
          icon: "🤝",
        })
      }
    })

    socket.on("receive-msg", (data) => {
      setMsg((msg) => [...msg, data])
      toast.info("New message received", {
        icon: "📩",
        autoClose: 2000,
      })
    })

    socket.on("playerJoined", (playerId) => {
      toast.success(`Player ${playerId} joined the game!`, {
        icon: "👋",
      })
    })

    socket.on("playerLeft", (playerId) => {
      toast.info(`Player ${playerId} left the game`, {
        icon: "👋",
      })
    })

    socket.on("error", (errorMsg) => {
      toast.error(errorMsg)
    })

    return () => {
      socket.off("gameState")
      socket.off("receive-msg")
      socket.off("playerJoined")
      socket.off("playerLeft")
      socket.off("error")
    }
  }, [])

  const handleClick = (index) => {
    if (gameState.board[index] || gameOver) {
      return
    }

    if (!joinedRoom) {
      toast.warning("Please join a room first")
      return
    }

    socket.emit("makeMove", index)
  }

  const handleRestart = () => {
    socket.emit("restartGame")
    setWinner(null)
    setGameOver(false)
    toast.info("Game restarted", {
      icon: "🔄",
    })
  }

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
    ]
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const isBoardFull = (board) => {
    return board.every((cell) => cell !== null)
  }

  const renderStatusMessage = () => {
    if (winner === "Tie") {
      return <h2>It's a tie</h2>
    } else if (winner) {
      return <h2>Winner: {winner}</h2>
    } else {
      return <h2>Next Player: {gameState.xIsNext ? "X" : "O"}</h2>
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col items-center w-full max-w-6xl">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-cyan-900 mb-4">Tic Tac Toe</h1>

        <div className="bg-white rounded-lg shadow-lg w-full p-4 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-8">
            <div className="flex items-center justify-center mb-8 lg:mb-0">
              <Board squares={gameState.board} onClick={handleClick} />
            </div>

            <div className="w-full lg:w-1/2">
              <div>
                <div>
                  <h5 className="text-center italic text-gray-500 mb-2">Send Your Id to Opponent</h5>
                  <div className="bg-cyan-800 p-3 rounded-lg text-white flex items-center flex-wrap gap-2">
                    <span>Your Room Id:</span>
                    <div className="flex-1 flex items-center">
                      <input
                        value={socketId}
                        disabled
                        type="text"
                        ref={textRef}
                        className="bg-cyan-800 px-2 flex-1 min-w-0 truncate"
                      />
                      <button type="button" onClick={copyToClipboard} className="p-1 hover:bg-cyan-700 rounded">
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  <h5 className="text-center italic text-gray-500 my-2">Set Opponent Id here</h5>
                  <div className="flex items-center gap-2">
                    <TextField
                      label="Room Name"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <button
                      onClick={handleJoinRoom}
                      className="whitespace-nowrap bg-cyan-900 text-white py-2 px-3 rounded hover:bg-cyan-700 transition-colors"
                    >
                      Join Room
                    </button>
                  </div>
                </div>

                <form onSubmit={handleMessage} className="mt-4">
                  <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                    <div>
                      <Stack className="h-[150px] sm:h-[200px] p-2 overflow-auto">
                        {msg.map((m, i) => (
                          <Typography key={i} variant="body2">
                            {m}
                          </Typography>
                        ))}
                      </Stack>
                    </div>

                    <div className="flex flex-col sm:flex-row">
                      <input
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="border-t-2 border-cyan-800 p-2 sm:p-3 flex-1"
                      />
                      <button type="submit" className="p-2 sm:p-3 px-4 sm:px-6 bg-cyan-900 text-white">
                        Send
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="status my-4 font-semibold text-xl sm:text-2xl text-center text-cyan-900">
            {renderStatusMessage()}
          </div>

          <div className="flex justify-center mt-4">
            {gameOver && (
              <button
                onClick={handleRestart}
                className="bg-cyan-900 text-white py-2 px-6 rounded-md 
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
  )
}

export default Game


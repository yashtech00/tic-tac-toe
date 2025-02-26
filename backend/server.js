import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from 'redis';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  }
});

const pubClient = createClient();
const subClient = createClient();
await pubClient.connect();
await subClient.connect();

subClient.subscribe('game-moves');

let gameState = {
  board: Array(9).fill(null),
  xIsNext: true,
};

function resetGame() {
  gameState = {
    board: Array(9).fill(null),
    xIsNext: true,
  };
}

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('gameState', gameState);

  socket.on('makeMove', (index) => {
    if (gameState.board[index] || calculateWinner(gameState.board)) return;

    gameState.board[index] = gameState.xIsNext ? 'X' : 'O';
    gameState.xIsNext = !gameState.xIsNext;
    io.emit('gameState', gameState);

    // Check if the game is over
    if (calculateWinner(gameState.board) || isBoardFull(gameState.board)) {
      io.emit('gameOver', gameState);
    }
  });

  socket.on('restartGame', () => {
    resetGame();
    io.emit('gameState', gameState);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

server.listen(3000, () => {
  console.log('WebSocket server running on port 3000');
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
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
io.on("connection", (socket) => {
    console.log("new client connected ", socket.id);
    socket.emit("gameState", gameState);
    socket.on("makeMove", (index) => {
        if (gameState.board[index] || calculateWinner(gameState.board))
            return;
        gameState.board[index] = gameState.xIsNext ? "X" : "O";
        gameState.xIsNext = !gameState.xIsNext;
        io.emit("gameState", gameState);
        if (calculateWinner(gameState.board) || isBoardFull(gameState.board)) {
            io.emit("gameOver", gameState);
        }
    });
    socket.on("restartGame", () => {
        resetGame();
        io.emit("gameState", gameState);
    });
    socket.on("disconnect", () => {
        console.log("client Disconnected");
    });
});
function calculateWinner(squares) {
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
    console.log(`websockets server is running on ${PORT}`);
});

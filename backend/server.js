import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { createClient } from 'redis';
import {Server } from 'socket.io'

dotenv.config();

const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

//Initialize Redis Clients
const pubClient = createClient();
const subClient = createClient();
await pubClient.connect();
await subClient.connect();

//subscribe ton the redis channel for game updates
await subClient.subscribe('game-moves', (message) => {
    gameState = json.parse(message);
    io.emit('gameState', gameState);
})

// Define initial game state

let gameState = {
    board: Array(9).fill(null),
    xIsNext: true
};

//function to reset the game

function resetGame() {
    gameState = {
        board: Array(9).fill(null),
        xIsNext: true
    }
}

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    
    //send the current game state to the newly connected client
    socket.emit('gameState', gameState);

    //handle player moves
    socket.on('makeMove', (index) => {
        
        //prevent making a move if cell is already taken or game is over
        if (gameState.board[index] || calculateWinner(gameState.board)) return;

        //update board and switch moves

        gameState.board[index] = gameState.xIsNext ? 'X' : 'O';
        gameState.xIsNext = !gameState.xIsNext;

        //publish the updated game state to redis

        pubClient.publish('game-moves', JSON.stringify(gameState));
        io.emit('gameState', gameState);



        if (calculateWinner(gameState.board) || isBoardFull(gameState.board)) {
            io.emit('gameOver', gameState); 
        }
    });

    // handle game restart

    socket.on('restartGame', () => {
        resetGame();
        io.emit('gameState', gameState);
    })
    socket.on('disconnect', () => {
        console.log('client disconnected', socket.id);
        
    });
})

function calculateWinner(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function isBoardFull(board) {
    return board.every((cell) => cell !== null);
}

server.listen(3000, () => {
    console.log(`websocket server running on port ${3000}`);    
})



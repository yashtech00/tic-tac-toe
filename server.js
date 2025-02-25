
import dotenv from 'dotenv';
import express from 'express';
import { createClient } from 'redis';
import {Server, Socket} from 'socket.io'

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




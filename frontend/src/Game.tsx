import { useEffect, useState } from "react";

import { io } from "socket.io-client";
import Board from "./Board";
import { Button } from "@material-tailwind/react";


const socket = io('http://localhost:3000')
function Game() {

    const [gameState, setGameState] = useState({
        board: Array(9).fill(null),
        xIsNext: true,
    });
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    useEffect(() => {
        socket.on('gameState', (state) => {
            setGameState(state);
            const gameWinner = calculateWinner(gameState.board);
            if (gameWinner) {
                setWinner(gameWinner);
                setGameOver(true);
            } else if (isBoardFull(state.board)) {
                setWinner(`Tie`);
                setGameOver(true);
            }
        })
        return () => {
            socket.off('gameState')
        }
    }, [])

    const calculateWinner = (squares: any[]) => {
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
    const handleRestart = () => {
        socket.emit('restartGame');
        setWinner(null);
        setGameOver(false);
    }

    const isBoardFull = (board: any[]) => {
        return board.every((cell) => cell !== null);
    }
    const handleClick = (index: number) => {
        if (gameState.board[index] || gameOver) {
            return;
        }
        socket.emit('makeMove', index)
    };
    const renderStatusMessage = () => {
        if (winner === 'Tie') {
            return <h2>It's a Tie!</h2>;
        } else if (winner) {
            return <h2>Winner: {winner}</h2>;
        } else {
            return <h2>Next Player: {gameState.xIsNext ? 'X' : 'O'}</h2>;
        }
    };
    return (
        <div >
            <img src="https://c8.alamy.com/comp/2GGD3MM/tic-tac-toe-game-texture-hand-drawn-seamless-cross-shapes-pattern-black-elements-on-white-background-2GGD3MM.jpg" alt="bg image"/>
            <h1>Multiplayer Tic-Tac-Toe</h1>
            <Board squares={gameState.board} onClick={handleClick} />
            <div className="">{renderStatusMessage()}</div>

            {gameOver && (
                <button  onClick={handleRestart} className="restart-button">Restart Game</button>
            )}


        </div>
    )
}

export default Game;
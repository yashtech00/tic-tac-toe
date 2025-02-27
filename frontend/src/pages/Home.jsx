import { Input } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function Home() {
  return (
    <div className="h-screen flex justify-center bg-gray-100 ">
      <div className="">
        <div>
          <img
            src="https://media.istockphoto.com/id/1471299866/vector/tic-tac-toe-doodle-game-with-cross-and-circle-sign-cute-heart-mark-isolated-on-white.jpg?s=612x612&w=0&k=20&c=fSbBLTPB3TzcjlFDKrjkXpPiERDfX-7USSxxp73UPCo="
            width={400}
            height={400}
            className="rounded-xl m-8"
          />
        </div>
        <div className="text-5xl text-center m-4">Tic Tac Toe</div>
        <div className="text-center">
          Dive into the excitement now and experience{" "}
        </div>
        <div className="text-center">
          the timeless joy of this classic game!
        </div>

        <div className="text-center  ">
          <Link to={"/Game"}>
            <button className="text-white text-3xl bg-cyan-900 p-4 m-4 hover:bg-cyan-700">
              New Game
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

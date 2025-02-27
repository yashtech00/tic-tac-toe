import { useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import { toast } from "react-toastify"

const socket = io("http://localhost:3000")

export default function Home() {
  const navigate = useNavigate()

  const handleNewGame = () => {
    toast.success("Starting a new game!", {
      icon: "🎮",
    })
    // We use setTimeout to allow the toast to be visible before navigation
    setTimeout(() => {
      navigate("/Game")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          <img
            src="https://media.istockphoto.com/id/1471299866/vector/tic-tac-toe-doodle-game-with-cross-and-circle-sign-cute-heart-mark-isolated-on-white.jpg?s=612x612&w=0&k=20&c=fSbBLTPB3TzcjlFDKrjkXpPiERDfX-7USSxxp73UPCo="
            alt="Tic Tac Toe Logo"
            className="rounded-xl mx-auto w-full h-auto"
          />
        </div>
        <div className="text-3xl sm:text-4xl md:text-5xl text-center font-bold my-4 text-cyan-900">Tic Tac Toe</div>
        <div className="text-center text-sm sm:text-base px-4">
          Dive into the excitement now and experience{" "}
          <span className="block">the timeless joy of this classic game!</span>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleNewGame}
            className="text-white text-xl sm:text-2xl md:text-3xl bg-cyan-900 px-6 py-3 rounded-lg hover:bg-cyan-700 transition-colors duration-300 shadow-lg"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  )
}


import { BrowserRouter, Route, Routes } from "react-router-dom";
import Game from "./pages/Game";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route element={<Home />} path="/"></Route>
          <Route element={<Game />} path="/Game"></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

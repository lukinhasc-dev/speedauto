import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./pages/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pagina-inicial" element={<Sidebar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

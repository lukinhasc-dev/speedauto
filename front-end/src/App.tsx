import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Sidebar from "./components/Sidebar";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pagina-inicial" element={<Sidebar />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

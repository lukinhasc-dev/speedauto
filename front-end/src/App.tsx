import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import DashboardHeader from "./components/DashboardHeader";
import MainHeader from "./components/MainHeader";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Veiculos from "./pages/Veiculos";
import Vendas from "./pages/Vendas";
import Clientes from "./pages/Clientes";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Admin from "./pages/Admin";
import Financiamento from "./pages/Financiamento"


function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />
      <Route path="/admin-cadastrar" element={<Admin></Admin>} />

      <Route element={<Layout HeaderComponent={DashboardHeader} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<Layout HeaderComponent={MainHeader} />}>
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/vendas" element={<Vendas />} />

        <Route path="/clientes" element={<Clientes/>} />
        <Route path="/financiamento" element={<Financiamento />} />
        <Route path="/relatorios" element={<Relatorios/>} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>

    </Routes>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return <h1 className="text-3xl font-bold">{title}</h1>;
}

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/esqueci-senha" element={<ForgotPassword />} />

      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/veiculos" element={<Placeholder title="Página de Veículos" />} />
        <Route path="/vendas" element={<Placeholder title="Página de Vendas" />} />
        <Route path="/clientes" element={<Placeholder title="Página de Clientes" />} />
        <Route path="/relatorios" element={<Placeholder title="Página de Relatórios" />} />
        <Route path="/configuracoes" element={<Placeholder title="Página de Configurações" />} />
      </Route>

    </Routes>
  );
}

export default App;
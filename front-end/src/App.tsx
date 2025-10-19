import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

interface PlaceholderProps {
  title: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ title }) => {
  return <h1 className="text-3xl font-bold">{title}</h1>;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pagina-inicial" element={<Dashboard/>} />
        <Route path="veiculos" element={<Placeholder title="Página de Veículos" />} />
        <Route path="vendas" element={<Placeholder title="Página de Vendas" />} />
        <Route path="clientes" element={<Placeholder title="Página de Clientes" />} />
        <Route path="relatorios" element={<Placeholder title="Página de Relatórios" />} />
        <Route path="configuracoes" element={<Placeholder title="Página de Configurações" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

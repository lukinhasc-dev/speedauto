import React, { useState, type FormEvent, useMemo, useEffect } from "react";
import {
  FaPlus,
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaTimes,
  FaWallet,
  FaReceipt,
  FaCalendarCheck,
  FaSearch,
  FaInfoCircle,
  FaCalendarDay,
  FaDollarSign,
} from "react-icons/fa";
import type { Venda } from "../types/Venda";
import * as vendasApi from "../api/vendasApi";

type ModalMode = "closed" | "add" | "edit" | "delete" | "view";

interface DetailItemProps {
  label: string;
  value: string | number | React.ReactNode;
  highlight?: boolean;
  fullWidth?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  highlight = false,
  fullWidth = false,
}) => (
  <div className={`grid gap-1 ${fullWidth ? "grid-cols-1" : "grid-cols-2"}`}>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div
      className={`text-base ${highlight ? "font-bold text-speedauto-primary" : "text-gray-800"
        }`}
    >
      {value}
    </div>
  </div>
);

export default function Vendas() {
  const [sales, setSales] = useState<Venda[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [selectedSale, setSelectedSale] = useState<Venda | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Todos" | Venda["status"]>(
    "Todos"
  );
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");
  const [valorInput, setValorInput] = useState('');

  useEffect(() => {
    const fetchVendas = async () => {
      try {
        const allVenda: Venda[] = await vendasApi.getVendas();
        setSales(allVenda);
      } catch (err) {
        console.error('Erro ao buscar vendas:', err);
      }
    };

    fetchVendas();
  }, []);

  const filteredSales = useMemo(() => {
    let currentSales = sales;
    const lowerCaseSearch = searchTerm.toLowerCase();

    if (filterStatus !== "Todos") {
      currentSales = currentSales.filter((s) => s.status === filterStatus);
    }

    if (dataInicio && dataFim) {
      const start = new Date(dataInicio);
      const end = new Date(dataFim);
      end.setHours(23, 59, 59, 999);

      currentSales = currentSales.filter((s) => {
        if (s.data === "N/A") return false;

        const saleDate = new Date(s.data);

        return saleDate >= start && saleDate <= end;
      });
    }

    if (searchTerm) {
      currentSales = currentSales.filter(
        (s) =>
          s.cliente.toLowerCase().includes(lowerCaseSearch) ||
          s.veiculo.toLowerCase().includes(lowerCaseSearch) ||
          s.id.toString().includes(lowerCaseSearch)
      );
    }

    return currentSales;
  }, [sales, searchTerm, filterStatus, dataInicio, dataFim]);

  const openModal = (mode: ModalMode, sale: Venda | null = null) => {
    setModalMode(mode);
    setSelectedSale(sale);
    if (sale?.valor) {
      const formatted = sale.valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setValorInput(formatted);
    } else {
      setValorInput('');
    }
  };
  const closeModal = () => {
    setModalMode("closed");
    setSelectedSale(null);
    setValorInput('');
  };

  const handleValorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    input = input.replace(/\D/g, '');
    const numValue = parseInt(input || '0') / 100;
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setValorInput(formatted);
  };

  const parseCurrencyToNumber = (value: string): number => {
    const cleaned = value.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  //Salvar Venda (Adicionar ou Editar)
  const handleSaveSale = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const saleData = Object.fromEntries(formData.entries()) as Omit<Venda, 'id'> & { valor: string };

    if (!valorInput || valorInput.trim() === '') {
      alert('O campo "valor" é obrigatório.');
      return;
    }

    try {
      let savedSale: Venda;
      const valorNumber = parseCurrencyToNumber(valorInput);

      if (isNaN(valorNumber) || valorNumber <= 0) {
        alert('Valor inválido.');
        return;
      }

      if (modalMode === 'add') {
        savedSale = await vendasApi.addVenda({ ...saleData, valor: valorNumber });
        setSales([...sales, savedSale]);
      } else if (modalMode === 'edit' && selectedSale) {
        savedSale = await vendasApi.updateVenda(selectedSale.id, { ...saleData, valor: valorNumber });
        setSales(sales.map((s) => (s.id === selectedSale.id ? savedSale : s)));
      }

      closeModal();
    } catch (err) {
      console.error('Erro ao salvar venda:', err);
      alert('Ocorreu um erro ao salvar a venda. Verifique o console.');
    }
  };


  //Deletar Venda
  const handleDeleteSale = async () => {
    if (!selectedSale) return;

    try {
      // Chama a API pra deletar
      await vendasApi.deleteVenda(selectedSale.id);

      // Atualiza o state local
      setSales(sales.filter((s) => s.id !== selectedSale.id));

      closeModal();
    } catch (err) {
      console.error("Erro ao deletar venda:", err);
      alert("Ocorreu um erro ao deletar a venda. Verifique o console.");
    }
  };

  // Cálculo dos KPIs de Vendas
  const totalRevenue = sales
    .filter((s) => s.status === "Concluída")
    .reduce((acc, sale) => acc + sale.valor, 0);
  const completedSales = sales.filter((s) => s.status === "Concluída").length;
  const averageTicket = completedSales > 0 ? totalRevenue / completedSales : 0;

  const formatDisplayDate = (dateString: string) => {
    if (dateString === "N/A") return "Em Andamento";
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };

  const renderStatusBadge = (status: Venda["status"]) => {
    const styles = {
      Concluída: "bg-green-100 text-green-700",
      "Em Andamento": "bg-yellow-100 text-yellow-700",
      Cancelada: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const KpiCard = ({
    title,
    value,
    icon,
    colorClass,
  }: {
    title: string;
    value: string;
    icon: React.ReactNode;
    colorClass: string;
  }) => (
    <div className="bg-white rounded-lg p-6 shadow border border-gray-200 transition-all hover:shadow-md">
      <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
        <div className={colorClass}>{icon}</div>
        <h3>{title}</h3>
      </div>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Histórico de Vendas
          </h1>
          <p className="text-gray-500 mt-1">
            Visão geral das transações e desempenho financeiro.
          </p>
        </div>
        <button
          onClick={() => openModal("add")}
          className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-speedauto-primary-hover transition-all shadow-sm"
        >
          <FaPlus /> Adicionar Venda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <KpiCard
          title="Faturamento Total (Concluídas)"
          value={formatCurrency(totalRevenue)}
          icon={<FaWallet />}
          colorClass="text-speedauto-primary"
        />
        <KpiCard
          title="Ticket Médio"
          value={formatCurrency(averageTicket)}
          icon={<FaReceipt />}
          colorClass="text-speedauto-green"
        />
        <KpiCard
          title="Vendas Concluídas (Total)"
          value={completedSales.toString()}
          icon={<FaCalendarCheck />}
          colorClass="text-speedauto-yellow"
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6 flex items-center gap-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar por cliente, veículo ou ID da venda..."
            className="border border-gray-300 rounded-lg p-2 text-sm w-full bg-white shadow-sm pl-10 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
        </div>

        <select
          className="border border-gray-300 rounded-lg p-2 text-sm bg-white shadow-sm text-gray-700 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary min-w-[150px]"
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "Todos" | Venda["status"])
          }
        >
          <option value="Todos">Status: Todos</option>
          <option value="Concluída">Concluída</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <div className="flex items-center gap-3 border border-gray-300 rounded-lg p-2 bg-gray-50 shadow-sm text-sm">
          <FaCalendarDay className="text-gray-500" size={14} />
          <span className="text-gray-600 font-medium">De:</span>
          <input
            type="date"
            className="bg-gray-50 text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            title="Data de Início"
          />

          <span className="text-gray-600 font-medium ml-2">Até:</span>
          <input
            type="date"
            className="bg-gray-50 text-gray-700 focus:outline-none focus:ring-0 cursor-pointer"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            title="Data Final"
          />
        </div>

        {(dataInicio || dataFim) && (
          <button
            onClick={() => {
              setDataInicio("");
              setDataFim("");
            }}
            className="text-xs text-speedauto-red hover:text-red-700 transition-colors"
            title="Limpar Datas"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                ID Venda
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Cliente
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Veículo
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Valor Total
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Data
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Status
              </th>
              <th className="p-4 text-center text-xs font-semibold uppercase text-gray-600">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-sm text-gray-700 font-mono">
                    #SA-{sale.id}
                  </td>
                  <td className="p-4 text-sm text-gray-800 font-medium">
                    {sale.cliente}
                  </td>
                  <td className="p-4 text-sm text-gray-700">{sale.veiculo}</td>
                  <td className="p-4 text-sm text-gray-800 font-semibold">
                    {formatCurrency(sale.valor)}
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    {formatDisplayDate(sale.data)}
                  </td>
                  <td className="p-4 text-sm">
                    {renderStatusBadge(sale.status)}
                  </td>

                  <td className="p-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal("view", sale)}
                        title="Detalhes"
                        className="p-2 rounded-full text-gray-400 hover:text-speedauto-primary hover:bg-gray-100 transition-all"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openModal("edit", sale)}
                        title="Editar"
                        className="p-2 rounded-full text-gray-400 hover:text-speedauto-primary hover:bg-gray-100 transition-all"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openModal("delete", sale)}
                        title="Excluir"
                        className="p-2 rounded-full text-gray-400 hover:text-speedauto-red hover:bg-red-50 transition-all"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <div className="text-center p-12">
                    <FaDollarSign className="mx-auto text-5xl text-gray-300" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                      Nenhuma venda encontrada
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ajuste os filtros ou o intervalo de datas para encontrar
                      vendas.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("Todos");
                        setDataInicio("");
                        setDataFim("");
                      }}
                      className="mt-6 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto hover:bg-gray-300 transition-all"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "add"
                  ? "Registrar Nova Venda"
                  : `Editar Venda #SA-${selectedSale?.id}`}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSale}>
              <div className="p-6 space-y-8">
                <div className="border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    1. Cliente e Veículo
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="form-group">
                      <label
                        htmlFor="cliente"
                        className="block text-sm font-semibold mb-1 text-gray-700"
                      >
                        Nome do Cliente
                      </label>
                      <input
                        type="text"
                        name="cliente"
                        defaultValue={selectedSale?.cliente}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        placeholder="Ex: Maria Costa"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="veiculo"
                        className="block text-sm font-semibold mb-1 text-gray-700"
                      >
                        Veículo Vendido
                      </label>
                      <input
                        type="text"
                        name="veiculo"
                        defaultValue={selectedSale?.veiculo}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        placeholder="Ex: Jeep Renegade"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    2. Detalhes da Venda
                  </h3>
                  <div className="grid grid-cols-3 gap-5">
                    <div className="form-group">
                      <label
                        htmlFor="valor"
                        className="block text-sm font-semibold mb-1 text-gray-700"
                      >
                        Valor Total (R$)
                      </label>
                      <input
                        type="text"
                        name="valor"
                        value={valorInput}
                        onChange={handleValorInput}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        placeholder="Ex: 120.000,00"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="data"
                        className="block text-sm font-semibold mb-1 text-gray-700"
                      >
                        Data da Venda
                      </label>
                      <input
                        type="date"
                        name="data"
                        defaultValue={
                          selectedSale?.data === "N/A" ? "" : selectedSale?.data
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="status"
                        className="block text-sm font-semibold mb-1 text-gray-700"
                      >
                        Status
                      </label>
                      <select
                        name="status"
                        defaultValue={selectedSale?.status ?? "Em Andamento"}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        required
                      >
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluída">Concluída</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    </div>

                    <div className="form-group col-span-3">
                      <label
                        htmlFor="observacoes"
                        className="block text-sm font-semibold mb-1 text-gray-700"
                      >
                        Observações
                      </label>
                      <textarea
                        name="observacoes"
                        defaultValue={selectedSale?.observacoes}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        rows={3}
                        placeholder="Notas sobre o pagamento, financiamento, etc."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t rounded-b-lg flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-speedauto-primary-hover transition-all"
                >
                  {modalMode === "add" ? (
                    <FaPlus size={14} className="inline-block mr-2" />
                  ) : (
                    <FaPencilAlt size={14} className="inline-block mr-2" />
                  )}
                  {modalMode === "add"
                    ? "Registrar Venda"
                    : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === "view" && selectedSale && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaInfoCircle className="text-speedauto-primary" /> Detalhes da
                Venda{" "}
                <span className="text-base font-normal text-gray-500">
                  #SA-{selectedSale.id}
                </span>
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <DetailItem label="Cliente" value={selectedSale.cliente} />
              <DetailItem label="Veículo" value={selectedSale.veiculo} />
              <DetailItem
                label="Valor Total"
                value={formatCurrency(selectedSale.valor)}
                highlight={true}
              />
              <DetailItem
                label="Status Atual"
                value={renderStatusBadge(selectedSale.status)}
              />
              <DetailItem
                label="Data da Transação"
                value={formatDisplayDate(selectedSale.data)}
              />
              <DetailItem
                label="Observações"
                value={
                  selectedSale.observacoes || "Nenhuma observação registrada."
                }
                fullWidth={true}
              />
            </div>

            <div className="p-6 bg-gray-50 border-t rounded-b-lg flex justify-end gap-4">
              <button
                onClick={() => openModal("edit", selectedSale)}
                className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                <FaPencilAlt className="inline-block mr-1" /> Editar
              </button>
              <button
                onClick={closeModal}
                className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-speedauto-primary-hover transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalMode === "delete" && selectedSale && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Excluir Venda
              </h2>
              <p className="text-gray-600 mt-4">
                Tem certeza que deseja excluir a venda do veículo{" "}
                <strong>{selectedSale.veiculo}</strong> para o cliente{" "}
                <strong>{selectedSale.cliente}</strong>?
              </p>
              <p className="text-gray-600 mt-2">
                Esta ação irá remover o registro financeiro.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end gap-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteSale}
                className="bg-speedauto-red text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

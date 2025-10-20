import React, { useState, type FormEvent, useMemo, useEffect } from "react";
import {
  FaPlus,
  FaEye,
  FaPencilAlt,
  FaTrash,
  FaTimes,
  FaUsers,
  FaSearch,
  FaInfoCircle,
  FaEnvelope,
  FaPhone,
  FaClipboardCheck,
  FaUser,
} from "react-icons/fa";
import * as clientesApi from "../api/clientesApi";
import type { Clientes } from "../types/Cliente";

type ModalMode = "closed" | "add" | "edit" | "delete" | "view";
type StatusCliente = "Lead" | "Ativo" | "Inativo";

interface DetailItemProps {
  label: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  highlight?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  icon,
  highlight = false,
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
    <div
      className={`p-2 rounded-full ${
        highlight
          ? "bg-speedauto-primary/10 text-speedauto-primary"
          : "bg-gray-200 text-gray-600"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <div
        className={`text-base mt-0.5 ${
          highlight
            ? "font-bold text-speedauto-primary"
            : "font-medium text-gray-800"
        }`}
      >
        {value ?? "—"} {/* Garante que sempre tem algo pra renderizar */}
      </div>
    </div>
  </div>
);

export default function Clientes() {
  const [clients, setClients] = useState<Clientes[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [selectedClient, setSelectedClient] = useState<Clientes | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");

  // Buscar clientes
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await clientesApi.getClientes();
        setClients(data ?? []);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  // Filtrar clientes
  const filteredClients = useMemo(() => {
    let currentClients = clients ?? [];
    const lowerCaseSearch = String(searchTerm ?? '').toLowerCase();

    if (filterStatus !== "Todos") {
      currentClients = currentClients.filter((c) => c.status === filterStatus);
    }

    if (lowerCaseSearch) {
      currentClients = currentClients.filter((c) => {
        const nome = c.nome ? String(c.nome).toLowerCase() : '';
        const email = c.email ? String(c.email).toLowerCase() : '';
        const telefone = c.telefone ? String(c.telefone).toLowerCase() : '';
        const idStr = c.id != null ? String(c.id).toLowerCase() : '';

        return (
          nome.includes(lowerCaseSearch) ||
          email.includes(lowerCaseSearch) ||
          telefone.includes(lowerCaseSearch) ||
          idStr.includes(lowerCaseSearch)
        );
      });
    }

    return currentClients;
  }, [clients, searchTerm, filterStatus]);

  const openModal = (mode: ModalMode, client: Clientes | null = null) => {
    setModalMode(mode);
    setSelectedClient(client);
  };

  const closeModal = () => {
    setModalMode("closed");
    setSelectedClient(null);
  };

  const handleSaveClient = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const clientData = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const newOrUpdatedClient: Clientes = {
      id: modalMode === "add" ? Date.now() : selectedClient?.id ?? 0,
      nome: clientData.nome || selectedClient?.nome || "",
      email: clientData.email || selectedClient?.email || "",
      telefone: clientData.telefone || selectedClient?.telefone || "",
      status:
        (clientData.status as Clientes["status"]) ||
        selectedClient?.status ||
        "Ativo",
    };

    try {
      let savedClient: Clientes;

      if (modalMode === "add") {
        savedClient = await clientesApi.addCliente({
          nome: newOrUpdatedClient.nome,
          email: newOrUpdatedClient.email,
          telefone: newOrUpdatedClient.telefone,
          status: newOrUpdatedClient.status,
        });
        setClients([...clients, savedClient]);
      } else if (modalMode === "edit" && selectedClient) {
        savedClient = await clientesApi.updateCliente(selectedClient.id, {
          nome: newOrUpdatedClient.nome,
          email: newOrUpdatedClient.email,
          telefone: newOrUpdatedClient.telefone,
          status: newOrUpdatedClient.status,
        });
        setClients(
          clients.map((c) => (c.id === selectedClient.id ? savedClient : c))
        );
      }

      closeModal();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      alert("Ocorreu um erro ao salvar o cliente. Veja o console.");
    }
  };

  const handleDeleteClient = async () => {
    if (selectedClient) {
      await clientesApi.deleteCliente(selectedClient.id);
      setClients(clients.filter((c) => c.id !== selectedClient.id));
      closeModal();
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const renderStatusBadge = (status: StatusCliente) => {
    const styles: Record<StatusCliente, string> = {
      Lead: "bg-blue-100 text-blue-700",
      Ativo: "bg-green-100 text-green-700",
      Inativo: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${
          styles[status] ?? "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Clientes</h1>
        <p className="text-gray-500 mt-1">
          Visão geral e gerenciamento dos seus clientes e leads.
        </p>
      </div>

      {/* Filtros e Adicionar Cliente */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou telefone..."
              className="border border-gray-300 rounded-lg p-2 text-sm w-96 bg-white shadow-sm pl-10 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          </div>

          <select
            className="border border-gray-300 rounded-lg p-2 text-sm bg-white shadow-sm text-gray-700 focus:ring-1 focus:ring-speedauto-primary focus:border-speedauto-primary min-w-[150px]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Todos">Status: Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Lead">Lead</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <button
          onClick={() => openModal("add")}
          className="bg-speedauto-primary text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-speedauto-primary-hover transition-all shadow-sm"
        >
          <FaPlus /> Adicionar Cliente
        </button>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Cliente
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Email
              </th>
              <th className="p-4 text-left text-xs font-semibold uppercase text-gray-600">
                Telefone
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
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm shadow-sm">
                      {getInitials(client.nome)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {client.nome ?? "—"}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {client.id ?? "—"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-700">{client.email ?? "—"}</td>
                  <td className="p-4 text-sm text-gray-700">{client.telefone ?? "—"}</td>
                  <td className="p-4 text-sm">{renderStatusBadge(client.status)}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openModal("view", client)}
                        title="Visualizar"
                        className="p-2 rounded-full text-gray-400 hover:text-speedauto-primary hover:bg-gray-100 transition-all"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => openModal("edit", client)}
                        title="Editar"
                        className="p-2 rounded-full text-gray-400 hover:text-speedauto-primary hover:bg-gray-100 transition-all"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => openModal("delete", client)}
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
                <td colSpan={6}>
                  <div className="text-center p-12">
                    <FaUsers className="mx-auto text-5xl text-gray-300" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-700">
                      Nenhum cliente encontrado
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Ajuste os filtros ou o termo de pesquisa.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("Todos");
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

      {/* Modais */}
      {(modalMode === "add" || modalMode === "edit") && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                {modalMode === "add" ? "Cadastrar Novo Cliente" : "Editar Cliente"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 p-1">
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveClient}>
              <div className="p-6 space-y-8">
                <div className="border border-gray-200 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    1. Detalhes de Contato
                  </h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="form-group">
                      <label htmlFor="nome" className="block text-sm font-semibold mb-1 text-gray-700">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        name="nome"
                        defaultValue={selectedClient?.nome ?? ""}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        placeholder="Ex: Maria Souza"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={selectedClient?.email ?? ""}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        placeholder="Ex: maria@email.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="telefone" className="block text-sm font-semibold mb-1 text-gray-700">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="telefone"
                        defaultValue={selectedClient?.telefone ?? ""}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        placeholder="Ex: (11) 99999-9999"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="status" className="block text-sm font-semibold mb-1 text-gray-700">
                        Status
                      </label>
                      <select
                        name="status"
                        defaultValue={selectedClient?.status ?? "Lead"}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white transition-all focus:outline-none focus:border-speedauto-primary focus:ring-2 focus:ring-speedauto-primary/50"
                        required
                      >
                        <option value="Lead">Lead</option>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </select>
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
                  {modalMode === "add" ? <FaPlus size={14} className="inline-block mr-2" /> : <FaPencilAlt size={14} className="inline-block mr-2" />}
                  {modalMode === "add" ? "Cadastrar Cliente" : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === "view" && selectedClient && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <FaUser className="text-speedauto-primary" /> Detalhes do Cliente
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 p-1">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <h3 className="text-xl font-bold text-gray-700 border-b pb-2 mb-4">
                {selectedClient.nome ?? "—"}
              </h3>

              <div className="grid grid-cols-1 gap-2">
                <DetailItem
                  label="Status Atual"
                  value={renderStatusBadge(selectedClient.status)}
                  icon={<FaClipboardCheck />}
                  highlight={selectedClient.status === "Ativo" ||
                    selectedClient.status === "Lead"
                  }
                />
                <DetailItem
                  label="ID Cliente"
                  value={selectedClient.id ?? "—"}
                  icon={<FaInfoCircle />}
                />
                <DetailItem
                  label="E-mail"
                  value={selectedClient.email ?? "—"}
                  icon={<FaEnvelope />}
                />
                <DetailItem
                  label="Telefone"
                  value={selectedClient.telefone ?? "—"}
                  icon={<FaPhone />}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t rounded-b-lg flex justify-end gap-4">
              <button
                onClick={() => openModal("edit", selectedClient)}
                className="bg-white border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                <FaPencilAlt className="inline-block mr-1" /> Editar Perfil
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

      {modalMode === "delete" && selectedClient && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md animate-fade-in-up">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">Excluir Cliente</h2>
              <p className="text-gray-600 mt-4">
                Tem certeza que deseja excluir o registro de{" "}
                <strong>{selectedClient.nome}</strong>?
              </p>
              <p className="text-gray-600 mt-2">
                Esta ação removerá o cliente da lista de contatos ativos.
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
                onClick={handleDeleteClient}
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
                
                

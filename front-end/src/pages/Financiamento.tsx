"use client";
import { useState, type ReactNode } from "react";
import { FaCalculator, FaChartLine, FaCar, FaHome } from "react-icons/fa";

type ResultadoSimulacao = {
  valorFinanciado: number;
  parcelaFinal: number;
  total: number;
} | null;

export default function FinanciamentoPage() {
  const [valor, setValor] = useState<number | ''>('');
  const [entrada, setEntrada] = useState<number | ''>('');
  const [parcelas, setParcelas] = useState<number | ''>('');
  const [taxa, setTaxa] = useState<number>(1.5); // taxa padrão
  const [resultado, setResultado] = useState<ResultadoSimulacao>(null);

  function calcular() {
    if (!valor || !parcelas) return;

    const valorFinanciado = valor - (entrada || 0);
    const taxaDecimal = taxa / 100;

    // Fórmula de financiamento com juros compostos
    const parcelaFinal =
      (valorFinanciado * taxaDecimal) /
      (1 - Math.pow(1 + taxaDecimal, -Number(parcelas)));

    setResultado({
      valorFinanciado,
      parcelaFinal,
      total: parcelaFinal * Number(parcelas),
    });
  }

  return (
    <div className="space-y-8 mb-10">

      {/* ---------- Cabeçalho ---------- */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaCalculator className="text-blue-600" />
          Financiamento
        </h1>
        <p className="text-gray-500 mt-1">
          Simule com precisão valores, taxas e condições para encontrar o financiamento ideal.
        </p>
      </div>

      {/* ---------- Opções rápidas ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardOption
          icon={<FaCar size={22} />}
          title="Financiamento de Veículos"
          desc="Simule carros, motos e utilitários."
          onClick={() => setValor(50000)}
        />
        <CardOption
          icon={<FaHome size={22} />}
          title="Imóveis"
          desc="Simulação completa para imóveis."
          onClick={() => setValor(300000)}
        />
        <CardOption
          icon={<FaChartLine size={22} />}
          title="Personalizado"
          desc="Monte sua simulação do zero."
          onClick={() => setValor('')}
        />
      </div>

      {/* ---------- Formulário ---------- */}
      <div className="bg-white shadow rounded-lg p-6 space-y-5">

        <h2 className="text-xl font-semibold text-gray-700">
          Preencha sua simulação
        </h2>

        <Input label="Valor do bem" value={valor} setValue={setValor} placeholder="Ex: 60.000" />
        <Input label="Entrada (opcional)" value={entrada} setValue={setEntrada} placeholder="Ex: 5.000" />
        <Input label="Parcelas" value={parcelas} setValue={setParcelas} placeholder="Ex: 48" />

        {/* Taxa */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Taxa de juros (%)</label>
          <input
            type="number"
            value={taxa}
            onChange={(e) => setTaxa(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          onClick={calcular}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Calcular
        </button>
      </div>

      {/* ---------- Resultado ---------- */}
      {resultado && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg space-y-3">
          <h2 className="text-xl font-semibold text-blue-700">Resultado da Simulação</h2>

          <p className="text-gray-700">
            <strong>Valor financiado:</strong> R$ {resultado.valorFinanciado.toFixed(2)}
          </p>

          <p className="text-gray-700">
            <strong>Parcela mensal:</strong> R$ {resultado.parcelaFinal.toFixed(2)}
          </p>

          <p className="text-gray-700">
            <strong>Total final pago:</strong> R$ {resultado.total.toFixed(2)}
          </p>
        </div>
      )}

    </div>
  );
}

/* ------------------ COMPONENTES ------------------ */

type CardOptionProps = {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
};

function CardOption({ icon, title, desc, onClick }: CardOptionProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white border hover:border-blue-400 hover:shadow-md transition p-4 rounded-lg text-left flex gap-3"
    >
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </button>
  );
}

type InputProps = {
  label: string;
  value: number | '';
  setValue: (v: number | '') => void;
  placeholder?: string;
};

function Input({ label, value, setValue, placeholder }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={placeholder}
        className="w-full border p-2 rounded"
      />
    </div>
  );
}

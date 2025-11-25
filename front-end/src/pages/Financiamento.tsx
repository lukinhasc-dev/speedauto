"use client";
import { useState } from "react";
import { FaCalculator, FaChartLine, FaCar, FaHome, FaSpinner } from "react-icons/fa";

// ----- Função de máscara monetária -----
function formatarMoeda(valor: number) {
  if (!valor && valor !== 0) return "";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ResultadoSimulacao {
  valorFinanciado: number;
  parcelaFinal: number;
  total: number;
}

export default function FinanciamentoPage() {
  const [valor, setValor] = useState<number | null>(null);
  const [entrada, setEntrada] = useState<number | null>(null);
  const [parcelas, setParcelas] = useState<number | null>(null);
  const [taxa, setTaxa] = useState<number>(1.5); // taxa padrão
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
  const [loading, setLoading] = useState(false);

  async function calcular() {
    if (!valor || !parcelas || valor <= 0 || parcelas <= 0) return;

    setLoading(true);
    setResultado(null);

    setTimeout(() => {
      const valorFinanciado = valor - (entrada || 0);
      const taxaDecimal = taxa / 100;

      const parcelaFinal =
        (valorFinanciado * taxaDecimal) /
        (1 - Math.pow(1 + taxaDecimal, -Number(parcelas)));

      setResultado({
        valorFinanciado,
        parcelaFinal,
        total: parcelaFinal * Number(parcelas),
      });

      setLoading(false);
    }, 800); // animação só pra UX profissional
  }

  // ----- UI -----
  return (
    <div className="space-y-10 mb-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaCalculator className="text-blue-600" size={28} />
          Financiamento
        </h1>
        <p className="text-gray-500 mt-1 max-w-xl">
          Simule valores, taxas e condições com precisão profissional. Compare cenários e encontre a melhor estratégia de financiamento.
        </p>
      </div>

      {/* CARDS DE CATEGORIAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardOption
          icon={<FaCar size={26} />}
          title="Veículos"
          desc="Simulação completa para carros e motos."
          onClick={() => setValor(45000)}
        />
        <CardOption
          icon={<FaHome size={26} />}
          title="Imóveis"
          desc="Financiamento imobiliário com precisão."
          onClick={() => setValor(280000)}
        />
        <CardOption
          icon={<FaChartLine size={26} />}
          title="Personalizado"
          desc="Monte sua análise financeira do zero."
          onClick={() => setValor(null)}
        />
      </div>

      {/* FORMULÁRIO PROFISSIONAL */}
      <div className="bg-white shadow-lg border border-gray-100 rounded-xl p-6 space-y-6">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Simulação detalhada
          </h2>
          <p className="text-sm text-gray-500">
            Preencha os dados abaixo para uma análise completa.
          </p>
        </div>

        <InputMonetario
          label="Valor do bem"
          value={valor}
          setValue={setValor}
          placeholder="Ex: 60.000"
        />

        <InputMonetario
          label="Entrada (opcional)"
          value={entrada}
          setValue={setEntrada}
          placeholder="Ex: 10.000"
        />

        <InputNumero
          label="Parcelas"
          value={parcelas}
          setValue={setParcelas}
          placeholder="Ex: 48"
        />

        <InputNumero
          label="Taxa de juros mensal (%)"
          value={taxa}
          setValue={setTaxa}
        />

        <button
          onClick={calcular}
          disabled={loading}
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition flex justify-center items-center gap-2"
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Calcular simulação"}
        </button>

      </div>

      {/* RESULTADO */}
      {resultado && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl space-y-4 shadow-sm">
          <h2 className="text-xl font-semibold text-blue-700">Resultado da Simulação</h2>

          <ResultadoItem label="Valor financiado" valor={resultado.valorFinanciado} />
          <ResultadoItem label="Parcela mensal" valor={resultado.parcelaFinal} />
          <ResultadoItem label="Total final pago" valor={resultado.total} />

          <p className="text-sm text-blue-700/80 mt-2 border-t border-blue-200 pt-3">
            *Valores simulados apenas para referência. Condições reais podem variar conforme instituição financeira.
          </p>
        </div>
      )}

      {/* BOX DE DETALHAMENTO FINANCEIRO */}
      {resultado && (
        <div className="bg-white shadow border border-gray-200 p-6 rounded-xl space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Detalhamento Técnico</h3>

          <p className="text-sm text-gray-600">
            • Modelo: Juros compostos (tabela Price)  
            • Fórmula aplicada: PMT = PV × i / (1 - (1+i)<sup>-n</sup>)  
            • Taxa mensal utilizada: {taxa}%
          </p>

          <p className="text-sm text-gray-500">
            *Ideal para uso profissional em análises financeiras, dashboards e módulos de crédito.
          </p>
        </div>
      )}

    </div>
  );
}

/* ------------------ COMPONENTES PROFISSIONAIS ------------------ */

interface CardOptionProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}

function CardOption({ icon, title, desc, onClick }: CardOptionProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white shadow-sm border hover:border-blue-400 hover:shadow-md transition p-5 rounded-xl text-left flex gap-4 items-start"
    >
      <div className="text-blue-600">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </button>
  );
}

interface InputMonetarioProps {
  label: string;
  value: number | null;
  setValue: (value: number) => void;
  placeholder: string;
}

function InputMonetario({ label, value, setValue, placeholder }: InputMonetarioProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={placeholder}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>
  );
}

interface InputNumeroProps {
  label: string;
  value: number | null;
  setValue: (value: number) => void;
  placeholder?: string;
}

function InputNumero({ label, value, setValue, placeholder }: InputNumeroProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={placeholder}
        className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
      />
    </div>
  );
}

interface ResultadoItemProps {
  label: string;
  valor: number;
}

function ResultadoItem({ label, valor }: ResultadoItemProps) {
  return (
    <p className="text-gray-700">
      <strong>{label}:</strong> {formatarMoeda(valor)}
    </p>
  );
}

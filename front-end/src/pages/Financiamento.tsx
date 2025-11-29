"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  FaCalculator,
  FaCarSide,
  FaTruck,
  FaMotorcycle,
  FaSpinner,
} from "react-icons/fa";

import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

function formatarMoeda(valor: number) {
  if (!valor && valor !== 0) return "";
  return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

interface ParcelaDetalhe {
  mes: number;
  parcela: number;
  juros: number;
  amortizacao: number;
  saldoDevedor: number;
}

interface ResultadoSimulacaoSistema {
  valorFinanciado: number;
  parcelaMedia: number;
  primeiraParcela: number;
  ultimaParcela: number;
  totalPago: number;
  totalJuros: number;
  parcelas: ParcelaDetalhe[];
}

interface ResultadoSimulacao {
  price: ResultadoSimulacaoSistema;
  sac: ResultadoSimulacaoSistema;
}

export default function FinanciamentoPage() {
  const [valor, setValor] = useState<number | null>(null);
  const [entrada, setEntrada] = useState<number | null>(null);
  const [parcelas, setParcelas] = useState<number | null>(null);
  const [taxa, setTaxa] = useState<number>(1.5);
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null);
  const [loading, setLoading] = useState(false);

  async function calcular() {
    if (!valor || !parcelas || valor <= 0 || parcelas <= 0) return;

    const n = Number(parcelas);
    const valorFinanciado = valor - (entrada || 0);
    if (valorFinanciado <= 0) return;

    setLoading(true);
    setResultado(null);

    setTimeout(() => {
      const i = taxa / 100;

      const parcelaPrice =
        (valorFinanciado * i) / (1 - Math.pow(1 + i, -n));

      let saldoPrice = valorFinanciado;
      const parcelasPrice: ParcelaDetalhe[] = [];
      let totalPagoPrice = 0;
      let totalJurosPrice = 0;

      for (let mes = 1; mes <= n; mes++) {
        const juros = saldoPrice * i;
        const amortizacao = parcelaPrice - juros;
        saldoPrice = saldoPrice - amortizacao;

        const parcela = parcelaPrice;

        totalPagoPrice += parcela;
        totalJurosPrice += juros;

        parcelasPrice.push({
          mes,
          parcela,
          juros,
          amortizacao,
          saldoDevedor: Math.max(saldoPrice, 0),
        });
      }

      const price: ResultadoSimulacaoSistema = {
        valorFinanciado,
        parcelaMedia: parcelaPrice,
        primeiraParcela: parcelasPrice[0]?.parcela ?? 0,
        ultimaParcela: parcelasPrice[parcelasPrice.length - 1]?.parcela ?? 0,
        totalPago: totalPagoPrice,
        totalJuros: totalJurosPrice,
        parcelas: parcelasPrice,
      };

      const parcelasSac: ParcelaDetalhe[] = [];
      const amortConstante = valorFinanciado / n;
      let saldoSac = valorFinanciado;
      let totalPagoSac = 0;
      let totalJurosSac = 0;

      for (let mes = 1; mes <= n; mes++) {
        const juros = saldoSac * i;
        const parcela = amortConstante + juros;
        saldoSac = saldoSac - amortConstante;

        totalPagoSac += parcela;
        totalJurosSac += juros;

        parcelasSac.push({
          mes,
          parcela,
          juros,
          amortizacao: amortConstante,
          saldoDevedor: Math.max(saldoSac, 0),
        });
      }

      const sac: ResultadoSimulacaoSistema = {
        valorFinanciado,
        parcelaMedia: totalPagoSac / n,
        primeiraParcela: parcelasSac[0]?.parcela ?? 0,
        ultimaParcela: parcelasSac[parcelasSac.length - 1]?.parcela ?? 0,
        totalPago: totalPagoSac,
        totalJuros: totalJurosSac,
        parcelas: parcelasSac,
      };

      setResultado({ price, sac });
      setLoading(false);
    }, 800);
  }

  const dadosParcelas = useMemo(() => {
    if (!resultado) return [];
    const { price, sac } = resultado;

    return price.parcelas.map((p, idx) => ({
      mes: p.mes,
      labelMes: `Mês ${p.mes}`,
      price: Number(p.parcela.toFixed(2)),
      sac: Number(sac.parcelas[idx]?.parcela.toFixed(2) ?? 0),
    }));
  }, [resultado]);

  const dadosSaldo = useMemo(() => {
    if (!resultado) return [];
    const { price, sac } = resultado;

    return price.parcelas.map((p, idx) => ({
      mes: p.mes,
      labelMes: `Mês ${p.mes}`,
      price: Number(p.saldoDevedor.toFixed(2)),
      sac: Number(sac.parcelas[idx]?.saldoDevedor.toFixed(2) ?? 0),
    }));
  }, [resultado]);

  return (
    <div className="space-y-12 mb-10">

      <div>
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-3 tracking-tight">
          <FaCalculator className="text-blue-600" size={32} />
          Simulador de Financiamento Veicular
        </h1>
        <p className="text-gray-500 mt-1 max-w-2xl">
          Calcule parcelas, entrada ideal e compare os sistemas Price e SAC
          para financiamento de carros, motos e utilitários.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CardOption
          icon={<FaCarSide size={28} />}
          title="Carros"
          desc="Simulação ideal para automóveis."
          onClick={() => setValor(55000)}
        />
        <CardOption
          icon={<FaMotorcycle size={28} />}
          title="Motos"
          desc="Simule com precisão para motocicletas."
          onClick={() => setValor(18000)}
        />
        <CardOption
          icon={<FaTruck size={28} />}
          title="Utilitários"
          desc="Para caminhonetes e veículos de trabalho."
          onClick={() => setValor(95000)}
        />
      </div>

      <div className="bg-white shadow-xl border border-gray-200 rounded-xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Simulação detalhada</h2>
          <p className="text-sm text-gray-500">
            Informe os dados abaixo para gerar todos os cálculos.
          </p>
        </div>

        <InputMonetario
          label="Valor do veículo"
          value={valor}
          setValue={setValor}
          placeholder="Ex: 55.000,00"
        />
        <InputMonetario
          label="Entrada"
          value={entrada}
          setValue={setEntrada}
          placeholder="Ex: 10.000,00"
        />
        <InputNumero
          label="Quantidade de parcelas"
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
          className="
            w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl 
            font-medium shadow-sm hover:shadow-md 
            transition-all duration-300 flex justify-center items-center gap-2
          "
        >
          {loading ? <FaSpinner className="animate-spin" /> : "Calcular simulação"}
        </button>
      </div>

      {resultado && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-xl shadow-md space-y-3">
              <h2 className="text-xl font-bold text-blue-700">Sistema Price</h2>
              <ResumoSistema sistema={resultado.price} />
            </div>

            <div className="bg-blue-50/70 border border-blue-200 p-6 rounded-xl shadow-md space-y-3">
              <h2 className="text-xl font-bold text-blue-700">Sistema SAC</h2>
              <ResumoSistema sistema={resultado.sac} />
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-md space-y-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Comparativo Price x SAC
              </h2>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  • <strong>Juros totais Price:</strong>{" "}
                  {formatarMoeda(resultado.price.totalJuros)}
                </li>
                <li>
                  • <strong>Juros totais SAC:</strong>{" "}
                  {formatarMoeda(resultado.sac.totalJuros)}
                </li>
                <li>
                  • <strong>Total pago Price:</strong>{" "}
                  {formatarMoeda(resultado.price.totalPago)}
                </li>
                <li>
                  • <strong>Total pago SAC:</strong>{" "}
                  {formatarMoeda(resultado.sac.totalPago)}
                </li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">
                *No SAC, as parcelas tendem a começar mais altas e ir caindo,
                com saldo devedor reduzindo mais rapidamente.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Gráfico das parcelas - Price x SAC
            </h3>
            <p className="text-sm text-gray-500">
              Visualização do valor das parcelas mês a mês em cada sistema.
            </p>

            <div className="w-full h-72">
              <ResponsiveContainer>
                <LineChart data={dadosParcelas}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#4b5563" />
                  <YAxis stroke="#4b5563" />
                  <Tooltip
                    formatter={(value: any) =>
                      formatarMoeda(Number(value))
                    }
                    labelFormatter={(label) => `Mês ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="Price"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sac"
                    name="SAC"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Saldo devedor - Price x SAC
            </h3>
            <p className="text-sm text-gray-500">
              Evolução do saldo devedor ao longo do contrato em cada sistema.
            </p>

            <div className="w-full h-72">
              <ResponsiveContainer>
                <LineChart data={dadosSaldo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" stroke="#4b5563" />
                  <YAxis stroke="#4b5563" />
                  <Tooltip
                    formatter={(value: any) =>
                      formatarMoeda(Number(value))
                    }
                    labelFormatter={(label) => `Mês ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="price"
                    name="Saldo Price"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sac"
                    name="Saldo SAC"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    dot={{ r: 2 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Tabelas detalhadas (mês a mês)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h4 className="text-md font-semibold text-blue-700 mb-3">
                  Sistema Price
                </h4>
                <div className="overflow-x-auto text-sm">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="border px-2 py-1 text-left">Mês</th>
                        <th className="border px-2 py-1 text-left">Amortização</th>
                        <th className="border px-2 py-1 text-left">Juros</th>
                        <th className="border px-2 py-1 text-left">Parcela</th>
                        <th className="border px-2 py-1 text-left">Saldo Devedor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.price.parcelas.map((p) => (
                        <tr key={`price-${p.mes}`} className="hover:bg-gray-50">
                          <td className="border px-2 py-1">{p.mes}</td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.amortizacao)}
                          </td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.juros)}
                          </td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.parcela)}
                          </td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.saldoDevedor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h4 className="text-md font-semibold text-blue-700 mb-3">
                  Sistema SAC
                </h4>
                <div className="overflow-x-auto text-sm">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700">
                        <th className="border px-2 py-1 text-left">Mês</th>
                        <th className="border px-2 py-1 text-left">Amortização</th>
                        <th className="border px-2 py-1 text-left">Juros</th>
                        <th className="border px-2 py-1 text-left">Parcela</th>
                        <th className="border px-2 py-1 text-left">Saldo Devedor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.sac.parcelas.map((p) => (
                        <tr key={`sac-${p.mes}`} className="hover:bg-gray-50">
                          <td className="border px-2 py-1">{p.mes}</td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.amortizacao)}
                          </td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.juros)}
                          </td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.parcela)}
                          </td>
                          <td className="border px-2 py-1">
                            {formatarMoeda(p.saldoDevedor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              *Valores arredondados para exibição. Pequenas variações podem ocorrer em relação aos cálculos internos.
            </p>
          </div>
        </>
      )}
    </div>
  );
}


interface CardOptionProps {
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}

function CardOption({ icon, title, desc, onClick }: CardOptionProps) {
  return (
    <button
      onClick={onClick}
      className="
        bg-white shadow-sm border border-gray-200 rounded-xl p-5 
        hover:shadow-lg hover:border-blue-500 transition-all duration-300 
        flex gap-4 items-start group
      "
    >
      <div className="text-blue-600 group-hover:text-blue-700 transition">
        {icon}
      </div>
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

function InputMonetario({
  label,
  value,
  setValue,
  placeholder,
}: InputMonetarioProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Atualiza o displayValue quando o value muda (ex: ao clicar nos botões de exemplo)
  useState(() => {
    if (value !== null && value !== undefined) {
      const formatted = value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    // Remove tudo que não é número
    input = input.replace(/\D/g, '');

    if (input === '') {
      setDisplayValue('');
      setValue(0);
      return;
    }

    // Converte para número (divide por 100 para ter as casas decimais)
    const numValue = parseInt(input || '0') / 100;

    // Formata para exibição
    const formatted = numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    setDisplayValue(formatted);
    setValue(numValue);
  };

  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full border border-gray-300 p-3 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition placeholder:text-gray-400
        "
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

function InputNumero({
  label,
  value,
  setValue,
  placeholder,
}: InputNumeroProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-gray-700">{label}</label>
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => setValue(Number(e.target.value))}
        placeholder={placeholder}
        className="
          w-full border border-gray-300 p-3 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          transition placeholder:text-gray-400
        "
      />
    </div>
  );
}

interface ResumoSistemaProps {
  sistema: ResultadoSimulacaoSistema;
}

function ResumoSistema({ sistema }: ResumoSistemaProps) {
  return (
    <ul className="text-sm text-gray-700 space-y-1">
      <li>
        • <strong>Valor financiado:</strong>{" "}
        {formatarMoeda(sistema.valorFinanciado)}
      </li>
      <li>
        • <strong>Parcela média:</strong>{" "}
        {formatarMoeda(sistema.parcelaMedia)}
      </li>
      <li>
        • <strong>Primeira parcela:</strong>{" "}
        {formatarMoeda(sistema.primeiraParcela)}
      </li>
      <li>
        • <strong>Última parcela:</strong>{" "}
        {formatarMoeda(sistema.ultimaParcela)}
      </li>
      <li>
        • <strong>Total pago:</strong> {formatarMoeda(sistema.totalPago)}
      </li>
      <li>
        • <strong>Juros totais:</strong> {formatarMoeda(sistema.totalJuros)}
      </li>
    </ul>
  );
}

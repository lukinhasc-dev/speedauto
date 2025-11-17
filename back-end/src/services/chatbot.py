# -*- coding: utf-8 -*-
import re
import requests
import json

# URL do servidor backend
BASE_URL = "http://localhost:5000"

def get_veiculos():
    try:
        response = requests.get(f"{BASE_URL}/veiculos")
        if response.status_code == 200:
            return response.json()
        else:
            return []
    except:
        return []

def get_vendas():
    try:
        response = requests.get(f"{BASE_URL}/vendas")
        if response.status_code == 200:
            return response.json()
        else:
            return []
    except:
        return []

def get_clientes():
    try:
        response = requests.get(f"{BASE_URL}/clientes")
        if response.status_code == 200:
            return response.json()
        else:
            return []
    except:
        return []

# Carregar dados do banco
veiculos = get_veiculos()
vendas = get_vendas()
clientes = get_clientes()

# Mapear veículos por modelo para busca rápida
estoque = {v["modelo"].strip().upper(): v for v in veiculos}

def simular_financiamento(preco, entrada_pct, parcelas):
    entrada = preco * (entrada_pct / 100)
    restante = preco - entrada
    juros = 0.015  # 1.5% ao mês
    parcela = (restante * (juros * (1 + juros) ** parcelas)) / ((1 + juros) ** parcelas - 1)
    return entrada, parcela

def processar_comando(pergunta):
    pergunta = pergunta.lower().strip()

    # === Listar carros disponíveis ===
    if "listar carros disponiveis" in pergunta or "listar carros" in pergunta:
        disponiveis = [f"{c['modelo']} ({c['ano']}) - R$ {c['valor_venda']:,}" for c in veiculos if c["status"] == "Disponível"]
        return "Carros disponíveis:\n" + "\n".join(disponiveis) if disponiveis else "Nenhum carro disponível."

    # === Carros acima de 100000 ===
    if "carros acima de 100000" in pergunta:
        valor = 100000
        filtrados = [c for c in veiculos if c["valor_venda"] > valor]
        if filtrados:
            return "Carros acima de R$ {:,}:\n{}".format(valor, "\n".join(f"- {c['modelo']} {c['ano']} R$ {c['valor_venda']:,}" for c in filtrados))
        return f"Nenhum carro acima de R$ {valor:,}."

    # === Carros abaixo de 100000 ===
    if "carros abaixo de 100000" in pergunta:
        valor = 100000
        filtrados = [c for c in veiculos if c["valor_venda"] < valor]
        if filtrados:
            return "Carros abaixo de R$ {:,}:\n{}".format(valor, "\n".join(f"- {c['modelo']} {c['ano']} R$ {c['valor_venda']:,}" for c in filtrados))
        return f"Nenhum carro abaixo de R$ {valor:,}."

    # === Estatísticas gerais ===
    if "estatisticas gerais" in pergunta or "estatistica" in pergunta:
        total = len(veiculos)
        disponiveis = sum(1 for c in veiculos if c["status"] == "Disponível")
        valor_total = sum(c["valor_venda"] for c in veiculos)
        return f"Temos {total} carros cadastrados ({disponiveis} disponíveis). Valor total do estoque: R$ {valor_total:,}."

    return "Comando não reconhecido. Use os botões disponíveis."

def main():
    print("=== Chatbot SpeedAuto ===")
    senha = input("Digite a senha do gerente: ")
    

    print("\nAcesso liberado! Pergunte algo sobre o estoque (ou digite 'ajuda').\n")
    while True:
        pergunta = input("Você: ")
        if pergunta.lower() in ['sair', 'exit', 'quit']:
            print("Bot: Até logo!")
            break
        resposta = processar_comando(pergunta)
        print(f"Bot: {resposta}\n")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        pergunta = sys.argv[1]
        resposta = processar_comando(pergunta)
        print(resposta)
    else:
        main()

    
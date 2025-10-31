# -*- coding: utf-8 -*-
import re 


# Novo estoque com categorias
ESTOQUE_INICIAL = [
    {"modelo": "Honda Civic", "ano": 2023, "preco": 120000, "categoria": "Sedan", "disponivel": True},
    {"modelo": "Toyota Corolla", "ano": 2022, "preco": 110000, "categoria": "Sedan", "disponivel": True},
    {"modelo": "Ford F-150", "ano": 2023, "preco": 250000, "categoria": "Pickup", "disponivel": False},
    {"modelo": "Volkswagen Gol", "ano": 2021, "preco": 80000, "categoria": "Hatch", "disponivel": True},
    {"modelo": "Chevrolet Onix", "ano": 2024, "preco": 95000, "categoria": "Hatch", "disponivel": True},
    {"modelo": "Hyundai HB20", "ano": 2023, "preco": 92000, "categoria": "Hatch", "disponivel": True},
    {"modelo": "Jeep Compass", "ano": 2023, "preco": 175000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Nissan Kicks", "ano": 2023, "preco": 130000, "categoria": "SUV", "disponivel": False},
    {"modelo": "Fiat Toro", "ano": 2023, "preco": 160000, "categoria": "Pickup", "disponivel": True},
    {"modelo": "Renault Kwid", "ano": 2022, "preco": 72000, "categoria": "Hatch", "disponivel": True},
    {"modelo": "BMW X1", "ano": 2023, "preco": 280000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Tesla Model 3", "ano": 2024, "preco": 350000, "categoria": "Elétrico", "disponivel": True},
    {"modelo": "Peugeot 208", "ano": 2023, "preco": 99000, "categoria": "Hatch", "disponivel": True},
    {"modelo": "Honda HR-V", "ano": 2024, "preco": 160000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Toyota Rav4", "ano": 2002, "preco": 20000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Audi A3", "ano": 2023, "preco": 230000, "categoria": "Sedan", "disponivel": True},
    {"modelo": "Mercedes-Benz GLA", "ano": 2023, "preco": 300000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Chevrolet Bolt EV", "ano": 2024, "preco": 180000, "categoria": "Elétrico", "disponivel": True},
    {"modelo": "Volkswagen ID.4", "ano": 2024, "preco": 220000, "categoria": "Elétrico", "disponivel": True},
    {"modelo": "Ford Mustang Mach-E", "ano": 2024, "preco": 320000, "categoria": "Elétrico", "disponivel": True},
    {"modelo": "Kia Seltos", "ano": 2023, "preco": 150000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Mazda CX-5", "ano": 2023, "preco": 180000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Subaru Forester", "ano": 2023, "preco": 190000, "categoria": "SUV", "disponivel": True},
    {"modelo": "Volvo XC40", "ano": 2023, "preco": 270000, "categoria": "SUV", "disponivel": False},
    {"modelo": "Jaguar I-PACE", "ano": 2024, "preco": 400000, "categoria": "Elétrico", "disponivel": True},
    {"modelo": "Mini Cooper SE", "ano": 2023, "preco": 210000, "categoria": "Elétrico", "disponivel": True},
    {"modelo": "Citroën C4", "ano": 2023, "preco": 140000, "categoria": "Hatch", "disponivel": False},
    
]

estoque = {c["modelo"]: c for c in ESTOQUE_INICIAL}

def simular_financiamento(preco, entrada_pct, parcelas):
    entrada = preco * (entrada_pct / 100)
    restante = preco - entrada
    juros = 0.015  # 1.5% ao mês
    parcela = (restante * (juros * (1 + juros) ** parcelas)) / ((1 + juros) ** parcelas - 1)
    return entrada, parcela

def processar_comando(pergunta):
    pergunta = pergunta.lower().strip()

    # === Consultar modelo ===
    if re.search(r'(tem|possui|disponivel|estoque|preco|valor).*', pergunta):
        for nome, carro in estoque.items():
            if any(palavra in pergunta for palavra in nome.lower().split()):
                status = "disponível" if carro["disponivel"] else "indisponível"
                return f"{nome} {carro['ano']} ({carro['categoria']}) - R$ {carro['preco']:,} ({status})."
        return "Não encontrei esse modelo no estoque."

    # === Listar carros por categoria ===
    if re.search(r'suv|sedan|hatch|pickup|elétrico|eletrico', pergunta):
        cat = "elétrico" if "eletr" in pergunta else re.search(r'(suv|sedan|hatch|pickup)', pergunta).group(1).title()
        filtrados = [c for c in estoque.values() if cat.lower() in c["categoria"].lower()]
        if filtrados:
            lista = "\n".join([f"- {c['modelo']} {c['ano']} R$ {c['preco']:,}" for c in filtrados])
            return f"Carros da categoria {cat}:\n{lista}"
        return f"Não temos carros da categoria {cat}."

    # === Filtrar por preço ===
    if "acima" in pergunta or "maior" in pergunta:
        valor = int(re.search(r'(\d+)', pergunta).group(1))
        filtrados = [c for c in estoque.values() if c["preco"] > valor]
        if filtrados:
            return "Carros acima de R$ {:,}:\n{}".format(valor, "\n".join(f"- {c['modelo']} {c['ano']} R$ {c['preco']:,}" for c in filtrados))
        return f"Nenhum carro acima de R$ {valor:,}."

    if "abaixo" in pergunta or "menor" in pergunta:
        valor = int(re.search(r'(\d+)', pergunta).group(1))
        filtrados = [c for c in estoque.values() if c["preco"] < valor]
        if filtrados:
            return "Carros abaixo de R$ {:,}:\n{}".format(valor, "\n".join(f"- {c['modelo']} {c['ano']} R$ {c['preco']:,}" for c in filtrados))
        return f"Nenhum carro abaixo de R$ {valor:,}."

    # === Listar todos ===
    if any(p in pergunta for p in ["listar", "estoque", "disponiveis", "mostrar"]):
        disponiveis = [f"{c['modelo']} ({c['ano']}) - R$ {c['preco']:,}" for c in estoque.values() if c["disponivel"]]
        return "Carros disponíveis:\n" + "\n".join(disponiveis) if disponiveis else "Nenhum carro disponível."

    # === Simulação de financiamento ===
    if "financiamento" in pergunta or "parcelas" in pergunta:
        modelo_match = re.search(r'(\w+\s?\w*)', pergunta.split("do")[-1].strip())
        parcelas_match = re.search(r'(\d+)\s*x', pergunta)
        entrada_match = re.search(r'(\d+)%', pergunta)

        if modelo_match:
            modelo = modelo_match.group(1).title()
            if modelo in estoque:
                preco = estoque[modelo]["preco"]
                parcelas = int(parcelas_match.group(1)) if parcelas_match else 36
                entrada_pct = int(entrada_match.group(1)) if entrada_match else 20
                entrada, parcela = simular_financiamento(preco, entrada_pct, parcelas)
                return (f"Simulação para {modelo}:\n"
                        f"- Preço: R$ {preco:,}\n"
                        f"- Entrada: R$ {entrada:,.2f} ({entrada_pct}%)\n"
                        f"- Parcelas: {parcelas}x de R$ {parcela:,.2f}")
            else:
                return "Modelo não encontrado para simulação."
        return "Exemplo: 'Financiamento do Civic em 48x com 20% de entrada'."

    # === Estatísticas ===
    if "estatistica" in pergunta or "total" in pergunta:
        total = len(estoque)
        disponiveis = sum(1 for c in estoque.values() if c["disponivel"])
        valor_total = sum(c["preco"] for c in estoque.values())
        return f"Temos {total} carros cadastrados ({disponiveis} disponíveis). Valor total do estoque: R$ {valor_total:,}."

    # === Ajuda ===
    if "ajuda" in pergunta or "comandos" in pergunta:
        return """Comandos disponíveis:
- 'Tem [modelo]' → verificar carro
- 'Listar carros disponíveis'
- 'Carros SUV / Sedan / Hatch / Pickup'
- 'Carros acima de R$100000' ou 'abaixo de R$100000'
- 'Financiamento do Civic em 48x com 20% de entrada'
- 'Estatísticas gerais'
- 'Sair' → encerra o sistema
"""

    return "Desculpe, não entendi. Digite 'ajuda' para ver os comandos."

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
    main()

    
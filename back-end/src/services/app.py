# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import processar_comando  # importa a função já pronta

app = Flask(__name__)
CORS(app)  # permite requisições do front-end

@app.route("/chatbot", methods=["POST"])
def chatbot_response():
    data = request.get_json()
    pergunta = data.get("mensagem", "")
    resposta = processar_comando(pergunta)
    return jsonify({"resposta": resposta})

@app.route("/")
def home():
    return "API do Chatbot SpeedAuto está rodando!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

async function enviarMensagem() {
  const mensagem = document.getElementById("mensagem").value;

  const resposta = await fetch("http://127.0.0.1:5000/chatbot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mensagem }),
  });

  const data = await resposta.json();
  document.getElementById("resposta").innerText = data.resposta;
}

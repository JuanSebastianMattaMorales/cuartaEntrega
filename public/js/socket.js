socket = io();

socket.emit("contador")
contador = document.querySelector("#contador");
socket.on("contador", (cont) => {
    contador.innerHTML = `<h4 style="text-align: center">Eres el visitante numero : ${cont}</h4>`;
})
import "./index.scss";
const socket = new WebSocket("ws://localhost:4000");

console.log(socket);
socket.addEventListener("open", () => {
  socket.send("Hello Server!");
});

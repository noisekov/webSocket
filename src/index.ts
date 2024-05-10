import "./index.scss";
// const socket = new WebSocket("ws://localhost:4000");

class App {
  body: HTMLBodyElement | null;

  constructor() {
    this.body = document.querySelector("body");
  }

  init() {
    console.log(this.body);
  }
}

new App().init();

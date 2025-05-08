import ButtonComponent from './components/button';
import './index.scss';
const socket = new WebSocket('ws://localhost:4000');
console.log(socket);

class App {
    body: HTMLBodyElement | null;

    constructor() {
        this.body = document.querySelector('body');
    }

    init() {
        this.body?.appendChild(
            new ButtonComponent({
                className: 'btn',
                text: 'ClickBtn',
            }).getNode()
        );
    }
}

new App().init();

import './index.scss';
import ContentRender from './utils/contentRender';
const socket = new WebSocket('ws://localhost:4000');
console.log(socket);

new ContentRender().render();

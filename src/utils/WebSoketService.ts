import { ModalCloseConnection } from '../components/ModalCloseConnection/ModalCloseConnection';

interface WebSocketDataI {
    login: string;
    password: string;
    isLogined: boolean;
}

export default class WebSocketService {
    private connection: WebSocket;
    private messageHandlers: ((event: MessageEvent) => void)[] = [];
    private data: WebSocketDataI;
    private static instance: WebSocketService | null = null;
    private isConnected: boolean;
    constructor() {
        this.connection = new WebSocket('ws://localhost:4000');
        this.setupEventListeners();
        this.data = {
            login: '',
            password: '',
            isLogined: false,
        };
        this.isConnected = false;
        document.querySelector('.modal-close-connection')?.remove();
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    private setupEventListeners() {
        this.connection.addEventListener('error', this.handleError.bind(this));
        this.connection.addEventListener('close', this.handleClose.bind(this));
        this.connection.addEventListener('message', (event) => {
            this.messageHandlers.forEach((handler) => handler(event));
        });
    }

    public initializeConnection() {
        if (this.isConnected) return;

        this.data = JSON.parse(
            sessionStorage.getItem('noisekov-funchat') ||
                `{
              "login": "",
              "password": "",
              "isLogined": false
            }`
        );

        if (this.connection.readyState === WebSocket.OPEN) {
            this.sendInitialMessages();
            this.isConnected = true;
        } else {
            this.connection.addEventListener(
                'open',
                () => {
                    this.sendInitialMessages();
                },
                { once: true }
            );
        }
    }

    private sendInitialMessages() {
        this.send({
            id: null,
            type: 'USER_LOGIN',
            payload: { user: this.data },
        });

        this.send({
            id: null,
            type: 'USER_ACTIVE',
            payload: null,
        });
    }

    private handleError(event: Event) {
        console.error('WebSocket error:', event);
    }

    private handleClose(event: CloseEvent) {
        this.isConnected = false;
        new ModalCloseConnection().render();
        console.log('WebSocket closed:', event.reason);
    }

    public send(data: object) {
        if (this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify(data));
        } else {
            console.warn('Message not sent - connection not ready');
        }
    }

    public onMessage(handler: (event: MessageEvent) => void) {
        this.messageHandlers.push(handler);
    }

    public close() {
        this.connection.close();
    }
}

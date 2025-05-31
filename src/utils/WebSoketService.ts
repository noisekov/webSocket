interface WebSocketDataI {
    login: string;
    password: string;
}

export default class WebSoketService {
    connection;
    constructor({ login, password }: WebSocketDataI) {
        this.connection = new WebSocket('ws://localhost:4000');
        this.connection.addEventListener('open', () => {
            const data = JSON.stringify({
                id: `${Math.random()}`,
                type: 'USER_LOGIN',
                payload: {
                    user: {
                        login,
                        password,
                    },
                },
            });

            this.connection.send(data);

            const getAllUsers = JSON.stringify({
                id: '',
                type: 'USER_ACTIVE',
                payload: null,
            });
            this.connection.send(getAllUsers);
            this.connection.onmessage = function (event) {
                console.log(event);
            };
        });
    }
}

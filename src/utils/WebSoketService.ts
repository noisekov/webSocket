export default class WebSoketService {
    connection;
    constructor() {
        this.connection = new WebSocket('ws://localhost:4000');
        console.log(this.connection);
    }

    send(id: number, login: string, password: string) {
        // test data
        const data = JSON.stringify({
            id,
            type: 'USER_LOGIN',
            payload: {
                user: {
                    login,
                    password,
                },
            },
        });

        this.connection.send(data);
    }
}

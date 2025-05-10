export default class WebSoketService {
    connection;
    constructor() {
        this.connection = new WebSocket('ws://localhost:4000');
        this.connection.addEventListener('open', () => {
            const data = JSON.stringify({
                id: '1',
                type: 'USER_LOGIN',
                payload: {
                    user: {
                        login: 'login',
                        password: 'password',
                    },
                },
            });

            this.connection.send(data);
        });
    }

    // send(id: number, login: string, password: string) {
    //     // test data
    //     const data = JSON.stringify({
    //         id,
    //         type: 'USER_LOGIN',
    //         payload: {
    //             user: {
    //                 login,
    //                 password,
    //             },
    //         },
    //     });

    //     this.connection.send(data);
    // }
}

import Component from '../components/Component';

export interface AppStateI {
    content: Component;
    users_login: object;
    users_active: {
        payload: {
            users: [];
        };
    };
    users_before_filter: [];
}

type Subscriber = () => void;

export default class AppState {
    private static instance: AppState;
    private state;
    private subscribers: Subscriber[] = [];

    private constructor() {
        this.state = {
            users_active: {
                payload: { users: [] },
            },
            users_before_filter: [],
        };
    }

    public static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }

        return AppState.instance;
    }

    public getState() {
        return this.state;
    }

    public setState(newState: any) {
        this.state = { ...this.state, ...newState };
        this.notifySubscribers();

        return this.state;
    }

    public subscribe(callback: Subscriber): void {
        this.subscribers.push(callback);
    }

    private notifySubscribers(): void {
        this.subscribers.forEach((callback) => callback());
    }
}

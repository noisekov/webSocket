import Component from '../components/Component';

export interface AppStateI {
    content: Component;
    users_login: object;
    users_active: object;
}

export default class AppState {
    private static instance: AppState;
    private state;

    private constructor() {
        this.state = {};
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

        return this.state;
    }
}

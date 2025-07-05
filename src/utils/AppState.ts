import Component from '../components/Component';

type Subscriber = () => void;

export default class AppState {
    private static instance: AppState;
    private state;
    private subscribers: Subscriber[] = [];

    private constructor() {
        this.state = {
            content: new Component({}),
            users_active: {
                payload: { users: [] as any[] },
            },
            users_inactive: {
                payload: { users: [] as any[] },
            },
            users_active_before_filter: [],
            users_inactive_before_filter: [],
            chosen_user: new Component({}),
            chosen_user_status: new Component({}),
            chat_content: new Component({}),
            textarea: new Component({}),
            mainTemplate: new Component({}),
            context_menu: new Component({}),
            submit: new Component({}),
            editable_message: {
                id: '',
                component: document.createElement('span'),
            },
            input_wrapper: new Component({}),
            editable_cancel: new Component({}),
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

    public addNewUser(user: { login: string; isLogined: boolean }) {
        this.state.users_active.payload.users.push(user);
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

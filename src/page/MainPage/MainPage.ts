import { BurgerMenu } from '../../components/BurgerMenu/BurgerMenu';
import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import AppRouter from '../../utils/AppRouter';
import AppState, { AppStateI } from '../../utils/AppState';
import ContentRender from '../../utils/ContentRender';
import WebSocketService from '../../utils/WebSoketService';

export default class MainPage {
    users: Component;
    private webSocketService: WebSocketService;
    private appState: AppState;
    private currentUserData;

    constructor() {
        this.appState = AppState.getInstance();
        this.users = new Component({
            tag: 'ul',
            className: 'users',
        });
        this.webSocketService = new WebSocketService();
        this.currentUserData = JSON.parse(
            sessionStorage.getItem('noisekov-funchat') ||
                '{"login": "", "password": "", "isLogined": false}'
        );
        this.setupStateSubscription();
        this.setupWebSocketListeners();
    }

    private setupWebSocketListeners(): void {
        this.webSocketService.onMessage(async (event) => {
            const typeData = JSON.parse(event.data);

            if (typeData.type === 'USER_ACTIVE') {
                this.appState.setState({
                    users_active: typeData,
                });
            }
        });
    }

    private setupStateSubscription() {
        this.appState.subscribe(() => this.updateUserList());
    }

    updateUserList() {
        const arrLoginedUsers = (this.appState.getState() as AppStateI)
            .users_active.payload.users;
        this.users.destroyChildren();
        const userComponents = arrLoginedUsers.flatMap(
            (user: { login: string; isLogined: boolean }) => {
                if (user.login === this.currentUserData.login) {
                    return [];
                }

                return new Component({
                    tag: `li`,
                    className: `user ${user.isLogined ? 'active' : 'inactive'}`,
                    text: user.login,
                });
            }
        );

        this.users.appendChildren(userComponents);
    }

    renderHeader() {
        const header = new Component({
            tag: 'div',
            className: 'main-header',
        });
        header.appendChildren([
            new Component({
                className: 'main-user',
                text: `User: ${this.currentUserData.login}`,
            }),
            new Component({
                className: 'main-title title',
                text: 'CHAT',
            }),
            new ButtonComponent({
                className: 'button',
                text: 'Exit',
                onClick: () => {
                    const { login, password } = this.currentUserData;
                    this.webSocketService.send({
                        id: '1',
                        type: 'USER_LOGOUT',
                        payload: {
                            user: {
                                login,
                                password,
                            },
                        },
                    });
                    new AppRouter().setPath('login');
                    new ContentRender().render();
                    sessionStorage.clear();
                },
            }),
        ]);

        return header;
    }

    render() {
        const content = new Component({
            className: 'main-wrapper',
        });
        const chatWrapper = new Component({
            className: 'main-chat',
        });
        const leftSideChat = new Component({
            className: 'left-side',
            tag: 'div',
        });
        const rightSideChat = new Component({
            className: 'right-side',
            tag: 'div',
        });
        leftSideChat.appendChildren([new SearchInput(), this.users]);
        chatWrapper.appendChildren([leftSideChat, rightSideChat]);

        content.appendChildren([
            new BurgerMenu(),
            this.renderHeader(),
            chatWrapper,
        ]);

        return content.getNode();
    }
}

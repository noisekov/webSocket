import { BurgerMenu } from '../../components/BurgerMenu/BurgerMenu';
import ButtonComponent from '../../components/ButtonComponent';
import { Chat } from '../../components/Chat/Chat';
import Component from '../../components/Component';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import AppState, { AppStateI } from '../../utils/AppState';
import NavigationFacade from '../../utils/NavigationFacade';
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
        this.webSocketService = WebSocketService.getInstance();
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

            if (typeData.type === 'USER_EXTERNAL_LOGOUT') {
                this.appState
                    .getState()
                    .users_active.payload.users.forEach((user: any) => {
                        if (user.login === typeData.payload.user.login) {
                            user.isLogined = false;
                        }
                    });
                this.updateUserList();
            }

            if (typeData.type === 'USER_EXTERNAL_LOGIN') {
                const state =
                    this.appState.getState().users_active.payload.users;
                const userExist = state.find(
                    (user: { login: string }) =>
                        user.login === typeData.payload.user.login
                );
                state.forEach((user: { login: string; isLogined: boolean }) => {
                    if (user.login === typeData.payload.user.login) {
                        user.isLogined = true;
                    }
                });
                this.updateUserList();
                if (userExist) return;
                this.appState.addNewUser(typeData.payload.user);
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
                const component = new Component({
                    tag: `li`,
                    className: `user ${user.isLogined ? 'active' : 'inactive'}`,
                    text: user.login,
                });
                component.addListener('click', () => {
                    const clickedUserName = component.getNode().textContent;
                    const chatComponent = this.appState.getState().chat_content;
                    chatComponent.destroyChildren();
                    this.handlerChosenUser(component, clickedUserName);
                });
                return component;
            }
        );

        this.users.appendChildren(userComponents);
    }

    handlerChosenUser(component: Component, clickedUserName: string | null) {
        const {
            chosen_user: headerChatComponent,
            chosen_user_status: headerChatStatus,
            chat_content: chatComponent,
            textarea: textareaComponent,
        } = this.appState.getState();
        headerChatComponent.setTextContent(clickedUserName || 'unknown');
        const status = component.hasClass('active') ? 'online' : 'offline';
        headerChatStatus.setTextContent(status);
        headerChatStatus.addClass(status);
        chatComponent.setTextContent('Write your first message...');
        textareaComponent.removeAttribute('disabled');
        this.webSocketService.send({
            id: null,
            type: 'MSG_FROM_USER',
            payload: {
                user: {
                    login: clickedUserName,
                },
            },
        });
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
                    sessionStorage.clear();
                    this.webSocketService.send({
                        id: null,
                        type: 'USER_LOGOUT',
                        payload: {
                            user: {
                                login,
                                password,
                            },
                        },
                    });
                    new NavigationFacade().navigateTo('login');
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
        rightSideChat.appendChildren([new Chat()]);
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

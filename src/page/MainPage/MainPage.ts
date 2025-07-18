import { BurgerMenu } from '../../components/BurgerMenu/BurgerMenu';
import ButtonComponent from '../../components/ButtonComponent';
import { Chat } from '../../components/Chat/Chat';
import Component from '../../components/Сomponent';
import { SearchInput } from '../../components/SearchInput/SearchInput';
import AppState from '../../utils/AppState';
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
        this.currentUserData = JSON.parse(
            sessionStorage.getItem('noisekov-funchat') ||
                '{"login": "", "password": "", "isLogined": false}'
        );
        this.webSocketService = WebSocketService.getInstance();
        this.webSocketService.initializeConnection();
        this.setupWebSocketListeners();
        this.setupStateSubscription();
    }

    private setupWebSocketListeners(): void {
        this.webSocketService.onMessage(async (event) => {
            const typeData = JSON.parse(event.data);
            const {
                payload: { user },
                type,
            } = typeData;

            if (type === 'USER_INACTIVE') {
                this.appState.setState({
                    users_inactive: typeData,
                });
            }

            if (type === 'USER_ACTIVE') {
                this.appState.setState({
                    users_active: typeData,
                });
            }

            if (type === 'USER_EXTERNAL_LOGOUT') {
                this.appState
                    .getState()
                    .users_active.payload.users.forEach(
                        (activeUser: { login: string; isLogined: boolean }) => {
                            if (activeUser.login === user.login) {
                                activeUser.isLogined = false;
                            }
                        }
                    );
                this.updateUserList();
            }

            if (type === 'USER_EXTERNAL_LOGIN') {
                this.handlerExternalLogin(user);
            }
        });
    }

    private handlerExternalLogin(user: { login: string; isLogined: boolean }) {
        const state = this.appState.getState().users_active.payload.users;
        const userExists = state.some((existingUser) => {
            if (existingUser.login === user.login) {
                existingUser.isLogined = true;

                return true;
            }
            return false;
        });
        this.updateUserList();

        if (userExists) return;

        this.appState.addNewUser(user);
    }

    private setupStateSubscription() {
        this.appState.subscribe(() => this.updateUserList());
    }

    private updateUserList() {
        const {
            users_active: {
                payload: { users: arrLoginedUsers },
            },
            users_inactive: {
                payload: { users: arrInactiveUsers },
            },
        } = this.appState.getState();
        const arrAllUsers = [...arrLoginedUsers, ...arrInactiveUsers];
        this.users.destroyChildren();
        const userComponents = arrAllUsers.flatMap(
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

    private handlerChosenUser(
        component: Component,
        clickedUserName: string | null
    ) {
        const {
            chosen_user: headerChatComponent,
            chosen_user_status: headerChatStatus,
            chat_content: chatComponent,
            textarea: textareaComponent,
        } = this.appState.getState();
        headerChatComponent.setTextContent(clickedUserName || 'unknown');
        const status = component.hasClass('active') ? 'online' : 'offline';
        headerChatStatus.setTextContent(status);
        headerChatStatus.removeClass('online', 'offline');
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

    private renderHeader() {
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
                    this.webSocketService.clearMessageHandlers();
                    this.webSocketService.isConnected = false;
                    new NavigationFacade().navigateTo('login');
                },
            }),
        ]);

        return header;
    }

    public render() {
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
        rightSideChat.append(new Chat());
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

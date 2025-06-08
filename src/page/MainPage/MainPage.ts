import { BurgerMenu } from '../../components/BurgerMenu/BurgerMenu';
import Component from '../../components/Component';
import AppState, { AppStateI } from '../../utils/AppState';
import WebSocketService from '../../utils/WebSoketService';

export default class MainPage {
    users: Component;
    constructor() {
        this.users = new Component({
            tag: 'div',
            className: 'users',
        });
    }

    renderUsers() {
        new WebSocketService().onMessage(async (event) => {
            const typeData = JSON.parse(event.data);

            if (typeData.type === 'USER_ACTIVE') {
                AppState.getInstance().setState({
                    users_active: typeData,
                });
            }
        });

        const arrLoginedUsers = (AppState.getInstance().getState() as AppStateI)
            .users_active.payload.users;

        const userComponents = arrLoginedUsers.map(
            (user: { login: string; isLogined: boolean }) => {
                return new Component({
                    tag: `div`,
                    className: `user ${user.isLogined ? 'active' : 'inactive'}`,
                    text: user.login,
                });
            }
        );

        return userComponents;
    }

    render() {
        const users = this.renderUsers();

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
        this.users.appendChildren(users);
        leftSideChat.appendChildren([
            new Component({ tag: 'input', className: 'search' }),
            this.users,
        ]);
        chatWrapper.appendChildren([leftSideChat, rightSideChat]);
        content.appendChildren([
            new Component({
                className: 'main-title title',
                text: 'FUN CHAT',
            }),
            new BurgerMenu(),
            chatWrapper,
        ]);

        return content.getNode();
    }
}

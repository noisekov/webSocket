import { BurgerMenu } from '../../components/BurgerMenu/BurgerMenu';
import Component from '../../components/Component';

export default class MainPage {
    users: Component;
    constructor() {
        this.users = new Component({
            tag: 'div',
            className: 'users',
        });
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

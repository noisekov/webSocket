import { BurgerMenu } from '../../components/BurgerMenu/BurgerMenu';
import Component from '../../components/Component';

export default class MainPage {
    render() {
        const content = new Component({
            className: 'main-wrapper',
        });
        content.appendChildren([
            new Component({
                className: 'main-title title',
                text: 'FUN CHAT',
            }),

            new BurgerMenu(),
        ]);

        return content.getNode();
    }
}

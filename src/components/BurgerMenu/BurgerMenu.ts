import Component from '../Component';

export class BurgerMenu extends Component {
    constructor() {
        super({});
        this.addComponents();
    }

    addComponents() {
        const content = new Component({
            tag: 'div',
            className: 'burger-wrapper',
        });
        const burger = new Component({
            tag: 'div',
            className: 'burger',
        });
        burger.appendChildren([
            new Component({ tag: 'span', className: 'burger-line' }),
        ]);
        content.appendChildren([
            new Component({ tag: 'input', className: 'search' }),
            burger,
        ]);
        this.appendChildren([content]);
    }
}

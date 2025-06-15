import Component from '../Component';

export class BurgerMenu extends Component {
    constructor() {
        super({ className: 'burger' });
        this.addComponents();
    }

    private addComponents() {
        this.appendChildren([
            new Component({ tag: 'span', className: 'burger-line' }),
        ]);
        this.addListener('click', () => this.toggleClass('active'));
    }
}

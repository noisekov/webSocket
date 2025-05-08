import Component from './component';

interface IButtonConstructor {
    className: string;
    text: string;
    onClick?: EventListener;
}

export default class ButtonComponent extends Component {
    onClick: EventListener | undefined;

    constructor({ className, text, onClick }: IButtonConstructor) {
        super({ tag: 'button', className, text });
        if (onClick) {
            this.onClick = onClick;
            this.addListener('click', this.onClick);
        }
    }

    override destroy() {
        if (this.onClick) {
            this.removeListener('click', this.onClick);
        }
        super.destroy();
    }
}

import AppState from '../../utils/AppState';
import Component from '../Сomponent';

export class ModalError extends Component {
    private message: string;
    constructor(errorMessage: string) {
        super({
            tag: 'div',
            className: 'modal-error',
        });
        this.message = errorMessage;
        this.addListener('click', () => this.destroy());
    }

    private renderModal() {
        const content = new Component({
            tag: 'div',
            className: 'modal-error__content',
        });
        const wrapper = new Component({
            tag: 'div',
            className: 'modal-error__wrapper',
            text: this.message,
        });
        content.append(wrapper);
        this.append(content);
    }

    public render() {
        this.renderModal();
        AppState.getInstance().getState().mainTemplate.append(this);
    }
}

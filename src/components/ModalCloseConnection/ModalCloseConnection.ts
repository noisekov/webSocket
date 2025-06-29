import AppState from '../../utils/AppState';
import Component from '../Component';

export class ModalCloseConnection extends Component {
    constructor() {
        super({
            tag: 'div',
            className: 'modal-close-connection',
        });
    }

    private renderModal() {
        const content = new Component({
            tag: 'div',
            className: 'modal-close-connection__content',
        });
        const wrapper = new Component({
            tag: 'div',
            className: 'modal-close-connection__wrapper',
        });
        content.append(wrapper);
        wrapper.appendChildren([
            new Component({
                tag: 'span',
                className: 'modal-close-connection__loader',
            }),
            new Component({
                tag: 'div',
                className: 'modal-close-connection__text',
                text: 'Connecting to the server..',
            }),
        ]);
        this.append(content);
    }

    public render() {
        this.renderModal();
        AppState.getInstance().getState().mainTemplate.append(this);
    }
}

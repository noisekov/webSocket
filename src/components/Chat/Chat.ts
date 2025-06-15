import Component from '../Component';

export class Chat extends Component {
    constructor() {
        super({ tag: 'div', className: 'chat' });
        this.render();
    }

    private renderHeader() {
        const header = new Component({
            tag: 'div',
            className: 'chat__header',
        });
        header.appendChildren([new Component({ tag: 'div' })]);
        this.appendChildren([header]);
    }

    private renderChatWindow() {
        const chat = new Component({
            tag: 'div',
            className: 'chat__window',
            text: 'Select the user to send the message to...',
        });
        this.appendChildren([chat]);
    }

    render() {
        this.renderHeader();
        this.renderChatWindow();
    }
}

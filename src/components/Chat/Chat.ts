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

    private renderInput() {
        const inputWrapper = new Component({
            tag: 'div',
            className: 'chat__message',
        });
        const input = new Component({
            tag: 'input',
            className: 'chat__input',
        });
        input.setAttribute('placeholder', 'Write your message...');
        const submit = new Component({
            tag: 'button',
            className: 'chat__submit button',
            text: 'submit',
        });
        submit.setAttribute('type', 'submit');
        inputWrapper.appendChildren([input, submit]);
        this.appendChildren([inputWrapper]);
    }

    render() {
        this.renderHeader();
        this.renderChatWindow();
        this.renderInput();
    }
}

import AppState from '../../utils/AppState';
import WebSocketService from '../../utils/WebSoketService';
import Component from '../Component';

interface messageDataI {
    id: string;
    from: string;
    to: string;
    text: string;
    datetime: number;
    status: {
        isDelivered: boolean;
        isReaded: boolean;
        isEdited: boolean;
    };
}
export class Chat extends Component {
    private appState;
    private msgLength;
    private webSocketService: WebSocketService;
    constructor() {
        super({ tag: 'div', className: 'chat' });
        this.appState = AppState.getInstance();
        this.webSocketService = WebSocketService.getInstance();
        this.render();
        this.msgLength = 0;
    }

    private renderHeader() {
        const header = new Component({
            tag: 'div',
            className: 'chat__header',
        });
        const chosenUser = new Component({
            tag: 'div',
            className: 'chat__user',
        });
        const chosenUserStatus = new Component({
            tag: 'div',
            className: 'chat__user-status',
        });
        this.appState.setState({
            chosen_user: chosenUser,
            chosen_user_status: chosenUserStatus,
        });
        header.appendChildren([chosenUser, chosenUserStatus]);
        this.appendChildren([header]);
    }

    private renderChatWindow() {
        const chat = new Component({
            tag: 'div',
            className: 'chat__window',
        });
        const mesageWrapper = new Component({
            tag: 'div',
            className: 'chat__window-wrapper',
            text: 'Select the user to send the message to...',
        });
        chat.appendChildren([mesageWrapper]);
        this.appState.setState({ chat_content: mesageWrapper });
        this.appendChildren([chat]);
    }

    private renderInput() {
        const inputWrapper = new Component({
            tag: 'div',
            className: 'chat__message',
        });
        const textarea = new Component({
            tag: 'textarea',
            className: 'chat__textarea',
        });
        textarea.setAttribute('placeholder', 'Write your message...');
        textarea.setAttribute('disabled', 'true');
        this.appState.setState({ textarea });
        const submit = new Component({
            tag: 'button',
            className: 'chat__submit button',
            text: 'submit',
        });
        submit.setAttribute('type', 'submit');
        submit.setAttribute('disabled', 'true');
        inputWrapper.appendChildren([textarea, submit]);
        this.appendChildren([inputWrapper]);
        this.submitHandler(submit, textarea);
        this.textAreaHandler(submit, textarea);
    }

    private submitHandler(submit: Component, textarea: Component) {
        submit.addListener('click', (evt) => {
            evt.preventDefault();
            const valueTextArea = (textarea.getNode() as HTMLTextAreaElement)
                .value;
            const userTo = this.appState
                .getState()
                .chosen_user.getNode().textContent;

            this.webSocketService.send({
                id: '1',
                type: 'MSG_SEND',
                payload: {
                    message: {
                        to: userTo,
                        text: valueTextArea,
                    },
                },
            });

            (textarea.getNode() as HTMLTextAreaElement).value = '';
            submit.setAttribute('disabled', 'true');
        });

        this.webSocketService.onMessage((event) => {
            const typeData = JSON.parse(event.data);

            if (typeData.type === 'MSG_SEND') {
                const messageData = typeData.payload.message;
                this.renderMessage(messageData);
            }
        });
    }

    private renderMessage(messageData: messageDataI) {
        const chatComponent = this.appState.getState().chat_content;
        chatComponent.setTextContent('');
        const message = new Component({
            tag: 'div',
            className: 'chat__window-message',
            text: messageData.text,
        });

        chatComponent.appendChildren([message]);
        chatComponent.appendChildren([...chatComponent.getChildren()]);
    }

    private textAreaHandler(submit: Component, textarea: Component) {
        textarea.addListener('input', (evt) => {
            const value = (evt.target as HTMLInputElement).value;

            if (value.length > this.msgLength) {
                submit.removeAttribute('disabled');

                return;
            }
            submit.setAttribute('disabled', 'true');
        });
    }

    render() {
        this.renderHeader();
        this.renderChatWindow();
        this.renderInput();
    }
}

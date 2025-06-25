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
    private chatWindow: Component;
    constructor() {
        super({ tag: 'div', className: 'chat' });
        this.appState = AppState.getInstance();
        this.webSocketService = WebSocketService.getInstance();
        this.chatWindow = new Component({
            tag: 'div',
            className: 'chat__window',
        });
        this.msgLength = 0;
        this.render();
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
        const mesageWrapper = new Component({
            tag: 'div',
            className: 'chat__window-wrapper',
            text: 'Select the user to send the message to...',
        });
        this.chatWindow.appendChildren([mesageWrapper]);
        this.appState.setState({ chat_content: mesageWrapper });
        this.appendChildren([this.chatWindow]);
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
            this.sendMessage(submit, textarea);
        });

        window.addEventListener('keypress', (evt) => {
            if (evt.key === 'Enter') {
                evt.preventDefault();
                this.sendMessage(submit, textarea);
            }
        });

        this.webSocketService.onMessage((event) => {
            const typeData = JSON.parse(event.data);

            if (
                typeData.type === 'MSG_FROM_USER' &&
                typeData.payload.messages.length
            ) {
                const messageData = typeData.payload.messages;
                this.renderMessages(messageData);
            }

            if (typeData.type === 'MSG_SEND') {
                const messageData = typeData.payload.message;
                this.addMessage(messageData);
            }
        });
    }

    sendMessage(submit: Component, textarea: Component) {
        const valueTextArea = (textarea.getNode() as HTMLTextAreaElement).value;

        if (!valueTextArea) {
            return;
        }

        const userTo = this.appState
            .getState()
            .chosen_user.getNode().textContent;
        this.webSocketService.send({
            id: null,
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
    }

    private scrollDown() {
        const node = this.chatWindow.getNode() as HTMLElement;
        node.scrollTop = node.scrollHeight;
    }

    private renderMessages(messagesData: messageDataI | messageDataI[]) {
        const chatComponent = this.appState.getState().chat_content;
        chatComponent.setTextContent('');
        chatComponent.destroyChildren();
        const messages = Array.isArray(messagesData)
            ? messagesData
            : [messagesData];
        const chosenUsers = this.appState
            .getState()
            .chosen_user.getNode().textContent;
        messages.forEach((messageData) =>
            this.createTemplate(messageData, chatComponent, chosenUsers)
        );
        chatComponent.appendChildren([...chatComponent.getChildren()]);
        this.scrollDown();
    }

    private addMessage(messagesData: messageDataI) {
        const chatComponent = this.appState.getState().chat_content;
        const chosenUsers = this.appState
            .getState()
            .chosen_user.getNode().textContent;

        if (!chosenUsers) return;

        chatComponent.setTextContent('');
        this.createTemplate(messagesData, chatComponent, chosenUsers);
        chatComponent.appendChildren([...chatComponent.getChildren()]);
        this.scrollDown();
    }

    private createTemplate(
        messageData: messageDataI,
        chatComponent: Component,
        chosenUsers: string | null
    ) {
        const isMyMessage = messageData.from !== chosenUsers;
        const message = new Component({
            tag: 'div',
            className: `message ${isMyMessage ? '' : 'message__not-me'}`,
        });
        const formatDate = new Date(messageData.datetime).toLocaleString();
        const messageHeader = new Component({
            tag: 'div',
            className: 'message__header',
        });
        const fromWhoMessage = new Component({
            tag: 'span',
            text: isMyMessage ? 'you' : chosenUsers,
        });
        messageHeader.appendChildren([
            fromWhoMessage,
            new Component({ tag: 'span', text: formatDate }),
        ]);
        message.appendChildren([
            messageHeader,
            new Component({
                tag: 'span',
                className: 'message__text',
                text: messageData.text,
            }),
        ]);
        chatComponent.appendChildren([message]);
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

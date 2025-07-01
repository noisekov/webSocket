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
    private currentUserDataLogin;
    private mainTemplate: Component;
    constructor() {
        super({ tag: 'div', className: 'chat' });
        this.appState = AppState.getInstance();
        this.webSocketService = WebSocketService.getInstance();
        this.chatWindow = new Component({
            tag: 'div',
            className: 'chat__window',
        });
        this.msgLength = 0;
        this.currentUserDataLogin = JSON.parse(
            sessionStorage.getItem('noisekov-funchat') ||
                '{"login": "", "password": "", "isLogined": false}'
        ).login;
        this.mainTemplate = this.appState.getState().mainTemplate;
        this.render();
        this.addListeners();
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
        this.append(header);
    }

    private renderChatWindow() {
        const mesageWrapper = new Component({
            tag: 'div',
            className: 'chat__window-wrapper',
            text: 'Select the user to send the message to...',
        });
        this.chatWindow.addListener('scroll', () => {
            this.appState.getState().context_menu.destroy();
        });
        this.chatWindow.append(mesageWrapper);
        this.appState.setState({ chat_content: mesageWrapper });
        this.append(this.chatWindow);
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
        this.append(inputWrapper);
        this.submitHandler(submit, textarea);
        this.textAreaHandler(submit, textarea);
    }

    private addListeners() {
        window.addEventListener('click', () =>
            this.appState.getState().context_menu.destroy()
        );
        this.mainTemplate.addListener('contextmenu', (evt: Event) => {
            this.appState.getState().context_menu.destroy();
            if (
                !(evt.target as HTMLElement).closest('.message') ||
                (evt.target as HTMLElement).closest('.message__not-me')
            )
                return;
            evt.preventDefault();
            this.renderContextMenu(evt as MouseEvent);
        });
    }

    private deleteMessage(id: string) {
        const chatComponents = this.appState.getState().chat_content;

        chatComponents.getChildren().forEach((chatComponent, index) => {
            if (chatComponent.getNode().id === id) {
                chatComponent.destroy();
                chatComponents.getChildren().splice(index, 1);
                this.appState.setState({
                    chat_content: chatComponents,
                });
            }
        });

        if (!chatComponents.getChildren().length) {
            chatComponents.setTextContent('Write your first message...');
        }
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
            if (typeData.type === 'MSG_DELETE') {
                this.deleteMessage(typeData.payload.message.id);
            }

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
        this.scrollDown();
    }

    private addMessage(messagesData: messageDataI) {
        const { from: messageFrom, to: messageTo } = messagesData;
        const chatComponent = this.appState.getState().chat_content;
        const chosenUsers = this.appState
            .getState()
            .chosen_user.getNode().textContent;
        // if authrizen user and chosen user dont match with message sender or recipient
        const isPossibleDisplayMessageInChat =
            (this.currentUserDataLogin === messageFrom &&
                chosenUsers === messageTo) ||
            (this.currentUserDataLogin === messageTo &&
                chosenUsers === messageFrom);

        if (!chosenUsers || !isPossibleDisplayMessageInChat) return;

        chatComponent.getChildren().length
            ? null
            : chatComponent.setTextContent('');
        this.createTemplate(messagesData, chatComponent, chosenUsers);
        this.scrollDown();
    }

    private createTemplate(
        messageData: messageDataI,
        chatComponent: Component,
        chosenUsers: string | null
    ) {
        const { from: messageFrom, text, datetime, id } = messageData;
        const isMyMessage = messageFrom !== chosenUsers;
        const message = new Component({
            tag: 'div',
            className: `message ${isMyMessage ? '' : 'message__not-me'}`,
            id: id,
        });
        const formatDate = new Date(datetime).toLocaleString();
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
                text,
            }),
        ]);
        chatComponent.append(message);
    }

    private renderContextMenu(evt: MouseEvent) {
        if (evt.target instanceof HTMLElement) {
            const rect = evt.target.getBoundingClientRect();
            const { scrollX, scrollY } = window;
            const contextMenu = new Component({
                tag: 'ul',
                className: 'context-menu',
            });
            contextMenu.getNode().style.top = `${rect.top + scrollY}px`;
            contextMenu.getNode().style.left = `${rect.left + scrollX}px`;
            const delteBtn = new Component({
                tag: 'li',
                className: 'context-menu__item',
                text: 'Delete',
            });
            delteBtn.addListener('click', () => {
                const messageElement = (evt.target as HTMLElement).closest(
                    '.message'
                );

                if (!messageElement) return;

                this.webSocketService.send({
                    id: null,
                    type: 'MSG_DELETE',
                    payload: {
                        message: {
                            id: messageElement.id,
                        },
                    },
                });
            });
            contextMenu.append(delteBtn);
            this.appState.getState().mainTemplate.append(contextMenu);
            this.appState.setState({ context_menu: contextMenu });
        }
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

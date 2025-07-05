import Component from '../Сomponent';
import AppState from '../../utils/AppState';
import NavigationFacade from '../../utils/NavigationFacade';
import WebSocketService from '../../utils/WebSoketService';

export default class AuthorizationForm extends Component {
    private inputLogin;
    private inputPassword;
    private inputLoginMsg;
    private inputPasswordMsg;
    private LogInBtn;
    private isLoginValid;
    private isPasswordValid;
    private formComponent;
    private appState;
    private webSocketService;
    constructor() {
        super({
            tag: 'fieldset',
            className: 'auth-fieldset',
        });
        this.inputLogin = new Component({
            tag: 'input',
            className: 'auth-input input',
            text: 'Authorization',
        });
        this.inputLoginMsg = new Component({
            tag: 'span',
            className: 'auth-error',
        });
        this.inputPassword = new Component({
            tag: 'input',
            className: 'auth-input input',
            text: 'Authorization',
        });
        this.inputPasswordMsg = new Component({
            tag: 'span',
            className: 'auth-error',
        });
        this.LogInBtn = new Component({
            tag: 'button',
            className: 'auth-btn button',
            text: 'Log in',
        });
        this.isLoginValid = false;
        this.isPasswordValid = false;
        this.appState = AppState.getInstance();
        this.webSocketService = WebSocketService.getInstance();
        this.formComponent = this.appState.getState().content;
        this.updateInputLoginComponents();
        this.updateInputPasswordComponents();
        this.updateLogInBtnComponent();
        this.addListenerFormComponent();
        this.addComponents();
    }

    private matchRegular(inputValue: string): boolean {
        return new RegExp('^(?=.*[a-z])(?=.*[A-Z]).*$').test(inputValue);
    }

    private updateLogInBtnComponent() {
        this.LogInBtn.setAttribute('type', 'submit');
        this.LogInBtn.setAttribute('disabled', '');

        if (this.isPasswordValid && this.isLoginValid) {
            this.LogInBtn.removeAttribute('disabled');
        }
    }

    private addListenerFormComponent() {
        this.formComponent.addListener('submit', (evt: Event) => {
            evt.preventDefault();
            const submitEvt = evt.target as HTMLFormElement;
            const data = new FormData(submitEvt);
            const [login, password] = [...data.values()].map((value) =>
                value.toString()
            );
            sessionStorage.setItem(
                'noisekov-funchat',
                `{
                  "login": "${login}",
                  "password": "${password}",
                  "isLogined": true
                }`
            );

            this.webSocketService.initializeConnection();
            this.webSocketService.onMessage((event) => {
                const typeData = JSON.parse(event.data);

                if (typeData.type === 'USER_ACTIVE') {
                    this.appState.setState({
                        users_active: typeData,
                    });
                    new NavigationFacade().navigateTo('main');
                }
            });
        });
    }

    private updateInputLoginComponents() {
        this.inputLogin.setAttribute('placeholder', 'Set login');
        this.inputLogin.setAttribute('autocomplete', 'off');
        this.inputLogin.setAttribute('name', 'login');

        this.inputLogin.addListener('input', (event: Event) => {
            const valueLog = (event.target as HTMLInputElement).value;
            const MAX_LENGTH_LOGIN = 12;

            if (
                this.matchRegular(valueLog) &&
                valueLog.length < MAX_LENGTH_LOGIN
            ) {
                this.inputLoginMsg.setTextContent('');
                this.isLoginValid = true;
                this.updateLogInBtnComponent();

                return;
            }

            this.isLoginValid = false;
            this.inputLoginMsg.setTextContent(
                `The login must contain letters of different cases and be less than ${MAX_LENGTH_LOGIN} characters long.`
            );
            this.updateLogInBtnComponent();
        });
    }

    private updateInputPasswordComponents() {
        this.inputPassword.setAttribute('placeholder', 'Set password');
        this.inputPassword.setAttribute('type', 'password');
        this.inputPassword.setAttribute('name', 'password');
        this.inputPassword.setAttribute('autocomplete', 'off');

        this.inputPassword.addListener('input', (event: Event) => {
            const valuePas = (event.target as HTMLInputElement).value;
            const MIN_LENGTH_PASSWORD = 4;

            if (
                this.matchRegular(valuePas) &&
                valuePas.length > MIN_LENGTH_PASSWORD
            ) {
                this.inputPasswordMsg.setTextContent('');
                this.isPasswordValid = true;
                this.updateLogInBtnComponent();

                return;
            }

            this.isPasswordValid = false;
            this.inputPasswordMsg.setTextContent(
                `Password must contain mixed case letters and be more than ${MIN_LENGTH_PASSWORD} characters.`
            );
            this.updateLogInBtnComponent();
        });
    }

    private addComponents() {
        this.appendChildren([
            new Component({
                tag: 'legend',
                className: 'auth-legend',
                text: 'Authorization',
            }),
            this.inputLogin,
            this.inputLoginMsg,
            this.inputPassword,
            this.inputPasswordMsg,
        ]);
    }

    public getLogInBtn() {
        return this.LogInBtn;
    }
}

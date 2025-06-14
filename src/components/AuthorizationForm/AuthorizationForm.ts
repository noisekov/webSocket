import ContentRender from '../../utils/ContentRender';
import AppRouter from '../../utils/AppRouter';
import WebSoketService from '../../utils/WebSoketService';
import Component from '../Component';
import AppState, { AppStateI } from '../../utils/AppState';

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
        this.formComponent = (this.appState.getState() as AppStateI).content;
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
            new WebSoketService().onMessage((event) => {
                const typeData = JSON.parse(event.data);

                if (typeData.type === 'USER_ACTIVE') {
                    this.appState.setState({
                        users_active: typeData,
                    });
                    new AppRouter().setPath('main');
                    new ContentRender().render();
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

            if (this.matchRegular(valueLog)) {
                this.inputLoginMsg.setTextContent('');
                this.isLoginValid = true;
                this.updateLogInBtnComponent();

                return;
            }

            this.isLoginValid = false;
            this.inputLoginMsg.setTextContent(
                'Login must contain mixed case letters.'
            );
            this.updateLogInBtnComponent();
        });
    }

    private updateInputPasswordComponents() {
        this.inputPassword.setAttribute('placeholder', 'Set password');
        this.inputPassword.setAttribute('name', 'password');
        this.inputPassword.setAttribute('autocomplete', 'off');

        this.inputPassword.addListener('input', (event: Event) => {
            const valuePas = (event.target as HTMLInputElement).value;

            if (this.matchRegular(valuePas) && valuePas.length > 4) {
                this.inputPasswordMsg.setTextContent('');
                this.isPasswordValid = true;
                this.updateLogInBtnComponent();

                return;
            }

            this.isPasswordValid = false;
            this.inputPasswordMsg.setTextContent(
                'Password must contain mixed case letters and be more than 4 characters.'
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

import ContentRender from '../../utils/ContentRender';
import AppRouter from '../../utils/AppRouter';
import WebSoketService from '../../utils/WebSoketService';
import Component from '../Component';

export default class AuthorizationForm extends Component {
    private inputLogin;
    private inputPassword;
    private inputLoginMsg;
    private inputPasswordMsg;
    private LogInBtn;
    private isLoginValid;
    private isPasswordValid;
    private formComponent;
    constructor(callback: () => Component) {
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
        this.formComponent = callback();
        this.updateInputLoginComponents();
        this.updateInputPasswordComponents();
        this.updateLogInBtnComponent();
        this.addListenerFormComponent();
        this.addComponents();
    }

    matchRegular(inputValue: string): boolean {
        return new RegExp('^(?=.*[a-z])(?=.*[A-Z]).*$').test(inputValue);
    }

    updateLogInBtnComponent() {
        this.LogInBtn.setAttribute('type', 'submit');
        this.LogInBtn.setAttribute('disabled', '');

        if (this.isPasswordValid && this.isLoginValid) {
            this.LogInBtn.removeAttribute('disabled');
        }
    }

    addListenerFormComponent() {
        this.formComponent.addListener('submit', (evt: Event) => {
            evt.preventDefault();
            const submitEvt = evt.target as HTMLFormElement;
            const data = new FormData(submitEvt);
            const [login, password] = [...data.values()];
            console.log(login);
            console.log(password);

            new WebSoketService();
            new AppRouter().setPath('main');
            new ContentRender().render();
        });
    }

    updateInputLoginComponents() {
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

    updateInputPasswordComponents() {
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

    addComponents() {
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

    getLogInBtn() {
        return this.LogInBtn;
    }
}

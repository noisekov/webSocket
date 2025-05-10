import AppRouter from '../../utils/Router';
import ButtonComponent from '../ButtonComponent';
import Component from '../Component';

export default class AuthorizationForm extends Component {
    private inputLogin;
    private inputPassword;
    private inputLoginMsg;
    private inputPasswordMsg;
    private LogInBtn;
    private isLoginValid;
    private isPasswordValid;
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
        this.LogInBtn = new ButtonComponent({
            className: 'auth-btn button',
            text: 'Log in',
            onClick: (evt) => {
                evt.preventDefault();
                new AppRouter().setPath('main');
            },
        });
        this.isLoginValid = false;
        this.isPasswordValid = false;

        this.updateInputLoginComponents();
        this.updateInputPasswordComponents();
        this.updateLogInBtnComponent();
        this.addComponents();
    }

    matchRegular(inputValue: string): boolean {
        return new RegExp('^(?=.*[a-z])(?=.*[A-Z]).*$').test(inputValue);
    }

    updateLogInBtnComponent() {
        this.LogInBtn.setAttribute('disabled', '');

        if (this.isPasswordValid && this.isLoginValid) {
            this.LogInBtn.removeAttribute('disabled');
        }
    }

    updateInputLoginComponents() {
        this.inputLogin.setAttribute('placeholder', 'Set login');

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

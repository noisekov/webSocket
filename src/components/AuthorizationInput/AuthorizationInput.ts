import Component from '../Component';

export default class AuthorizationInput extends Component {
    inputLogin;
    inputPassword;
    inputLoginMsg;
    inputPasswordMsg;

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

        this.updateInputLoginComponents();
        this.updateInputPasswordComponents();
        this.addComponents();
    }

    matchRegular(inputValue: string): boolean {
        return new RegExp('^(?=.*[a-z])(?=.*[A-Z]).*$').test(inputValue);
    }

    updateInputLoginComponents() {
        this.inputLogin.setAttribute('placeholder', 'Set login');
        this.inputLogin.addListener('input', (event: Event) => {
            const valueLog = (event.target as HTMLInputElement).value;

            if (this.matchRegular(valueLog)) {
                this.inputLoginMsg.setTextContent('');

                return;
            }

            this.inputLoginMsg.setTextContent(
                'Login must contain mixed case letters.'
            );
        });
    }

    updateInputPasswordComponents() {
        this.inputPassword.setAttribute('placeholder', 'Set password');
        this.inputPassword.addListener('input', (event: Event) => {
            const valuePas = (event.target as HTMLInputElement).value;

            if (this.matchRegular(valuePas) && valuePas.length > 4) {
                this.inputPasswordMsg.setTextContent('');

                return;
            }

            this.inputPasswordMsg.setTextContent(
                'Password must contain mixed case letters and be more than 4 characters.'
            );
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
}

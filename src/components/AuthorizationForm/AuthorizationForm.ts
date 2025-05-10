import Component from '../Component';

export default class AuthorizationForm extends Component {
    inputLogin;
    inputPassword;

    constructor() {
        super({
            tag: 'fieldset',
            className: 'auth-fieldset',
        });
        this.inputLogin = new Component({
            tag: 'input',
            className: 'auth-input',
            text: 'Authorization',
        });
        this.inputPassword = new Component({
            tag: 'input',
            className: 'auth-input',
            text: 'Authorization',
        });

        this.updateInputComponents();
        this.addComponents();
    }

    updateInputComponents() {
        this.inputLogin.setAttribute('placeholder', 'Set login');
        this.inputPassword.setAttribute('placeholder', 'Set password');
    }

    addComponents() {
        this.appendChildren([
            new Component({
                tag: 'legend',
                className: 'auth-legend',
                text: 'Authorization',
            }),
            this.inputLogin,
            this.inputPassword,
        ]);
    }
}

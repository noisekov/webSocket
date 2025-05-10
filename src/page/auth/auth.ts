import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import AuthorizationInput from '../../components/AuthorizationInput/AuthorizationInput';

export default class AuthPage {
    constructor() {
        this.init();
    }

    init() {
        history.replaceState({}, '', '/login');
    }

    render() {
        const content = new Component({
            tag: 'form',
            className: 'auth-wrapper',
        });
        const authorizationInput = new AuthorizationInput();

        content.appendChildren([
            authorizationInput,
            new ButtonComponent({
                className: 'auth-btn button',
                text: 'Log in',
                onClick: (evt) => {
                    evt.preventDefault();
                    window.location.href = `main`;
                },
            }),
            new ButtonComponent({
                className: 'auth-btn button',
                text: 'Info',
                onClick: (evt) => {
                    evt.preventDefault();
                    window.location.href = `about`;
                },
            }),
        ]);

        return content.getNode();
    }
}

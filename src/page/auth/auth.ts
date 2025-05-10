import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import AuthorizationForm from '../../components/AuthorizationForm/AuthorizationForm';

export default class AuthPage {
    constructor() {
        this.init();
    }

    init() {
        history.replaceState({}, '', '/login');
    }

    render() {
        const content = new Component({
            className: 'auth-wrapper',
        });
        const authorizationForm = new AuthorizationForm();

        content.appendChildren([
            authorizationForm,
            new ButtonComponent({
                className: 'auth-btn button',
                text: 'Log in',
                onClick: () => (window.location.href = `main`),
            }),
            new ButtonComponent({
                className: 'auth-btn button',
                text: 'Info',
                onClick: () => (window.location.href = `about`),
            }),
        ]);

        return content.getNode();
    }
}

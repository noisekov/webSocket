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
            tag: 'form',
            className: 'auth-wrapper',
        });
        const authorizationForm = new AuthorizationForm();

        content.appendChildren([
            authorizationForm,
            authorizationForm.getLogInBtn(),
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

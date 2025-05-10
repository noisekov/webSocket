import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import AuthorizationForm from '../../components/AuthorizationForm/AuthorizationForm';
import AppRouter from '../../utils/Router';

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
                    new AppRouter().setPath('about');
                },
            }),
        ]);

        return content.getNode();
    }
}

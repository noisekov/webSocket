import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import AuthorizationForm from '../../components/AuthorizationForm/AuthorizationForm';
import AppRouter from '../../utils/Router';
import ContentRender from '../../utils/ContentRender';

export default class AuthPage extends Component {
    constructor() {
        super({});
        this.init();
    }

    init() {
        history.pushState(this, '', 'login');
    }

    render() {
        const content = new Component({
            tag: 'form',
            className: 'auth-wrapper',
        });
        const authorizationForm = new AuthorizationForm(() => content);

        content.appendChildren([
            authorizationForm,
            authorizationForm.getLogInBtn(),
            new ButtonComponent({
                className: 'auth-btn button',
                text: 'Info',
                onClick: (evt) => {
                    evt.preventDefault();
                    content.destroy();
                    new AppRouter().setPath('about');
                    new ContentRender().render();
                },
            }),
        ]);

        return content.getNode();
    }
}

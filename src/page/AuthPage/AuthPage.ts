import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import AuthorizationForm from '../../components/AuthorizationForm/AuthorizationForm';
import AppRouter from '../../utils/AppRouter';
import ContentRender from '../../utils/ContentRender';
import AppState from '../../utils/AppState';

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
        AppState.getInstance().setState({ content: content });
        const authorizationForm = new AuthorizationForm();
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

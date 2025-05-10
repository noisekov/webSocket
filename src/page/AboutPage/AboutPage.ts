import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';
import ContentRender from '../../utils/ContentRender';
import AppRouter from '../../utils/Router';

export default class AboutPage {
    render() {
        const content = new Component({
            className: 'about-wrapper',
        });
        content.appendChildren([
            new Component({
                className: 'about-title title',
                text: 'Funny Chat',
            }),
            new Component({
                className: 'about-subtitle',
                text: 'The application is created using a third-party server and WebSokets API',
            }),
            new ButtonComponent({
                className: 'about-btn button',
                text: 'Back',
                onClick: () => {
                    content.destroy();
                    new AppRouter().setPath('login');
                    new ContentRender().render();
                    window.history.go(-1);
                },
            }),
        ]);

        return content.getNode();
    }
}

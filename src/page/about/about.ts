import ButtonComponent from '../../components/button';
import Component from '../../components/component';

export default class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        history.replaceState({}, '', '/about');
    }

    render() {
        const content = new Component({
            className: 'about-wrapper',
        });
        content.appendChildren([
            new Component({
                className: 'about-title',
                text: 'Funny Chay',
            }),
            new Component({
                className: 'about-subtitle',
                text: 'The application is created using a third-party server and websokets',
            }),
            new ButtonComponent({
                className: 'about-btn button',
                text: 'Back',
                onClick: () => window.history.go(-1),
            }),
        ]);

        return content.getNode();
    }
}

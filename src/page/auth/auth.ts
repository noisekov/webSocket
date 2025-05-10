import ButtonComponent from '../../components/ButtonComponent';
import Component from '../../components/Component';

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
        const fieldset = new Component({
            tag: 'fieldset',
        });

        content.appendChildren([
            new Component({
                className: 'auth-title title',
                text: 'Authorization',
            }),
            fieldset,
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

        fieldset.appendChildren([
            new Component({
                className: 'auth-title title',
                text: 'Authorization',
            }),
        ]);

        return content.getNode();
    }
}

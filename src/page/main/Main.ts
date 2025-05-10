import Component from '../../components/Component';

export default class MainPage {
    render() {
        const content = new Component({
            className: 'MAIN PAGE',
            text: 'MAIN',
        });

        return content.getNode();
    }
}

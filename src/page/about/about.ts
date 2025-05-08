import ButtonComponent from '../../components/button';

export default class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        history.replaceState({}, '', '/about');
    }

    render() {
        return new ButtonComponent({
            className: 'btn',
            text: 'ABOUT',
        }).getNode();
    }
}

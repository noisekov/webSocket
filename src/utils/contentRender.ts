import MainTemplate from '../components/MainTemplate';
import AboutPage from '../page/about/About';
import AuthPage from '../page/auth/Auth';
import AppRouter from './Router';

type RoutePaths = '/login' | '/' | '/about';

export default class ContentRender {
    body: HTMLBodyElement | null;

    constructor() {
        this.body = document.querySelector('body');
    }

    render() {
        const currentPath = new AppRouter().getPath() as RoutePaths;

        if (currentPath) {
            let renderTempalate = null;

            switch (currentPath) {
                case '/':
                    renderTempalate = new AuthPage();
                    break;
                case '/login':
                    renderTempalate = new AuthPage();
                    break;
                case '/about':
                    renderTempalate = new AboutPage();
                    break;
                default:
                    renderTempalate = new AuthPage();
                    break;
            }

            this.body
                ?.appendChild(new MainTemplate().getNode())
                .appendChild(renderTempalate.render());
        }
    }
}

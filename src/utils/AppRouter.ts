import ContentRender from './ContentRender';

export default class AppRouter {
    path: string | null;

    constructor() {
        this.path = window.location.pathname;
        window.onpopstate = () => new ContentRender().render();
    }

    public getPath() {
        this.checkPrivatePath();

        return this.path;
    }

    private checkPrivatePath() {
        const currentUserLoggedIn = JSON.parse(
            sessionStorage.getItem('noisekov-funchat') ||
                '{"login": "", "password": "", "isLogined": false}'
        );

        switch (this.path) {
            case '/login':
                currentUserLoggedIn.isLogined
                    ? ((this.path = '/main'), this.setPath('main'))
                    : ((this.path = '/'), this.setPath('login'));
                break;
            case '/':
                currentUserLoggedIn.isLogined
                    ? ((this.path = '/main'), this.setPath('main'))
                    : ((this.path = '/'), this.setPath('login'));
                break;
            case '/main':
                currentUserLoggedIn.isLogined
                    ? ((this.path = '/main'), this.setPath('main'))
                    : ((this.path = '/'), this.setPath('login'));
                break;
        }
    }

    public setPath(path: string) {
        history.replaceState({}, '', path);
    }
}

import ContentRender from './ContentRender';

export default class AppRouter {
    path: string | null = null;

    constructor() {
        this.path = window.location.pathname;
        window.onpopstate = () => new ContentRender().render();
    }

    getPath() {
        return this.path;
    }

    setPath(path: string) {
        history.replaceState({}, '', path);
    }
}

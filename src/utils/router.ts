export default class AppRouter {
    path: string | null = null;

    constructor() {
        this.path = window.location.pathname;
    }

    getPath() {
        return this.path;
    }

    setPath(path: string) {
        window.location.href = path;
    }
}

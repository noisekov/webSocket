import AppRouter from './AppRouter';
import ContentRender from './ContentRender';

export default class NavigationFacade {
    private router: AppRouter;
    private renderer: ContentRender;
    constructor() {
        this.router = new AppRouter();
        this.renderer = new ContentRender();
    }

    navigateTo(path: string) {
        this.router.setPath(path);
        this.renderer.render();
    }
}

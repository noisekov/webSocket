import AppState from '../../utils/AppState';
import Component from '../Component';

export class SearchInput extends Component {
    private appState: AppState;
    constructor() {
        super({
            tag: 'input',
            className: 'search',
        });
        this.setAttribute('placeholder', 'Search...');
        this.setAttribute('name', 'search');
        this.appState = AppState.getInstance();
        this.addHandler();
    }

    addHandler() {
        this.addListener('input', (event) => {
            const arrUsers =
                this.appState.getState().users_active.payload.users;

            const filteredUsers = arrUsers.filter((user: { login: string }) => {
                return user.login
                    .toLowerCase()
                    .includes(
                        (event?.target as HTMLInputElement).value.toLowerCase()
                    );
            });
            console.log(filteredUsers);
        });
    }
}

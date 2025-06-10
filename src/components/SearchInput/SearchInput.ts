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
        let isSetOldUsers = false;

        this.addListener('input', (event) => {
            const arrUsers =
                this.appState.getState().users_active.payload.users;
            const inputValue = (event?.target as HTMLInputElement).value;
            const filteredUsers = arrUsers.filter((user: { login: string }) => {
                return user.login
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
            });

            this.appState.setState({
                users_active: {
                    payload: {
                        users: inputValue
                            ? filteredUsers
                            : this.appState.getState().old_users,
                    },
                },
                ...(isSetOldUsers ? {} : { old_users: arrUsers }),
            });

            isSetOldUsers = true;
        });
    }
}

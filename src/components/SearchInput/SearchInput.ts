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
            const state = this.appState.getState();
            const arrUsersBeforeFilter = state.users_before_filter;
            const arrUsers = state.users_active.payload.users;
            const filtredUsers = arrUsersBeforeFilter.length
                ? arrUsersBeforeFilter
                : arrUsers;
            const inputValue = (event?.target as HTMLInputElement).value;
            const filteredUsers = filtredUsers.filter(
                (user: { login: string }) => {
                    return user.login
                        .toLowerCase()
                        .includes(inputValue.toLowerCase());
                }
            );

            this.appState.setState({
                users_active: {
                    payload: {
                        users: inputValue
                            ? filteredUsers
                            : state.users_before_filter,
                    },
                },
                ...(isSetOldUsers ? {} : { users_before_filter: arrUsers }),
            });

            isSetOldUsers = true;
        });
    }
}

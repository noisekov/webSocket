import AppState from '../../utils/AppState';
import Component from '../Сomponent';

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

    private debounce<T>(func: (arg: T) => unknown, time: number) {
        let timeout: NodeJS.Timeout;

        return function (this: unknown, arg: T) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, [arg]), time);
        };
    }

    private setApplicationState(
        inputValue: string,
        filteredAciveUsers: { login: string }[],
        filteredInAciveUsers: { login: string }[],
        state: any,
        arrActiveUsers: { login: string }[],
        arrInactiveUsers: { login: string }[],
        isSetOldUsers: boolean
    ) {
        //I had to write such a complex filtering because I can't use querySelector and I can't save the node element in the state when creating it, because this triggers a list update and we fall into recursion and stack overflow
        this.appState.setState({
            users_active: {
                payload: {
                    users: inputValue
                        ? filteredAciveUsers
                        : state.users_active_before_filter,
                },
            },
            users_inactive: {
                payload: {
                    users: inputValue
                        ? filteredInAciveUsers
                        : state.users_inactive_before_filter,
                },
            },
            ...(isSetOldUsers
                ? {}
                : {
                      users_active_before_filter: arrActiveUsers,
                      users_inactive_before_filter: arrInactiveUsers,
                  }),
        });
    }

    private getData() {
        const state = this.appState.getState();
        const {
            users_active_before_filter: arrActiveUsersBeforeFilter,
            users_inactive_before_filter: arrInActiveUsersBeforeFilter,
            users_active: usersActive,
            users_inactive: usersInactive,
        } = state;
        const arrActiveUsers = usersActive.payload.users;
        const arrInactiveUsers = usersInactive.payload.users;
        const choseRightActiveUsers = arrActiveUsersBeforeFilter.length
            ? arrActiveUsersBeforeFilter
            : arrActiveUsers;
        const choseRightInactiveUsers = arrInActiveUsersBeforeFilter.length
            ? arrInActiveUsersBeforeFilter
            : arrInactiveUsers;

        return {
            choseRightActiveUsers,
            choseRightInactiveUsers,
            state,
            arrActiveUsers,
            arrInactiveUsers,
        };
    }

    private addHandler() {
        let isSetOldUsers = false;
        this.addListener(
            'input',
            this.debounce((event) => {
                const {
                    choseRightActiveUsers,
                    choseRightInactiveUsers,
                    state,
                    arrActiveUsers,
                    arrInactiveUsers,
                } = this.getData();
                const inputValue = (event?.target as HTMLInputElement).value;
                const filteredAciveUsers = choseRightActiveUsers.filter(
                    (user: { login: string }) => {
                        return user.login
                            .toLowerCase()
                            .includes(inputValue.toLowerCase());
                    }
                );
                const filteredInAciveUsers = choseRightInactiveUsers.filter(
                    (user: { login: string }) => {
                        return user.login
                            .toLowerCase()
                            .includes(inputValue.toLowerCase());
                    }
                );
                this.setApplicationState(
                    inputValue,
                    filteredAciveUsers,
                    filteredInAciveUsers,
                    state,
                    arrActiveUsers,
                    arrInactiveUsers,
                    isSetOldUsers
                );
                isSetOldUsers = true;
            }, 500)
        );
    }
}

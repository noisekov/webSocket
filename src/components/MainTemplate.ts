import AppState from '../utils/AppState';
import Component from './Сomponent';

export default class MainTemplate extends Component {
    constructor() {
        super({ className: 'main' });
        AppState.getInstance().setState({ mainTemplate: this });
    }
}

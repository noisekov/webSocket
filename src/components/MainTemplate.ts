import AppState from '../utils/AppState';
import Component from './Component';

export default class MainTemplate extends Component {
    constructor() {
        super({ className: 'main' });
        AppState.getInstance().setState({ mainTemplate: this });
    }
}

// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import dialog from './dialog';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, dialog });

export default reducers;

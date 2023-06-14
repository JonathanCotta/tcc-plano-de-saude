// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import dialog from './dialog';
import consultaDialog from './consultaDialog';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, dialog, consultaDialog });

export default reducers;

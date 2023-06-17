// third-party
import { combineReducers } from 'redux';

// project import
import menu from './menu';
import dialog from './dialog';
import consultaDialog from './consultaDialog';
import user from './user';

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({ menu, dialog, consultaDialog, user });

export default reducers;

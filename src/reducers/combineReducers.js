import {combineReducers} from 'redux';
import receiveSMSReducer from './receiveSMS';
import getSMSReducer from './getSMS';
import getMessageReducer from './getMessage';

export default combineReducers({
  receiveSMSReducer,
  getSMSReducer,
  getMessageReducer,
});

import {createStore, combineReducers} from 'redux';
import {createAction, handleActions} from 'redux-actions';

const appInitialState = {
  getMessage: false,
};

const SET_GET_MESSAGE = 'SET_GET_MESSAGE';
const RECEIVE_DATA = 'RECEIVE_DATA';

export const setGetMessage = createAction(SET_GET_MESSAGE);
export const receiveData = createAction(RECEIVE_DATA);

const App = handleActions(
  {
    [SET_GET_MESSAGE]: (state, {payload}) => ({
      ...state,
      getMessage: payload,
    }),
  },
  appInitialState,
);

const rootReducer = combineReducers({
  App,
});

const configureStore = () => createStore(rootReducer);
export const store = configureStore();

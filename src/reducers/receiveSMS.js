import {AsyncStorage} from 'react-native';

const appInitialState = {
  payload: [],
};

const receiveSMSReducer = (state = appInitialState, action) => {
  switch (action.type) {
    // case "RECEIVE_SMS_FAIL":
    //   return {
    //     ...state,
    //     error: action.payload.error,
    //     errorCode: action.payload.errorCode,
    //     errorDetailLogin: action.payload.errorDetailLogin
    //   };
    case 'RECEIVE_SMS':
      try {
        AsyncStorage.setItem(
          'data',
          JSON.stringify([action.payload, ...state.payload]),
        );
      } catch (error) {
        console.log(error);
      }
      // return {
      //   ...state,
      //   payload: [...state.payload, action.payload],
      //   // payload: state.payload.concat(action.payload),
      // };

      return Object.assign({}, state, {
        payload: [action.payload, ...state.payload],
      });
    default:
      return state;
  }
};

export default receiveSMSReducer;

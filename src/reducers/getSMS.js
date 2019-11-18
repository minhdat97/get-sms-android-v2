const appInitialState = {
  data: {},
};

const getSMSReducer = (state = appInitialState, action) => {
  switch (action.type) {
    case 'GET_SMS_FAIL':
      return {
        ...state,
        error: action.payload.error,
        errorCode: action.payload.errorCode,
        errorDetailLogin: action.payload.errorDetailLogin,
      };
    case 'GET_SMS_SUCCESS':
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default getSMSReducer;

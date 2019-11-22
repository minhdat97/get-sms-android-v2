const appInitialState = {
  data: {},
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
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default receiveSMSReducer;

const appInitialState = {
  getMessage: false,
};

const getMessageReducer = (state = appInitialState, action) => {
  switch (action.type) {
    case 'GET_MESSAGE':
      console.log(action.payload);
      return {
        ...state,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default getMessageReducer;

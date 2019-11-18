const getSMS = payload => {
  console.log('credential', payload);
  return {
    type: 'RECEIVE_DATA',
    payload,
  };
};
const requestErrorGetSMS = errorDetailLogin => {
  return {
    type: 'GET_SMS_FAIL',
    payload: {
      error: true,
      errorCode: errorDetailLogin.data.code,
      errorDetailLogin: errorDetailLogin.data.data.message,
    },
  };
};
export {getSMS, requestErrorGetSMS};

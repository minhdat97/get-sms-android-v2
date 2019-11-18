const receiveSMS = payload => {
  console.log('credential', payload);
  return {
    type: 'RECEIVE_SMS',
    payload,
  };
};
const requestErrorReceiveSMS = errorDetailLogin => {
  return {
    type: 'RECEIVE_SMS_FAIL',
    payload: {
      error: true,
      errorCode: errorDetailLogin.data.code,
      errorDetailLogin: errorDetailLogin.data.data.message,
    },
  };
};

export {receiveSMS, requestErrorReceiveSMS};

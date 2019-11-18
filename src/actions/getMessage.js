const getMessage = payload => {
  console.log('credential', payload);
  return {
    type: 'GET_MESSAGE',
    payload,
  };
};
//   const requestErrorGetSMS = errorDetailLogin => {
//     return {
//       type: 'GET_SMS_FAIL',
//       payload: {
//         error: true,
//         errorCode: errorDetailLogin.data.code,
//         errorDetailLogin: errorDetailLogin.data.data.message,
//       },
//     };
//   };
export {getMessage};

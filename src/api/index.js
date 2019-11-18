import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sbx-api.payme.vn',
});

// instance.interceptors.request.use(
//   function(config) {
//     const dataStore = getDataStore("session", "login");
//     if (dataStore !== null) {
//       config.headers.authorization = "Bearer " + dataStore;
//     }
//     return config;
//   },
//   function(error) {
//     return Promise.reject(error);
//   }
// );

const callApiReceiveMess = data => {
  //   credentials.grant_type = process.env.REACT_APP_GRANT_TYPE;
  //   credentials.client_id = process.env.REACT_APP_CLIENT_ID;
  //   credentials.client_secret = process.env.REACT_APP_CLIENT_SECRET;
  //   credentials.scope = process.env.REACT_APP_SCOPE;

  return new Promise((resolve, reject) => {
    instance
      .post('/ReceiveSMS', data)
      .then(response => {
        console.log('response', response);
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => reject(error));
  });
};

const callApiGetMess = data => {
  //   credentials.grant_type = process.env.REACT_APP_GRANT_TYPE;
  //   credentials.client_id = process.env.REACT_APP_CLIENT_ID;
  //   credentials.client_secret = process.env.REACT_APP_CLIENT_SECRET;
  //   credentials.scope = process.env.REACT_APP_SCOPE;

  return new Promise((resolve, reject) => {
    instance
      .post('/GetSMS', data)
      .then(response => {
        console.log('response', response);
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => reject(error));
  });
};

export {callApiReceiveMess, callApiGetMess};

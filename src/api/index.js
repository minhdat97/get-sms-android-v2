import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.payme.vn',
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
  return new Promise((resolve, reject) => {
    instance
      .post('/ReceiveSMS', data)
      .then(response => {
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => reject(error));
  });
};

const callApiGetMess = data => {
  return new Promise((resolve, reject) => {
    instance
      .post('/GetSMS', data)
      .then(response => {
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => reject(error));
  });
};

const callApiCheckAlive = data => {
  console.log('data', data);
  return new Promise((resolve, reject) => {
    instance
      .post('/ActivitySMS', data)
      .then(response => {
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export {callApiReceiveMess, callApiGetMess, callApiCheckAlive};

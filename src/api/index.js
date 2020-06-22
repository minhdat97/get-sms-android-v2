import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sbx-api.payme.vn',
  // baseURL: 'https://news.ycombinator.com',
});

const instanceNoti = axios.create({
  baseURL: 'https://bs.payme.vn',
  // baseURL: 'https://news.ycombinator.com',
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
  console.log('data', data);
  return new Promise((resolve, reject) => {
    instance
      .post('/ReceiveSMS', data)
      .then(response => {
        console.log('here1');
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => {
        console.log('error', error);
        reject(error);
      });
  });
};

const callApiGetMess = data => {
  return new Promise((resolve, reject) => {
    instance
      .post('/GetSMS', data)
      .then(response => {
        // response.data.code !== 1000 ? reject(response) : resolve(response);

        response.status.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => reject(error));
  });
};

const callApiCheckAlive = data => {
  return new Promise((resolve, reject) => {
    instance
      .post('/ActivitySMS', data)
      .then(response => {
        console.log(response);
        // response.data.code !== 1000 ? reject(response) : resolve(response);
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => {
        console.log('error', error);
        reject(error);
      });
  });
};

const callApiNotiMobile = data => {
  console.log('data Noti', data);
  return new Promise((resolve, reject) => {
    instanceNoti
      .post('/v1/ReceiveIPN/Mobile/Notification', data)
      .then(response => {
        console.log('callApiNotiMobile', response);
        // response.data.code !== 1000 ? reject(response) : resolve(response);
        response.data.code !== 1000 ? reject(response) : resolve(response);
      })
      .catch(error => {
        console.log('error', error);
        reject(error);
      });
  });
};

export {
  callApiReceiveMess,
  callApiGetMess,
  callApiCheckAlive,
  callApiNotiMobile,
};

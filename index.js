/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
// import {setGetMessage, store} from './store';
import configureStore from './src/store';
import {getMessage} from './src/actions/getMessage';
import {receiveSMS} from './src/actions/receiveSMS';

import SmsAndroid from 'react-native-get-sms-android';
// import GetMessage from './GetMessage';
import DeviceInfo from 'react-native-device-info';
import BackgroundTimer from 'react-native-background-timer';
import sha256 from 'crypto-js/sha256';
import md5 from 'crypto-js/md5';
import * as api from './src/api';
import moment from 'moment';

// import {receiveSMS} from './src/actions/receiveSMS';
var counter = 0;

const store = configureStore();

const standardizedPhone = phoneNumber => {
  phoneNumber =
    phoneNumber.length && phoneNumber[0] === '+'
      ? phoneNumber.slice(1)
      : phoneNumber;
  return phoneNumber;
};

const phoneNumber = async () => {
  return DeviceInfo.getPhoneNumber().then(_phoneNumber => _phoneNumber);
};

// const Delay = delay => {
//   console.log('ping!');
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       return resolve(true);
//     }, delay);
//   });
// };

// setTimeout(() => {
//   return (
//       setTimeout(() => {
//         this.setState(() => ({activateLightColorForRed: false}));
//       }, 3000);
//     ),
// }, 3000);

// const timer = setInterval(() => {
//   console.log('ping!!!');
// }, 1000);

function Timer(fn, t) {
  var timerObj = BackgroundTimer.setInterval(fn, t);

  this.stop = function() {
    if (timerObj) {
      BackgroundTimer.clearInterval(timerObj);
      timerObj = null;
    }
    return this;
  };

  // start timer using current settings (if it's not already running)
  this.start = function() {
    if (!timerObj) {
      this.stop();
      timerObj = BackgroundTimer.setInterval(fn, t);
    }
    return this;
  };

  // start with new interval, stop current interval
  this.reset = function(newT) {
    t = newT;
    return this.stop().start();
  };
}

const MyHeadlessTask = async data => {
  console.log('DATA', data);
  console.log('Receiving Message!');

  var mydata = {};
  mydata.sender = data.sender;
  mydata.content = data.content;
  mydata.receiveTime = moment()
    .utc(data.time)
    .format();

  const myphone = {};
  const key = '%$&#@%$';

  // DeviceInfo.getPhoneNumber()
  //   .then(_phoneNumber => {
  //     if (_phoneNumber === '') {
  //       console.log('here');
  //       myphone.phone = '0359403487';
  //       mydata.receiver = '0359403487';
  //       // mydata.authorize = sha256('0359403487' + key).toString();
  //       // myphone.authorize = sha256('0359403487' + key).toString();
  //       myphone.authorize = sha256('0359403487' + key).toString();
  //       return {myphone, mydata};
  //     } else {
  //       mydata.receiver = standardizedPhone(_phoneNumber);
  //       // mydata.receiver = '0903456728';
  //       // mydata.authorize = sha256('0903456728' + key).toString();
  //       myphone.phone = standardizedPhone(_phoneNumber);
  //       // myphone.authorize = sha256(phoneNumber + key).toString();
  //       myphone.authorize = sha256(_phoneNumber + key).toString();
  //       return {myphone, mydata};
  //     }
  //   })
  //   .then(res => {
  //     mydata = res.mydata;
  //   });

  const phone = await phoneNumber();

  console.log('Phone', phone);

  if (phone === '') {
    console.log('here');
    myphone.phone = '0359403487';
    mydata.receiver = '0359403487';
    // mydata.authorize = sha256('0359403487' + key).toString();
    // myphone.authorize = sha256('0359403487' + key).toString();
    myphone.authorize = sha256('0359403487' + key).toString();
  } else {
    mydata.receiver = standardizedPhone(phone);
    // mydata.receiver = '0903456728';
    // mydata.authorize = sha256('0903456728' + key).toString();
    myphone.phone = standardizedPhone(phone);
    // myphone.authorize = sha256(phoneNumber + key).toString();
    console.log('phone hash', phone);
    myphone.authorize = sha256(standardizedPhone(phone) + key).toString();
  }
  // console.log('mydata', phone);
  // console.log('myphone', myphone);

  // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value

  if (data.isReady === 'true') {
    // const {minDate, maxDate} = this.state;
    store.dispatch(getMessage(true));
    // receiveSMS.dispatch();
    console.log('here');
  }

  if (data.action === 'new_message') {
    store.dispatch(getMessage(true));

    console.log('here');

    var filter = {
      box: 'inbox',
      read: 0,
      maxCount: 30,
      // address: '+84788904744',
    };

    await SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        var arr = JSON.parse(smsList);
        console.log('arr', arr);
        console.log('receiver', mydata.receiver);

        mydata.sender = standardizedPhone(arr[0].address);
        // mydata.sender = '0905195323';
        mydata.content = arr[0].body;
        console.log(
          md5(
            mydata.sender + mydata.receiver + mydata.content + key,
          ).toString(),
        );

        mydata.authorize = md5(
          mydata.sender +
            mydata.receiver +
            mydata.content +
            // moment(arr[0].date).format() +
            key,
        ).toString();
        mydata.receiveTime = moment(arr[0].date).format();

        console.log('mydata', mydata);
        api
          .callApiReceiveMess(mydata)
          .then(res => {
            if (res.data.code === 1000) {
              store.dispatch(receiveSMS({_id: arr[0]._id, status: true}));
            }
          })
          .catch(error => {
            console.log('error', error);
            store.dispatch(receiveSMS({_id: arr[0]._id, status: false}));
          });
        // Alert.alert(JSON.stringify(arr));
        // console.log(arr);
        // this.setState({smsList: arr});

        // this.intervalID = setTimeout(this.listSMS.bind(this), 0);
      },
    );
  }

  // console.log('myphone', myphone);
  // await api
  //   .callApiCheckAlive(myphone)
  //   .then(res => console.log(res))
  //   .catch(error => console.log(error));

  // BackgroundTimer.runBackgroundTimer(() => {
  //   // console.log('myphone', myphone);
  //   api
  //     .callApiCheckAlive({
  //       phone: '0902468121',
  //       authorize:
  //         '047e4607ad40140718149718a92149c0531f2924ac38a632a9b984fd1a0b699d',
  //     })
  //     .then(res => console.log(res))
  //     .catch(error => console.log(error));
  // }, 5000);

  // setInterval(() => {
  //   console.log('ping!!!');
  //   api
  //     .callApiCheckAlive({
  //       phone: '0902468121',
  //       authorize:
  //         '047e4607ad40140718149718a92149c0531f2924ac38a632a9b984fd1a0b699d',
  //     })
  //     .then(res => {
  //       counter++;
  //       if (counter === 5) {
  //         console.log('res', res);
  //       }
  //     })
  //     .catch(error => console.log('error', error));
  // }, 5000);

  var timer = new Timer(async function() {
    console.log('myphone', myphone);
    // your function here
    console.log('ping!!!');
    await api
      .callApiCheckAlive(myphone)
      .then(res => {
        console.log('counter', counter);
        if (counter === 5) {
          timer.reset(4000);
        }
        counter++;
      })
      .catch(error => {
        console.log('error', error);
        timer.reset(2000);
        counter = 0;
      });
  }, 2000);
  // BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.

  // await Delay(5000);

  // setTimeout(() => {
  //   console.log('ping!');
  //   console.log('myphone', myphone);
  //   api
  //     .callApiCheckAlive({
  //       phone: '0902468121',
  //       authorize:
  //         '047e4607ad40140718149718a92149c0531f2924ac38a632a9b984fd1a0b699d',
  //     })
  //     .then(res => {})
  //     .catch(error => {});
  // }, 5000);

  // if (data.action === 'new_message') {
  //   store.dispatch(setGetMessage(true));
  // }
  // setTimeout(() => {
  //   store.dispatch(setGetMessage(false));
  // }, 1000);

  return Promise.resolve();
};

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask('GetMessage', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);

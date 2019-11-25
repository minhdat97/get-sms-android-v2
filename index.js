/**
 * @format
 */

import {AppRegistry} from 'react-native';
import React from 'react';
import {Provider} from 'react-redux';
import App from './App';
import {name as appName} from './app.json';
import configureStore from './src/store';
import {getMessage} from './src/actions/getMessage';
import {receiveSMS} from './src/actions/receiveSMS';
import DeviceInfo from 'react-native-device-info';
import * as api from './src/api';
import moment from 'moment';
import md5 from 'crypto-js/md5';

var _id = 1;

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

const MyHeadlessTask = async data => {
  var mydata = {};
  const key = '%$&#@%$';

  const phone = await phoneNumber();

  if (phone === '') {
    mydata.receiver = '0359403487';
    // mydata.authorize = md5('0359403487' + key).toString();
  } else {
    mydata.receiver = standardizedPhone(phone);
    // mydata.authorize = md5(standardizedPhone(phone) + key).toString();
  }

  // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value

  if (data.isReady === 'true') {
    // const {minDate, maxDate} = this.state;
    store.dispatch(getMessage(true));
    // receiveSMS.dispatch();
  }

  if (data.action === 'new_message') {
    store.dispatch(getMessage(true));
    mydata.sender = standardizedPhone(data.sender);
    mydata.content = data.content;
    mydata.receiveTime = moment()
      .utc(data.time)
      .format();
    mydata.authorize = md5(
      mydata.sender +
        mydata.receiver +
        mydata.content +
        // moment(arr[0].date).format() +
        key,
    ).toString();
    // var filter = {
    //   box: 'inbox',
    //   read: 0,
    //   maxCount: 30,
    //   // address: '+84788904744',
    // };

    // await SmsAndroid.list(
    //   JSON.stringify(filter),
    //   fail => {
    //     console.log('Failed with this error: ' + fail);
    //   },
    //   (count, smsList) => {
    //     var arr = JSON.parse(smsList);

    //     mydata.sender = standardizedPhone(arr[0].address);
    //     // mydata.sender = '0905195323';
    //     mydata.content = arr[0].body;

    //     mydata.authorize = md5(
    //       mydata.sender +
    //         mydata.receiver +
    //         mydata.content +
    //         // moment(arr[0].date).format() +
    //         key,
    //     ).toString();
    //     mydata.receiveTime = moment(arr[0].date).format();

    //     // console.log('mydata', mydata);
    //     api
    //       .callApiReceiveMess(mydata)
    //       .then(res => {
    //         if (res.data.code === 1000) {
    //           store.dispatch(receiveSMS({_id: arr[0]._id, status: true}));
    //         }
    //       })
    //       .catch(error => {
    //         // console.log('error', error);
    //         store.dispatch(receiveSMS({_id: arr[0]._id, status: false}));
    //       });
    //   },
    // );
    await api
      .callApiReceiveMess(mydata)
      .then(res => {
        store.dispatch(receiveSMS({id: _id++, data: mydata, status: true}));
      })
      .catch(error =>
        store.dispatch(receiveSMS({id: _id++, data: mydata, status: false})),
      );
  }

  return Promise.resolve();
};

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask('GetMessage', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);

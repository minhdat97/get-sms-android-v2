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
  console.info('data receive sms: ', data);
  console.info('data time receive sms: ', typeof parseFloat(data.time));

  if (data.isNotification) {
    console.log('here1111');
    var mydata = {};

    if (data.title && data.packageName && data.text) {
      const param = {
        title: data.title,
        description: data.text,
      };
      mydata.sender = `[Notification] ${data.title} - ${data.packageName}`;
      mydata.content = data.text;
      mydata.receiveTime = moment().format();
      await api
        .callApiNotiMobile(param)
        .then(res => {
          store.dispatch(
            receiveSMS({
              id: _id++,
              data: mydata,
              status: true,
              message: 'Gửi online',
            }),
          );
        })
        .catch(error => {
          console.log('error info', error);
          store.dispatch(
            receiveSMS({
              id: _id++,
              data: mydata,
              status: false,
              message: error.data.data.message,
            }),
          );
        });
    }
  } else {
    var mydata = {};
    const key = '%$&#@%$';

    const phone = await phoneNumber();

    if (phone === '') {
      mydata.receiver = '0359403487';
    } else {
      mydata.receiver = standardizedPhone(phone);
    }

    // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value

    if (data.isReady === 'true') {
      store.dispatch(getMessage(true));
    }

    if (data.action === 'new_message') {
      if (data.hasInternet) {
        store.dispatch(getMessage(true));
        mydata.sender = standardizedPhone(data.sender);
        mydata.content = data.content;
        mydata.receiveTime = moment.unix(parseFloat(data.time)).format();
        console.log('newDate', mydata.receiveTime);
        mydata.authorize = md5(
          mydata.sender + mydata.receiver + mydata.content + key,
        ).toString();
        await api
          .callApiReceiveMess(mydata)
          .then(res => {
            store.dispatch(
              receiveSMS({
                id: _id++,
                data: mydata,
                status: true,
                message: 'Gửi online',
              }),
            );
          })
          .catch(error => {
            console.log('error info', error);
            store.dispatch(
              receiveSMS({
                id: _id++,
                data: mydata,
                status: false,
                message: error.data.data.message,
              }),
            );
          });
      } else {
        if (data.failSend) {
          mydata.sender = standardizedPhone(data.sender);
          mydata.content = data.content;
          mydata.receiveTime = moment.unix(parseFloat(data.time)).format();
          console.log('newDate', mydata.receiveTime);
          mydata.authorize = md5(
            mydata.sender +
              mydata.receiver +
              mydata.content +
              // moment(arr[0].date).format() +
              key,
          ).toString();
          store.dispatch(
            receiveSMS({
              id: _id++,
              data: mydata,
              status: false,
              message: 'Gửi offline',
            }),
          );
        } else {
          mydata.sender = standardizedPhone(data.sender);
          mydata.content = data.content;
          mydata.receiveTime = moment.unix(parseFloat(data.time)).format();
          console.log('newDate', mydata.receiveTime);
          mydata.authorize = md5(
            mydata.sender + mydata.receiver + mydata.content + key,
          ).toString();
          store.dispatch(
            receiveSMS({
              id: _id++,
              data: mydata,
              status: true,
              message: 'Gửi offline',
            }),
          );
        }
      }
    }
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

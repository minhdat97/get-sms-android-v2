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
import SmsAndroid from 'react-native-get-sms-android';
import DeviceInfo from 'react-native-device-info';
import sha256 from 'crypto-js/sha256';
import * as api from './src/api';

// import {receiveSMS} from './src/actions/receiveSMS';

const store = configureStore();

const MyHeadlessTask = async data => {
  console.log('DATA', data);
  console.log('Receiving Message!');
  console.log('DATA', data);

  var mydata = new Object();

  var key = '%$&#@%$';

  DeviceInfo.getPhoneNumber().then(phoneNumber => {
    mydata.receiver = phoneNumber;
    mydata.authorize = sha256(phoneNumber + key);
    // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
  });

  if (data.isReady === 'true') {
    // const {minDate, maxDate} = this.state;
    store.dispatch(getMessage(true));
    // receiveSMS.dispatch();
  }

  if (data.action === 'new_message') {
    console.log('here');

    var filter = {
      box: 'inbox',
      read: 0,
      maxCount: 30,
      // address: '+84788904744',
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        var arr = JSON.parse(smsList);
        console.log('arr', arr);

        mydata.sender = arr[0].address;
        mydata.content = arr[0].body;
        console.log('mydata', mydata);
        api
          .callApiReceiveMess(mydata)
          .then(res => console.log('res', res))
          .catch(error => console.log('error', error));
        // Alert.alert(JSON.stringify(arr));
        // console.log(arr);
        // this.setState({smsList: arr});

        // this.intervalID = setTimeout(this.listSMS.bind(this), 0);
      },
    );
  }

  // if (data.action === 'new_message') {
  //   store.dispatch(setGetMessage(true));
  // }
  // setTimeout(() => {
  //   store.dispatch(setGetMessage(false));
  // }, 1000);
};

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask('GetMessage', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, AppState} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import GetMessage from './GetMessage';
import GetMessageContainer from './src/component/getMessage/getMessage.container';
import BackgroundTimer from 'react-native-background-timer';
import * as api from './src/api';
import DeviceInfo from 'react-native-device-info';
import sha256 from 'crypto-js/sha256';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  view: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  view1: {
    // flex: 0.1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  view2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    top: 10,
    marginBottom: 30,
    // flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: 'gray',
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
  instructions: {
    textAlign: 'center',
  },
});

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

var counter = 0;
var timer = new Timer(async function() {
  const myphone = {};
  const key = '%$&#@%$';
  const phone = await phoneNumber();

  if (phone === '') {
    myphone.phone = '0359403487';
    // mydata.receiver = '0359403487';
    // mydata.authorize = sha256('0359403487' + key).toString();
    // myphone.authorize = sha256('0359403487' + key).toString();
    myphone.authorize = sha256('0359403487' + key).toString();
  } else {
    // mydata.receiver = standardizedPhone(phone);
    // mydata.receiver = '0903456728';
    // mydata.authorize = sha256('0903456728' + key).toString();
    myphone.phone = standardizedPhone(phone);
    // myphone.authorize = sha256(phoneNumber + key).toString();
    myphone.authorize = sha256(standardizedPhone(phone) + key).toString();
  }

  await api
    .callApiCheckAlive(myphone)
    .then(res => {
      console.log('counter', counter);
      if (counter === 5) {
        timer.reset(300000);
      }
      counter++;
    })
    .catch(error => {
      // console.log('error', error);
      timer.reset(60000);
      counter = 0;
    });
}, 60000);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getMessage: false,
      receiveSMS: {},
    };
    this.handleStartService = this.handleStartService.bind(this);
    this.handleStopService = this.handleStopService.bind(this);
  }

  async componentDidMount() {
    timer.start();

    AppState.addEventListener('change', this._handleAppStateChange);
    this._recoverData();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      this._storeData(this.props.receiveSMS);
    }
  };

  _recoverData = async () => {
    try {
      await AsyncStorage.getItem('data').then(value =>
        this.setState({receiveSMS: JSON.parse(value)}),
      );
    } catch (error) {
      console.log(error);
    }
  };

  _storeData = async data => {
    try {
      await AsyncStorage.setItem('data', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.getMessage !== this.props.getMessage) {
      this.setState({getMessage: nextProps.getMessage});
    }
    if (nextProps.receiveSMS !== this.props.receiveSMS) {
      console.log('here');
      this.setState({receiveSMS: nextProps.receiveSMS});
    }
  }

  handleStartService() {
    GetMessage.startService();
  }

  handleStopService() {
    GetMessage.stopService();
    BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
    this.setState({getMessage: false});
  }

  render() {
    const {receiveSMS} = this.state;
    const {getMessage} = this.state;
    const message = getMessage.data ? 'Đã bật chạy ngầm' : 'Chạy ngầm';
    return (
      <View style={styles.container}>
        <View style={styles.view2}>
          <GetMessageContainer receiveSMS={receiveSMS} />
        </View>
        <View style={styles.view}>
          <TouchableOpacity
            style={styles.button}
            // onPress={() => GetMessage.startService()}
            onPress={this.handleStartService}>
            <Text style={styles.instructions}>{message}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            // onPress={() => GetMessage.stopService()}
            onPress={this.handleStopService}>
            <Text style={styles.instructions}>Tắt chạy ngầm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = store => ({
  getMessage: store.getMessageReducer,
  receiveSMS: store.receiveSMSReducer.payload,
});

export default connect(mapStateToProps)(App);

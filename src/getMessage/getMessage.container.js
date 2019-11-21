import React, {Component} from 'react';
import {
  Platform,
  PermissionsAndroid,
  View,
  Text,
  ScrollView,
  Alert,
} from 'react-native';
import styles from './getMessage.style';
import GetMessage from './getMessage';
import SmsAndroid from 'react-native-get-sms-android';
import DeviceInfo from 'react-native-device-info';

class GetMessageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      smsList: [],
    };
  }

  intervalID;

  async componentDidMount() {
    if (Platform.OS === 'android') {
      try {
        if (!(await this.checkPermissions())) {
          await this.requestPermissions();
        }

        if (await this.checkPermissions()) {
          this.listSMS();
          // DeviceInfo.getPhoneNumber().then(phoneNumber => {
          //   if (phoneNumber === '') {
          //     phoneNumber = '0359403487';
          //   } else {
          //     phoneNumber =
          //       phoneNumber.length && phoneNumber[0] === '+'
          //         ? phoneNumber.slice(1)
          //         : phoneNumber;
          //     console.log('phonenumber', phoneNumber);
          //   }
          //   // Android: null return: no permission, empty string: unprogrammed or empty SIM1, e.g. "+15555215558": normal return value
          // });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  componentWillUnmount() {
    /*
      stop getData() from continuing to run even
      after unmounting this component
    */
    clearTimeout(this.intervalID);
  }

  async checkPermissions() {
    console.log('checking SMS permissions');
    let hasPermissions = false;
    try {
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      if (!hasPermissions) {
        return false;
      }
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      );
      if (!hasPermissions) {
        return false;
      }
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      );
      if (!hasPermissions) {
        return false;
      }
      hasPermissions = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      );
      if (!hasPermissions) {
        return false;
      }
    } catch (e) {
      console.error(e);
    }
    return hasPermissions;
  }

  async requestPermissions() {
    let granted = {};
    try {
      console.log('requesting SMS permissions');
      granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
          PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ],
        {
          title: 'Example App SMS Features',
          message: 'Example SMS App needs access to demonstrate SMS features',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use SMS features');
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  listSMS = () => {
    const {minDate, maxDate} = this.state;
    var filter = {
      box: 'inbox',
      read: 0,
      maxCount: 30,
      // address: '+84788904744',
    };
    if (minDate !== '') {
      filter.minDate = minDate;
    }
    if (maxDate !== '') {
      filter.maxDate = maxDate;
    }

    SmsAndroid.list(
      JSON.stringify(filter),
      fail => {
        console.log('Failed with this error: ' + fail);
      },
      (count, smsList) => {
        var arr = JSON.parse(smsList);
        // Alert.alert(JSON.stringify(arr));
        // console.log(arr);
        this.setState({smsList: arr});
        this.intervalID = setTimeout(this.listSMS.bind(this), 0);
      },
    );
  };

  render() {
    const {smsList} = this.state;
    const {receiveSMS} = this.props;
    return (
      <View style={styles.view1Container}>
        <View style={styles.view2Container}>
          <Text style={styles.welcome}>Tin nhắn</Text>
          {/* <Button title="refresh list" onPress={this.listSMS} /> */}
        </View>
        <ScrollView>
          {smsList !== '' ? (
            <GetMessage smsList={smsList} receiveSMS={receiveSMS} />
          ) : (
            <Text style={styles.viewText1}>Không có tin nhắn nào</Text>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default GetMessageContainer;

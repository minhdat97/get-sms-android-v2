import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './getMessage.style';

class GetMessage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {smsList} = this.props;
    return smsList.map(sms => {
      const currentDate = new Date(sms.date);
      return (
        <View style={styles.view1Style} key={sms._id}>
          <View style={styles.viewText}>
            <Text>SĐT: {sms.address}</Text>
            <Text>Nội dung: {sms.body}</Text>
            {/* <Text>Id: {sms._id}</Text> */}
            {/* <View style={styles.view2Style}>
              <Text>Date timestamp: {sms.date}</Text>
              <Button
              title="copy date"
              onPress={() => Clipboard.setString(sms.date.toString())}
            />
            </View> */}
            <Text>
              Ngày: {currentDate.getHours()}h{currentDate.getMinutes()}p -{' '}
              {currentDate.getDate()}/{currentDate.getMonth()}/
              {currentDate.getFullYear()}
            </Text>
          </View>
        </View>
      );
    });
  }
}

export default GetMessage;

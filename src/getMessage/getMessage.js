import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './getMessage.style';

class GetMessage extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {receiveSMS} = this.props;
    // const data = JSON.parse(receiveSMS.payload[0].data);
    console.log('receiveSMS', receiveSMS);
    return receiveSMS.slice(0, 30).map(sms => {
      const currentDate = new Date(sms.data.receiveTime);
      return (
        <View style={styles.view1Style} key={sms.id}>
          <View style={styles.viewText}>
            <Text>STT: {sms.id}</Text>
            <Text>SĐT: {sms.data.sender}</Text>
            <Text>Nội dung: {sms.data.content}</Text>
            {/* <Text>Id: {sms._id}</Text> */}
            {/* <View style={styles.view2Style}>
                <Text>Date timestamp: {sms.date}</Text>
                <Button
                title="copy date"
                onPress={() => Clipboard.setString(sms.date.toString())}
              />
              </View> */}
            <Text>
              Ngày: {currentDate.getUTCHours()}h{currentDate.getUTCMinutes()}p -{' '}
              {currentDate.getUTCDate()}/{currentDate.getUTCMonth() + 1}/
              {currentDate.getUTCFullYear()}
            </Text>

            {/* <Text>Ngày: {sms.data.receiveTime}</Text> */}
            {sms.status !== null ? (
              sms.status ? (
                <Text>Trạng thái: SUCCESS</Text>
              ) : (
                <Text>Trạng thái: FAILED</Text>
              )
            ) : (
              <Text>Trạng thái: N/A</Text>
            )}
          </View>
        </View>
      );
    });
  }
}

export default GetMessage;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import GetMessage from './GetMessage';
import GetMessageContainer from './src/getMessage/getMessage.container';


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

const App = ({getMessage}) => {
  console.log('getMessage', getMessage);
  const message = getMessage.data ? 'Đã bật chạy ngầm' : 'Chạy ngầm';
  return (
    <View style={styles.container}>
      <View style={styles.view2}>
        <GetMessageContainer />
      </View>
      <View style={styles.view}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => GetMessage.startService()}>
          <Text style={styles.instructions}>{message}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => GetMessage.stopService()}>
          <Text style={styles.instructions}>Tắt</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.view1}>
        <Text style={styles.text}>{message}</Text>
      </View> */}
    </View>
  );
};

const mapStateToProps = store => ({
  getMessage: store.getMessageReducer,
});

// const mapDispatchToProps = dispatch => {
//   return {
//     getMessage: () => dispatch(getMessage(false)),
//   };
// };

export default connect(mapStateToProps)(App);

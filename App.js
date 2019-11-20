/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import GetMessage from './GetMessage';
import GetMessageContainer from './src/getMessage/getMessage.container';
import BackgroundTimer from 'react-native-background-timer';

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getMessage: false,
    };
    this.handleStartService = this.handleStartService.bind(this);
    this.handleStopService = this.handleStopService.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.getMessage !== this.props.getMessage) {
      this.setState({getMessage: nextProps.getMessage});
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

// const App = ({getMessage}) => {
//   console.log('getMessage', getMessage);
//   const message = getMessage.data ? 'Đã bật chạy ngầm' : 'Chạy ngầm';
//   return (
//     <View style={styles.container}>
//       <View style={styles.view2}>
//         <GetMessageContainer />
//       </View>
//       <View style={styles.view}>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => GetMessage.startService()}>
//           <Text style={styles.instructions}>{message}</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => GetMessage.stopService()}>
//           <Text style={styles.instructions}>Tắt</Text>
//         </TouchableOpacity>
//       </View>
//       {/* <View style={styles.view1}>
//         <Text style={styles.text}>{message}</Text>
//       </View> */}
//     </View>
//   );
// };

const mapStateToProps = store => ({
  getMessage: store.getMessageReducer,
  receiveSMS: store.receiveSMSReducer,
});

// const mapDispatchToProps = dispatch => {
//   return {
//     getMessage: () => dispatch(getMessage(false)),
//   };
// };

export default connect(mapStateToProps)(App);

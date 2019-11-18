import {call, put, take, fork} from 'redux-saga/effects';
import * as api from '../api';
import * as receiveSMSRequest from '../actions/receiveSMS';
import * as getSMSRequest from '../actions/getSMS';

function* receiveSMS() {
  while (true) {
    try {
      const {payload} = yield take('RECEIVE_SMS');
      const httpResponse = yield call(api.callApiReceiveMess, payload);
      yield put({type: 'RECEIVE_SMS_SUCCESS', httpResponse});
    } catch (error) {
      yield put(receiveSMSRequest.requestErrorReceiveSMS(error));
    }
  }
}

function* getSMS() {
  while (true) {
    try {
      const {payload} = yield take('GET_SMS');
      const httpResponse = yield call(api.callApiGetMess, payload);
      yield put({type: 'GET_SMS_SUCCESS', httpResponse});
    } catch (error) {
      yield put(getSMSRequest.requestErrorGetSMS(error));
    }
  }
}

export default function* rootSagas() {
  yield fork(receiveSMS);
  yield fork(getSMS);
}

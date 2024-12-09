import {put} from 'redux-saga/effects';
import {BaseEntity} from './BaseEntity';
import action from 'src/decorators/action';
import * as actionTypes from '../store/actions';

// export default class Flagger extends BaseEntity<Flagger> {
//   constructor(opts: any) {
//     super(opts);
//   }

//   @action()
//   public *setFlagger({key, value}) {
//     yield put(actionTypes.setFlagger(key, value));
//   }

//   @action()
//   public *clearFlagger({key}) {
//     yield put(actionTypes.setFlagger(key, undefined));
//   }
// }

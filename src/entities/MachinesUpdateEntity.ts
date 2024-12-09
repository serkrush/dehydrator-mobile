import {BaseEntity} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY, Flag} from '../constants';
import action from '../../src/decorators/action';
import * as actionTypes from '../store/actions';
import {call, put} from 'redux-saga/effects';
import {Alert} from 'react-native';
import alias from 'src/decorators/alias';

@alias('MachinesUpdateEntity')
@reducer(ENTITY.MACHINE_UPDATE)
export default class MachinesUpdateEntity extends BaseEntity<MachinesUpdateEntity> {
  constructor(opts: any) {
    super(opts);
    this.initSchema(ENTITY.MACHINE_UPDATE, {}, {idAttribute: 'uid'});
    console.log('MachinesUpdateEntity init');
    this.addSocketListener();
  }

  @action()
  public *addListener({}) {
    this.addSocketListener();
  }
}

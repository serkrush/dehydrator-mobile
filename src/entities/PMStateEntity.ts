import {BaseEntity} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY, Flag} from '../constants';
import socket from 'src/decorators/socket';
import alias from 'src/decorators/alias';

@alias('PMStateEntity')
@reducer(ENTITY.PMState)
@socket()
export default class PMStateEntity extends BaseEntity<PMStateEntity> {
  constructor(opts: any) {
    super(opts);
    this.initSchema(ENTITY.PMState, {}, {idAttribute: 'machineId'});
  }
}

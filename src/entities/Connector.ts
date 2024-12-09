import BaseContext from 'src/BaseContext';
import {ENTITY, Flag} from 'src/constants';
import * as actionTypes from '../store/actions';
import alias from 'src/decorators/alias';

@alias('Connector')
export default class Connector extends BaseContext {
  constructor(opts: any) {
    super(opts);
    this.socketMiddleware = this.socketMiddleware.bind(this);
  }

  socketMiddleware(data: any) {
    console.log('CONNECTOR socketMiddleware', data);
    const {navigator, redux, socket} = this.di;
    socket.stop();
    redux.dispatch(
      actionTypes.action(actionTypes.ADD, {
        payload: {
          data: {
            entities: {
              [ENTITY.MACHINE]: {
                [data.data.id ?? 'machine']: data.data,
              },
            },
          },
        },
      }),
    );
    redux.dispatch(
      actionTypes.setBox(Flag.CurrentUpdatedMachineId, data.data.id),
    );
    navigator.navigate('EditDehydrator');
  }
}

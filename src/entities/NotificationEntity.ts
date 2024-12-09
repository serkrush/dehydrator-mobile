import {ENTITY} from 'src/constants';
import alias from 'src/decorators/alias';
import reducer from 'src/decorators/reducer';
import {BaseEntity} from './BaseEntity';

@alias('NotificationEntity')
@reducer(ENTITY.NOTIFICATION)
export default class NotificationEntity extends BaseEntity<NotificationEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.NOTIFICATION, {}, {idAttribute: 'uuid'});
    }
}

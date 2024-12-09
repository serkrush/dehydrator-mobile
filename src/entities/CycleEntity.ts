import {BaseEntity} from './BaseEntity';
import reducer from '../decorators/reducer';
import {ENTITY, Flag} from '../constants';
import socket from 'src/decorators/socket';
import * as actionTypes from '../store/actions';
import {
    CycleStatus,
    ICycleState,
    IZoneParams,
} from 'src/store/types/MachineTypes';
import alias from 'src/decorators/alias';
import action from '../../src/decorators/action';
import {call} from 'redux-saga/effects';
import {Alert} from 'react-native';

@alias('CycleEntity')
@reducer(ENTITY.Cycle)
@socket()
export default class CycleEntity extends BaseEntity<CycleEntity> {
    constructor(opts: any) {
        super(opts);
        this.initSchema(ENTITY.Cycle, {}, {});
    }

    @action()
    public *scheduleCycle({
        data,
    }: {
        data: {
            machineId: string;
            zoneNumber: number;
            params?: IZoneParams[];
            recipeId?: string;
            scheduledTime: number;
        };
    }) {
        const {t} = this.di;
        const resData = yield call(this.xSave, `/cycles/schedule`, {
            data,
        });
        //console.log("SCHEDULED CYCLE resData", resData)
    }
    @action()
    public *scheduleCycleZones({
        data,
        zones,
    }: {
        data: {
            machineId: string;
            params?: IZoneParams[];
            recipeId?: string;
            scheduledTime: number;
        };
        zones: number[];
    }) {
        if (zones?.length > 0) {
            for (let i = 0; i < zones.length; i++) {
                const zone = zones[i];
                console.log('/cycles/schedule', {data: {
                    ...data,
                    zoneNumber: zone,
                }})
                yield call(this.xSave, `/cycles/schedule`, {data:{
                    ...data,
                    zoneNumber: zone,
                }});
            }
            //console.log("SCHEDULED CYCLE resData", resData)
        }
    }

    @action()
    public *getMachineScheduledCycles({machineId}) {
        const resData = yield call(this.xSave, `/cycles/machine/${machineId}`, {
            data: {
                status: CycleStatus.Scheduled,
            },
        });
        //console.log('getMachineScheduledCycles resData', resData);
    }

    @action()
    public *updateCycle({cycleId, data}) {
        const {t} = this.di;
        //return
        try {
            console.log('updateCycle');
            console.log('updateCycle data', data);
            const resData = yield call(
                this.xSave,
                `/cycles/${cycleId}/update`,
                {
                    data,
                },
            );
            console.log('updateCycle resData', resData);
            if (resData.success) {
            } else {
                this.handleUnsuccessResponse(resData?.response);
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    @action()
    public *deleteCycle({cycleId}) {
        const resData = yield call(this.xDelete, `/cycles/${cycleId}/delete`);
        console.log('deleteCycle resData', resData);
        if (resData?.success) {
            const {navigator} = this.di;
            navigator.pop();
        }
    }
}

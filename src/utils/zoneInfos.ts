import {IContextContainer} from 'src/container';
import {
    mapICycleModelToZoneCardViewProps,
    mapICycleStateToZoneCardViewProps,
} from './mapToZoneCardViewProps';
import {
    ZoneAvailableState,
    ZoneBaseInfo,
    ZoneInfo,
} from 'src/entities/models/Machine';
import BitSet from 'bitset';
import {Flag} from 'src/constants';

const zoneInfos = (ctx: IContextContainer) => {
    return (
        machineId?: string,
        checkSocketTime: boolean = true,
    ): ZoneInfo[] => {
        if (machineId == undefined) return [];

        const store = ctx.redux.state;
        const socket = ctx.socket;
        const config = ctx.config;
        const {
            zmState,
            cycles,
            machines,
            'machine-models': models,
            box,
        } = store;

        const lastUpdateRequestTime = box[Flag.LastStatusUpdateRequestTime];
        const lastSocketUpdateTime = box[Flag.LastSocketUpdateTime];

        const machine = machines[machineId];
        //console.log("machine", machine?.guid)

        const zmStateCycles = Object.values(zmState)
            .filter(cycle => {
                return cycle.machineId == machine?.guid;
            })
            .map(value => mapICycleStateToZoneCardViewProps(value));
        //console.log('zmStateCycles', zmStateCycles);

        const dbCycles = Object.values(cycles)
            .filter(cycle => {
                return cycle.machineId == machine?.id;
            })
            .map(value => mapICycleModelToZoneCardViewProps(value));

        const machineCycles = [...zmStateCycles, ...dbCycles];
        //console.log("machineCycles", machineCycles)

        if (machine) {
            let existActive = false;
            const zones =
                machine?.zones ??
                models[machine.modelId]?.zones.map((zone, i) => {
                    const res: ZoneBaseInfo = {
                        zone: zone,
                        zoneNumber: i + 1,
                    };
                    return res;
                });

            let infos: ZoneInfo[] = [];

            zones?.forEach(zone => {
                let state = ZoneAvailableState.Offline;
                if (machineCycles != undefined && machineCycles.length > 0) {
                    const cycleItems = machineCycles.filter(cycle => {
                        return cycle.zoneNumber == zone.zoneNumber;
                    });

                    cycleItems.forEach(cycleItem => {
                        if (cycleItem?.scheduledTime != undefined) {
                            state = ZoneAvailableState.Scheduled;
                        } else if (
                            cycleItem != undefined &&
                            new BitSet(cycleItem.currentProps?.mode).get(0) > 0
                            //cycleItem.status != CycleStatus.Stopped
                        ) {
                            state = ZoneAvailableState.InProgress;
                        } else {
                            state = ZoneAvailableState.Available;
                        }
                        const timestamp =
                            cycleItem?.transferTimestamp ??
                            cycleItem?.currentProps?.timestamp;

                        if (
                            timestamp != undefined &&
                            (lastUpdateRequestTime == undefined ||
                                timestamp > lastUpdateRequestTime) &&
                            (!checkSocketTime ||
                                lastSocketUpdateTime == undefined ||
                                timestamp > lastSocketUpdateTime)
                        ) {
                            existActive = true;
                        }

                        infos.push({
                            props: cycleItem,
                            base: zone,
                            state,
                        });
                    });

                    if (cycleItems.length <= 0) {
                        infos.push({
                            props: {
                                machineId: machineId,
                                zoneNumber: zone.zoneNumber,
                                params: [],
                                amountOfStages: 0,
                            },
                            base: zone,
                            state,
                        });
                    }
                } else {
                    infos.push({
                        props: {
                            machineId: machineId,
                            zoneNumber: zone.zoneNumber,
                            params: [],
                            amountOfStages: 0,
                        },
                        base: zone,
                        state,
                    });
                }
            });

            if (!socket.active || !existActive) {
                infos = infos.map(value => {
                    return {
                        ...value,
                        state:
                            value.state == ZoneAvailableState.Scheduled
                                ? value.state
                                : ZoneAvailableState.Offline,
                    };
                });
            }
            //console.log('infos', infos.length);
            //console.log('infos', infos)
            return infos;
        } else {
            //console.log('infos', 'empty');
            return [];
        }
    };
};

export default zoneInfos;

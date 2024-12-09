import {ICycleModel} from 'src/entities/models/ICycleModel';
import {ZoneProps} from 'src/entities/models/Machine';
import {ICycleState} from 'src/store/types/MachineTypes';

const mapICycleModelToZoneCardViewProps = (model: ICycleModel): ZoneProps => {
    //console.log("model", model)
    let res: ZoneProps = {
        machineId: model.machineId,
        params: model.params,
        zoneNumber: model.zoneNumber,
        amountOfStages: model.params.length,
        scheduledTime: model.scheduledTime,
        recipeId: model.recipeId,
        scheduledId: model.id,
    };

    return res;
};

const mapICycleStateToZoneCardViewProps = (state: ICycleState): ZoneProps => {
    let res: ZoneProps = {
        machineId: state.machineId,
        params: state.params,
        zoneNumber: state.zoneNumber,
        amountOfStages: state.amountOfStages,
        recipeId: state.recipeId,
        transferTimestamp: state.transferTimestamp,
        currentProps: {
            state: state.state,
            mode: state.mode,
            duration: state.duration,
            total: state.total,
            stage: state.stage,
            timestamp: state.timestamp,
            weight: state.weight,
            power: state.power,
            instantPower: state.instantPower,
        },
    };

    return res;
};

export {mapICycleModelToZoneCardViewProps, mapICycleStateToZoneCardViewProps};

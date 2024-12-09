import {CycleStatus, IZoneParams} from 'src/store/types/MachineTypes';

export interface ICycleModel {
    id: string;
    machineId: string;
    status: CycleStatus;

    zoneNumber: number;
    params: IZoneParams[];

    recipeId?: string;

    scheduledTime?: number;

    startedAt?: number;
    completedAt?: number;

    powerUsage?: number;

    createdAt?: number;
    updatedAt?: number;
}

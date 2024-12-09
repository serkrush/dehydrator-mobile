// import { Model, DataTypes, BuildOptions } from "sequelize";
import {IZMState, IZoneParams} from 'src/store/types/MachineTypes';
import {ICategoryModel} from './ICategotyModel';
import {Zone} from './MachineModel';

export enum MachineState {
    New = 'new',
    Activated = 'activated',
    NeedRepair = 'need-repair',
    OnRepair = 'on-repair',
    Delated = 'delated',
}

export enum MachineType {
    Dehydrator = 'dehydrator',
    FreezeDryer = 'freeze-dryer',
}

export enum ZoneAvailableState {
    Available = 'available',
    InProgress = 'in-progress',
    Scheduled = 'scheduled',
    Offline = 'offline',
    Error = 'error',
}

export enum ZoneAdditionalStatus {
    None = 'none',
    Idle = 'idle',
    Paused = 'paused',
    Cooling = 'cooling',
    Cleaning = 'cleaning',
}

export interface ZoneBaseInfo {
    zone: Zone;
    zoneNumber: number;
}

export interface ZoneAvailability {
    zone: Zone;
    state: ZoneAvailableState;
}

export interface ZoneBaseInfoAvailability {
    zone: ZoneBaseInfo;
    state: ZoneAvailableState;
}

export interface ZoneProps {
    machineId: string;
    /** zone which the parameters from / number of module in GPIO network */
    zoneNumber: number;
    /** recipe id, if null the cycle was started by manual control */
    recipeId?: string;
    /** parameters for stage, index is stage; */
    params: IZoneParams[];
    /** current stage number */
    amountOfStages: number;

    scheduledTime?: number;
    scheduledId?: string;

    transferTimestamp?: number;

    currentProps?: {
        /** zone module state (current cycle parameters) */
        state: IZMState;
        mode: number;
        /** left time for current stage, duration in seconds */
        duration: number;
        /** left time for all stages, duration in seconds */
        total: number;

        /** current stage number */
        stage: number;
        /** time in milliseconds of last state update */
        timestamp: number;
        /** grams, current weight. The value calculates from raw value and based on nominal and tare weights */
        weight: number;
        /** power usage, kWh */
        power: number;
        /** instantaneous power, Wh */
        instantPower: number;
    };
}

export interface ZoneInfo {
    base: ZoneBaseInfo;
    state: ZoneAvailableState;

    props: ZoneProps;
}

export interface IMachine {
    id?: string;
    guid: string;
    modelId: string;
    proofOfPurchaseDate?: number;
    proofOfPurchaseFile?: string;
    ownerId?: string;
    machineName: string;
    machineType: MachineType;
    costPerKwh: number;
    state?: MachineState;
    zonesStatus?: ZoneAvailability[];
    zones?: ZoneBaseInfo[];

    country: string;
    language: string;
    scale: string;
    timezone: string;
    currencySymbol: string;

    fcmToken?: string;

    createdAt?: number;
    updatedAt?: number;
    deletedAt?: number;

    categories: ICategoryModel[];

    weightScaleFeature?: boolean;
    heatingIntensity?: number;
    fanSpeed?: {id: string; value: number}[];
}

export interface IMachinePostData {
    guid: string;
    modelId: string;
    machineName: string;
    costPerKwh: number;
    machineType: MachineType;

    country: string;
    language: string;
    scale: string;
    timezone: string;
}

export interface FunSpeed {
    id: string;
    value: number;
}

export interface AdvancedSettings {
    fanSpeed: FunSpeed[];
    heatingIntensity: number;
}

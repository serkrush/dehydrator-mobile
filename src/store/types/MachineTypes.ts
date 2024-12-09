export const EVENT_INTERVAL_FOR_EXCEPTION = 60000; // 1 minute interval to send event about some error.

export enum ModuleRestarts {
    PowerSupply = 1,
    ResetSignal = 2,
    RestartWDT = 4,
    PowerFailure = 8,
    SoftwareReset = 16,
    StackError = 32,
}

export enum MachineEventCode {
    // dehydration cycle codes
    /** machine zone, cycle is started */
    ZM_STR = 101,
    /** machine zone, cycle is stopped */
    ZM_STP = 102,
    /** machine zone, cycle is paused */
    ZM_PUS = 103,
    /** machine zone, cycle state is updated */
    ZM_STE = 104,

    // ERROR CODES
    /** unknown error */
    ER_UNK = 1000,
    /** machine zone, cycle is already started */
    ER_STR = 1001,
    /** machine zone, cycle is already stopped */
    ER_STP = 1002,
    /** machine core, out of index */
    ER_OIX = 1003,
    /** serial module, communication problem via UART protocol */
    ER_SND = 1004,
    /** dehydrator machine, problem with passing parameters to zone module (ZM) */
    ER_ZPR = 1005,
    /** dehydrator machine, problem with passing parameters to power module (PM) */
    ER_PPR = 1006,
    /** dehydrator machine, problem with food drying cycle */
    ER_CYL = 1007,
    /** dehydrator machine, problem with starting drying cycle */
    ER_SCL = 1008,
}

export enum MachineType {
    Dehydrator = 'dehydrator',
    FreezeDryer = 'freezeDryer',
}

export enum CycleStatus {
    Scheduled = 'scheduled',
    Started = 'started',
    Completed = 'completed',
}

export enum CycleAction {
    Start = 'start',
    Pause = 'pause',
    Stop = 'stop',

    Update = 'update',
}

export enum ttRequest {
    Identity = 4, // request identification data
    State = 5, // request current state data
    Service = 6, // request  service data
    Params = 7, // sending parameters
}

export interface IZMIdentity {
    serialNumber: number; // serial number of module
    hardwareVersion: number; // hardware version of module
    softwareVersion: number; // software version of module
    manufactureDate: number; // module manufacture date
    tmpOutZone: number; // serial number of the temperature sensor at the zone exit
    tmpInZone: number; // serial number of the temperature sensor at the zone entrance
    zoneNumber?: number;
}

export interface IPMIdentity {
    serialNumber: number; // serial number of module
    hardwareVersion: number; // hardware version of module
    softwareVersion: number; // software version of module
    manufactureDate: number; // module manufacture date
}

export interface IZMState {
    initTemperature: number; // initial temperature that was set by user, celsius value
    heatingIntensity: number; // heating intensity, percentage value (%)
    fanPerformance1: number; // performance of fan #1, percentage value (%)
    fanPerformance2: number; // performance of fan #2, percentage value (%)
    exitTemperature: number; // temperature at the exit of the zone, celsius value
    entryTemperature: number; // temperature at the entrance of the zone, celsius value
    weight: number; // current weight, grams
    door: number; // state of the door, open (0) or closed (1)
    zoneNumber?: number;
}

/**
 * the current state of a stage in dehydration cycle
 */
export interface ICycleState {
    machineId: string;
    /** zone module state (current cycle parameters) */
    state: IZMState;
    /** parameters for stage, index is stage; */
    params: IZoneParams[];
    /**
     * each bit of this variable show the current mode of zone
     * The bit index defined in ZMode enum.
     * bit 0 - food drying cycle is active 1/0
     * bit 1 - food drying cycle is paused 1/0
     * bit 2 - cooling cycle is active 1/0
     * bit 3 - sanitization cycle is active 1/0
     */
    mode: number;
    /** left time for current stage, duration in seconds */
    duration: number;
    /** left time for all stages, duration in seconds */
    total: number;
    /** zone which the parameters from / number of module in GPIO network */
    zoneNumber: number;
    /** current stage number */
    stage: number;
    /** current stage number */
    amountOfStages: number;
    /** time in milliseconds of last state update */
    timestamp: number;
    /** grams, current weight. The value calculates from raw value and based on nominal and tare weights */
    weight: number;
    /** power usage, kWh */
    power: number;
    /** instantaneous power, Wh */
    instantPower: number;
    /** recipe id, if null the cycle was started by manual control */
    recipeId?: string;

    transferTimestamp?: number; // time in milliseconds of last state data update
}

export interface ICycleState {}

export interface IPMState {
    machineId: string;
    netVoltage: number; // current relative value of network voltage
    rppmAmperage: number; // current amperage consumption by RP and PM
    rppmEnergy: number; // current energy consumption by RP and PM
    zonesAmperage: number[]; // current amperage consumption by zones
    zonesEnergy: number[]; // current energy consumption by zones
}

export interface IZMService {
    countReceiveErrors: number; // message receiving error counter
    countTimeouts: number; // message timeout counter
    countExitTempErrors: number; // temperature receiving error counter at the exit of zone
    countExitTimeoutErrors: number; // timeout counter at the exit of zone
    countEntryTempErrors: number; // temperature receiving error counter at the entrance of zone
    countEntryTimeoutErrors: number; // timeout counter at the exit of zone
    countWeightErrors: number; // weighter error counter
    countWeightTimeoutErrors: number; // timeout counter for weighter
    restartReason: number; // restart reason code: bits (0 - Reset signal, 1 - Power failure, 2 - No reception from RP, 3 - Restart via WDT)
    zoneNumber?: number;
}

export interface IPMService {
    countReceiveErrors: number; // message receiving error counter
    countTimeouts: number; // message timeout counter
    restartReason: number; // restart reason code: bits (0 - Reset signal, 1 - Power failure, 2 - No reception from RP, 3 - Restart via WDT)
}

export interface IZoneParams {
    // set of parameters for zone module
    initTemperature: number; // initial temperature that was set by user, celsius value
    heatingIntensity: number; // heating intensity, percentage value (%)
    fanPerformance1: number; // performance of fan #1, percentage value (%)
    fanPerformance2: number; // performance of fan #2, percentage value (%)

    // set of parameters for business logic
    duration: number; // cycle duration in minutes,
    weight: number; // a weight that should be achieved for dehydration cycle
}

export interface IPMParams {
    voltageRatio: number; // network voltage conversion ratio
    amperageRatio: number[]; // current consumption conversion ratio for Zone Modules
    rppmRatio: number; // current consumption conversion ratio for RP and PM modules
}

export type TPMState = {
    [key: string]: IPMState;
};

export type TZMState = {
    [key: string]: ICycleState;
};

export interface IProcessCycle {
    machineId: string;

    userId?: string;

    zoneNumber: number;
    params: IZoneParams[];

    recipeId?: string;

    isScheduled?: boolean;
    scheduledDate?: number;

    mode: number;

    createdAt?: number;
    startedAt?: number;
}

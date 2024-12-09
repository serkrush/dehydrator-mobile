export enum Zone {
    Top = 'top',
    Middle = 'middle',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export enum MachineType {
    Dehydrator = 'dehydrator',
    FreezeDryer = 'freeze-dryer',
}

export interface ScaledValue {
    m: string;
    i: string;
}

export interface IMachineModel {
    meta?: {
        [key: string]: string;
    };
    model: string;
    zones: Zone[];
    brand: string;
    machineType: MachineType;
    maxPowerUsage: number; //kW
    avgPowerUsage: number; //kW
    voltageFrequency: {
        minVoltage: number; //V
        maxVoltage: number;
        minFrequncy: number; //Hz
        maxFrequncy: number;
    };
    maxAmperage: number; //A
    safetyBreakerRequired: string;
    powerCable: string;
    temperatureMode: string;
    temperatureRange: {
        min: number; //C
        max: number;
    };
    timer: {
        min: number;
        max: number; //h
    };
    independentZones: number;
    totalTrayArea: number; // m²
    totalTrays: number;
    trayDimensions: {
        h: number; //m
        w: number;
    };
    spaceBetweenTrays: number; //m
    trayMeshSpacing: {
        h: number; //m
        w: number;
    };
    machineWeight: number; //kg
    productDimensions: {
        w: number; //m
        h: number;
        d: number;
    };
    features: string[];
    mediaResources: string;
}

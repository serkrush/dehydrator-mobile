import {ROLE} from 'acl/types';
import {AuthType} from 'src/constants';
import {IMachineAccess} from './models/MachineAccess';
import {IMachine} from './models/Machine';
import {IMachineGroup} from './models/MachineGroup';
import {IMachineModel} from './models/MachineModel';
import {ICycleModel} from './models/ICycleModel';
import {IMachineNetwork} from './models/IMachineNetwork';
import { MachineMessage, NotificationMessage } from 'src/pusher/types';

export interface IUserEntity {
    uid: string;
    parentsId?: string[];
    fcmTokens?: string[];
    firstName: string;
    lastName: string;
    email: string;
    role?: ROLE;
    country?: string;
    timezone?: string;
    language?: string;
    scale?: string;
    currencySymbol?: string;
    createdAt?: number;
    updatedAt?: number;
    isInvitation?: boolean;
    authType?: AuthType;

    access?: string[];
    machines?: string[];
    groups?: string[];
}
export enum MachineType {
    Dehydrator = 'dehydrator',
    FreezeDryer = 'freeze-dryer',
}
export enum IngredientActionType {
    Ingredient = 'ingredient',
    Method = 'method',
}
export interface IIngredientEntity {
    action: IngredientActionType;
    description: string;
    index?: number;
    media_resource?: string;
}
export interface IStageEntity {
    fanPerformance1?: number;
    fanPerformance1Label?: string;
    fanPerformance2?: number;
    fanPerformance2Label?: string;
    duration?: number | null;
    initTemperature: number;
    weight?: number | null;
    heatingIntensity: number;
}

export interface IFormStageEntity extends IStageEntity {
    hours: number;
    minutes: number;
    viewInitTemperature: number;
}
export interface ISelectOptions {
    label: string;
    value: string;
}
export interface PresetParams {
    adjustment: number;
    marinated: number;
    thickness: number;
}
export enum RecipeStageType {
    Time = 'time',
    Weight = 'weight',
}
export interface IRecipeEntity {
    id: string | null;
    description?: string;
    machine_type: MachineType;
    recipe_name: string;
    recipe_ingredients: IIngredientEntity[];
    recipe_process: string;
    stages: IStageEntity[];
    categories: string[] | ISelectOptions[];
    base_thickness?: number;
    media_resources?: string[];
    media_resources_buffer?: string[];

    type?: string;

    temperature?: PresetParams;
    time?: PresetParams;
    machine_id: string;
    type_session: RecipeStageType;
    user_id: string | null;
    search_terms?: string[];
    favoriteByUsers?: string[] | IRecipeFavoritesEntity[]
    favoriteByMachines?: string[] | IRecipeFavoritesEntity[]
}

export interface IFormRecipeEntity extends IRecipeEntity {
    stages: IFormStageEntity[];
}
export enum RecipeProcessType {
    Recipe = 'recipe',
    Preset = 'preset',
}
export interface ICategoryEntity {
    id: string | null;
    user_id?: string | null;
    category_name: string;
    recipe_process: RecipeProcessType;
    categories?: ICategoryEntity[];
    parent_id?: string;
    machine_id?: string | null;
    media_resource?: string | null;
    media_resource_url?: string | null;

    type?: string;
    uid?: string;
}

export interface IRecipeFavoritesEntity {
    id?: string;
    user_id: string;
    recipe_id: string;
    machine_id: string;
    favorite_type: FavoriteType;
}

export interface IMachineUpdate {
    uid: string;
    payload: any;
}

export type TUserEntities = {
    [key: string]: IUserEntity;
};

export type TMachineAccessEntities = {
    [key: string]: IMachineAccess;
};

export type TMachineEntities = {
    [key: string]: IMachine;
};

export type TMachineModelEntities = {
    [key: string]: IMachineModel;
};

export type TMachineUpdateEntities = {
    [key: string]: IMachineUpdate;
};

export type TMachineGroupEntities = {
    [key: string]: IMachineGroup;
};

export type TCycleEntities = {
    [key: string]: ICycleModel;
};

export type TMachineNetwork = {
    [key: string]: IMachineNetwork;
};

export type TNotifications = {
    [key: string]: NotificationMessage;
};

export type TRecipeEntities = {
    [key: string]: IRecipeEntity;
};

export type TCategoryEntities = {
    [key: string]: ICategoryEntity;
};

export type TRecipeFavoritesEntities = {
    [key: string]: IRecipeFavoritesEntity;
};

export enum FavoriteType {
    Bookmarked = 'bookmarked',
    Starred = 'starred',
}

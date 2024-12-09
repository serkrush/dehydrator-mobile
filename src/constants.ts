import {ReactNode} from 'react';
import config from '../config';
import {
    TCategoryEntities,
    TCycleEntities,
    TMachineAccessEntities,
    TMachineEntities,
    TMachineGroupEntities,
    TMachineModelEntities,
    TMachineNetwork,
    TMachineUpdateEntities,
    TNotifications,
    TRecipeEntities,
    TRecipeFavoritesEntities,
    TUserEntities,
} from './entities/EntityTypes';
import {IMachine, MachineState, MachineType} from './entities/models/Machine';
import {Zone} from './entities/models/MachineModel';
import {TPMState, TZMState} from './store/types/MachineTypes';
import {AuthState, RequestStatusState} from './store/types/stateTypes';
import {ViewStyle} from 'react-native';
import {percentage} from './utils/dropdownOptions';
import {IHashState} from './store/reducers/hashReducer';
import {CRUD} from './store/actions';

export enum SocketAction {
    DeviceToClients = 'deviceToClients',
    DeviceToClient = 'deviceToClient',
    ClientToDevice = 'clientToDevice',

    SetConnectionType = 'setConnectionType',
    SetLiveDate = 'setLiveDate',
}

export const DEFAULT_CONTAINER_PER_PAGE = 18;
export const DEFAULT_CONTAINER_COLUMNS = 3;

export enum ConnectionType {
    Unsetted = 'unsetted',
    Device = 'device',
    Client = 'client',
    Server = 'server',
}

export enum AuthType {
    Google = 'google',
    Facebook = 'facebook',
    Default = 'email/password',
}

export enum ENTITY {
    USER = 'users',
    IDENTITY = 'identity',
    MACHINE_MODEL = 'machine-models',
    MACHINE = 'machines',
    GROUP = 'groups',
    ACCESS = 'access',
    MACHINE_UPDATE = SocketAction.DeviceToClients,
    PMState = 'pmState',
    ZMState = 'zmState',
    Cycle = 'cycles',
    MachineNetwork = 'machine-network',
    RECIPES = 'recipes',
    CATEGORIES = 'categories',
    RECIPE_FAVORITES = 'recipeFavorites',
    NOTIFICATION = 'notifications',
}

export enum Flag {
    LanguageCode = 'language-code',

    UserDeleteProcess = 'user-delete-process',
    GroupDeleteProcess = 'group-delete-process',
    MachineDeleteProcess = 'machine-delete-process',

    ACTION_START = 'action-start',
    ACTION_SUCCESS = 'action-success',
    ACTION_FAILURE = 'action-failure',

    CurrentUpdatedUserId = 'current-updated-user-id',
    CurrentUpdatedMachineId = 'current-updated-machine-id',
    CurrentUpdatedGroupId = 'current-updated-group-id',

    CurrentZone = 'current-zone',
    CurrentScheduleId = 'current-scheduled-id',

    GroupsReceived = 'groups-received',
    DehydratorsReceived = 'dehydrators-received',
    GroupDehydratorsReceived = 'group-dehydrators-received',

    UserInfosReceived = 'user-infos-received',

    ConfirmPairRequested = 'confirm-pair-requested',
    ConfirmResetRequested = 'confirm-pair-requested',
    ProofUploading = 'proof-uploading',
    GetProofs = 'get-proofs',
    ProofFilename = 'proof-filename',

    CountPendingStatusUpdate = 'count-pending-status-update',
    StatusUpdateReceived = 'status-update-received',

    LastStatusUpdateTime = 'last-status-update-time',
    LastStatusUpdateRequestTime = 'last-status-update-request-time',
    LastSocketUpdateTime = 'last-socket-update-time',
    StatusUpdateCompleted = 'status-update-completed',

    AppSettings = 'appSettings',
    IsFirstStart = 'isFirstStart',

    DeleteErrorOwnMachine = 'delete-error-own-machine',

    NET_CONNECTED = 'net-connected',

    LastResubscribeDevicesIds = 'LastResubscribeDevicesIds',
}

export enum RequestStatus {
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

export enum SettingsOption {
    UserAndPermission = 'user&perm',
    //LanguageAndRegion = 'lang&reg',
    Dehydrators = 'settings-dehyrators',
    Advanced = 'settings-advanced',

    MyProfile = 'settings-my-profile',
    UserPermissions = 'settings-user-permissions',
    MyMachines = 'settings-my-machines',
    Notifications = 'settings-notifications',
    LanguageAndRegion = 'settings-language-and-region',
    SoftwareUpdates = 'settings-software-updates',
    DiagnosticData = 'settings-diagnostic-data',
}

export enum PermissionLevel {
    SuperAdmin = 'super-admin',
    Admin = 'admin',
    User = 'user',
    Viewer = 'viewer',
}

export enum MachinePairRequestResult {
    Requested = 'requested',
    Existed = 'existed',
    NotOwner = 'not-owner',
}

export enum MachineResetRequestResult {
    Requested = 'requested',
    NotExist = 'not-exist',
    NotOwner = 'not-owner',
}

export enum Scale {
    Metric = 'metric',
    Imperial = 'imperial',
}

export const MAX_STAGES_COUNT = 5;

export const STATUS_UPDATE_TIME = 30 * 1000;

export const DEFAULT_ZONE_PARAMS = {
    initTemperature: 37,
    heatingIntensity: 70,
    fanPerformance1: 100,
    fanPerformance2: 100,
    duration: 3,
    weight: 0,
};

export const percentageOptions = percentage(10, 100, 10);
export const fanPercentage = percentage(60, 100, 5);

export const DEFAULT_HEATING_INTENSITY = 80;
export const DEFAULT_FAN_OPTIONS: {id: string; value: any}[] = config?.machine
    ?.cycle?.fanSpeed ?? [
    {
        id: 'normal',
        value: 100,
    },
    {
        id: 'reduced',
        value: 85,
    },
    {
        id: 'light',
        value: 70,
    },
];

export const scaledValueMap = {
    temperature: {
        [Scale.Metric]: 'C',
        [Scale.Imperial]: 'F',
    },
    weight: {
        [Scale.Metric]: 'kg',
        [Scale.Imperial]: 'lb',
    },
    distance: {
        [Scale.Metric]: 'm',
        [Scale.Imperial]: 'ft',
    },
};

export const DELETE_CONFIRM_STRING = 'delete';
export const CONFIRM_STRING = 'confirm';

export const DEFAULT_LANGUAGE_CODE = 'enUS';
// export const DEFAULT_COUNTRY = 'AU';
export const DEFAULT_TIMEZONE = 'America/Los_Angeles';
export const DEFAULT_CURRENCY_SYMBOL = '$';
export const DEFAULT_SCALE = 'metric';

export const languages: string[] = ['enUS', 'uk'];
export const countriesCodes: string[] = ['US', 'AU', 'CA', 'UK', 'NZ'];
export const scales: string[] = [Scale.Metric, Scale.Imperial];
export const currencies: {label: string; value: string}[] = [
    {label: 'USD $', value: '$'},
    {label: 'EUR €', value: '€'},
    {label: 'GBP £', value: '£'},
    {label: 'JPY ¥', value: 'J¥'},
    {label: 'CNY ¥', value: 'C¥'},
    {label: 'INR ₹', value: '₹'},
    {label: 'AUD $', value: 'A$'},
    {label: 'CAD $', value: 'C$'},
    {label: 'CHF CHF', value: 'CHF'},
    {label: 'KRW ₩', value: '₩'},
    {label: 'BRL R$', value: 'R$'},
    {label: 'ZAR R', value: 'R'},
];

export const regions: string[] = [
    'Africa',
    'America',
    'Antarctica',
    'Asia',
    'Atlantic',
    'Australia',
    'Europe',
    'Indian',
    'Pacific',
];

export const timezones: string[] = [
    'Africa/Abidjan',
    'Africa/Accra',
    'Africa/Algiers',
    'Africa/Bissau',
    'Africa/Cairo',
    'Africa/Casablanca',
    'Africa/Ceuta',
    'Africa/El_Aaiun',
    'Africa/Johannesburg',
    'Africa/Khartoum',
    'Africa/Lagos',
    'Africa/Maputo',
    'Africa/Monrovia',
    'Africa/Nairobi',
    'Africa/Ndjamena',
    'Africa/Tripoli',
    'Africa/Tunis',
    'Africa/Windhoek',
    'America/Anchorage',
    'America/Araguaina',
    'America/Argentina/Buenos_Aires',
    'America/Asuncion',
    'America/Bahia',
    'America/Barbados',
    'America/Belem',
    'America/Belize',
    'America/Boa_Vista',
    'America/Bogota',
    'America/Campo_Grande',
    'America/Cancun',
    'America/Caracas',
    'America/Cayenne',
    'America/Cayman',
    'America/Chicago',
    'America/Costa_Rica',
    'America/Cuiaba',
    'America/Curacao',
    'America/Danmarkshavn',
    'America/Dawson_Creek',
    'America/Denver',
    'America/Edmonton',
    'America/El_Salvador',
    'America/Fortaleza',
    'America/Godthab',
    'America/Grand_Turk',
    'America/Guatemala',
    'America/Guayaquil',
    'America/Guyana',
    'America/Halifax',
    'America/Havana',
    'America/Hermosillo',
    'America/Iqaluit',
    'America/Jamaica',
    'America/La_Paz',
    'America/Lima',
    'America/Los_Angeles',
    'America/Maceio',
    'America/Managua',
    'America/Manaus',
    'America/Martinique',
    'America/Mazatlan',
    'America/Mexico_City',
    'America/Miquelon',
    'America/Montevideo',
    'America/Nassau',
    'America/New_York',
    'America/Noronha',
    'America/Panama',
    'America/Paramaribo',
    'America/Phoenix',
    'America/Port-au-Prince',
    'America/Port_of_Spain',
    'America/Porto_Velho',
    'America/Puerto_Rico',
    'America/Recife',
    'America/Regina',
    'America/Rio_Branco',
    'America/Santiago',
    'America/Santo_Domingo',
    'America/Sao_Paulo',
    'America/Scoresbysund',
    'America/St_Johns',
    'America/Tegucigalpa',
    'America/Thule',
    'America/Tijuana',
    'America/Toronto',
    'America/Vancouver',
    'America/Whitehorse',
    'America/Winnipeg',
    'America/Yellowknife',
    'Antarctica/Casey',
    'Antarctica/Davis',
    'Antarctica/DumontDUrville',
    'Antarctica/Mawson',
    'Antarctica/Palmer',
    'Antarctica/Rothera',
    'Antarctica/Syowa',
    'Antarctica/Vostok',
    'Asia/Almaty',
    'Asia/Amman',
    'Asia/Aqtau',
    'Asia/Aqtobe',
    'Asia/Ashgabat',
    'Asia/Baghdad',
    'Asia/Baku',
    'Asia/Bangkok',
    'Asia/Beirut',
    'Asia/Bishkek',
    'Asia/Brunei',
    'Asia/Calcutta',
    'Asia/Choibalsan',
    'Asia/Colombo',
    'Asia/Damascus',
    'Asia/Dhaka',
    'Asia/Dili',
    'Asia/Dubai',
    'Asia/Dushanbe',
    'Asia/Gaza',
    'Asia/Ho_Chi_Minh',
    'Asia/Hong_Kong',
    'Asia/Hovd',
    'Asia/Irkutsk',
    'Asia/Jakarta',
    'Asia/Jayapura',
    'Asia/Jerusalem',
    'Asia/Kabul',
    'Asia/Kamchatka',
    'Asia/Karachi',
    'Asia/Katmandu',
    'Asia/Krasnoyarsk',
    'Asia/Kuala_Lumpur',
    'Asia/Macau',
    'Asia/Magadan',
    'Asia/Makassar',
    'Asia/Manila',
    'Asia/Nicosia',
    'Asia/Omsk',
    'Asia/Pyongyang',
    'Asia/Qatar',
    'Asia/Rangoon',
    'Asia/Riyadh',
    'Asia/Saigon',
    'Asia/Seoul',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Taipei',
    'Asia/Tashkent',
    'Asia/Tbilisi',
    'Asia/Tehran',
    'Asia/Thimphu',
    'Asia/Tokyo',
    'Asia/Ulaanbaatar',
    'Asia/Vladivostok',
    'Asia/Yakutsk',
    'Asia/Yekaterinburg',
    'Asia/Yerevan',
    'Asia/Yuzhno-Sakhalinsk',
    'Atlantic/Azores',
    'Atlantic/Bermuda',
    'Atlantic/Canary',
    'Atlantic/Cape_Verde',
    'Atlantic/Faroe',
    'Atlantic/Reykjavik',
    'Atlantic/South_Georgia',
    'Atlantic/Stanley',
    'Australia/Adelaide',
    'Australia/Brisbane',
    'Australia/Darwin',
    'Australia/Hobart',
    'Australia/Perth',
    'Australia/Sydney',
    'Etc/GMT',
    'Europe/Amsterdam',
    'Europe/Andorra',
    'Europe/Athens',
    'Europe/Belgrade',
    'Europe/Berlin',
    'Europe/Brussels',
    'Europe/Bucharest',
    'Europe/Budapest',
    'Europe/Chisinau',
    'Europe/Copenhagen',
    'Europe/Dublin',
    'Europe/Gibraltar',
    'Europe/Helsinki',
    'Europe/Istanbul',
    'Europe/Kaliningrad',
    'Europe/Kyiv',
    'Europe/Lisbon',
    'Europe/London',
    'Europe/Luxembourg',
    'Europe/Madrid',
    'Europe/Malta',
    'Europe/Minsk',
    'Europe/Monaco',
    'Europe/Moscow',
    'Europe/Oslo',
    'Europe/Paris',
    'Europe/Prague',
    'Europe/Riga',
    'Europe/Rome',
    'Europe/Samara',
    'Europe/Sofia',
    'Europe/Stockholm',
    'Europe/Tallinn',
    'Europe/Tirane',
    'Europe/Vienna',
    'Europe/Vilnius',
    'Europe/Warsaw',
    'Europe/Zurich',
    'Indian/Chagos',
    'Indian/Christmas',
    'Indian/Cocos',
    'Indian/Kerguelen',
    'Indian/Mahe',
    'Indian/Maldives',
    'Indian/Mauritius',
    'Indian/Reunion',
    'Pacific/Apia',
    'Pacific/Auckland',
    'Pacific/Chuuk',
    'Pacific/Easter',
    'Pacific/Efate',
    'Pacific/Enderbury',
    'Pacific/Fakaofo',
    'Pacific/Fiji',
    'Pacific/Funafuti',
    'Pacific/Galapagos',
    'Pacific/Gambier',
    'Pacific/Guadalcanal',
    'Pacific/Guam',
    'Pacific/Honolulu',
    'Pacific/Kiritimati',
    'Pacific/Kosrae',
    'Pacific/Kwajalein',
    'Pacific/Majuro',
    'Pacific/Marquesas',
    'Pacific/Nauru',
    'Pacific/Niue',
    'Pacific/Norfolk',
    'Pacific/Noumea',
    'Pacific/Pago_Pago',
    'Pacific/Palau',
    'Pacific/Pitcairn',
    'Pacific/Pohnpei',
    'Pacific/Port_Moresby',
    'Pacific/Rarotonga',
    'Pacific/Tahiti',
    'Pacific/Tarawa',
    'Pacific/Tongatapu',
    'Pacific/Wake',
    'Pacific/Wallis',
];

export const devMachine: IMachine = {
    id: config?.mock?.machineUID ?? 'machine',
    guid: config?.mock?.machineUID ?? 'machine',
    modelId: '28cud',
    machineName: 'machine',
    machineType: MachineType.Dehydrator,
    ownerId: 'irrxS71zgyZxnHS7RILfqA1WpHA3',
    costPerKwh: 0,
    state: MachineState.Activated,
    zonesStatus: [],
    country: '',
    language: '',
    scale: '',
    timezone: '',
    currencySymbol: DEFAULT_CURRENCY_SYMBOL,
    createdAt: 0,
    updatedAt: 0,
    categories: [],
};

export const superAdminLevels: string[] = [
    PermissionLevel.SuperAdmin,
    PermissionLevel.Admin,
    PermissionLevel.User,
    PermissionLevel.Viewer,
];
export const adminLevels: string[] = [
    PermissionLevel.User,
    PermissionLevel.Viewer,
];

export const permissions: string[] = [
    PermissionLevel.SuperAdmin,
    PermissionLevel.Admin,
    PermissionLevel.User,
    PermissionLevel.Viewer,
];

export const settingsOptions: string[] = [
    SettingsOption.MyProfile,
    SettingsOption.UserPermissions,
    SettingsOption.MyMachines,
    SettingsOption.Notifications,
    SettingsOption.LanguageAndRegion,
    SettingsOption.SoftwareUpdates,
    SettingsOption.Advanced,
];

export const zones = [
    Zone.Top,
    Zone.Middle,
    Zone.Bottom,
    Zone.Left,
    Zone.Right,
];

export enum StageStatus {
    Unsetted = 'unsetted',
    Ended = 'ended',
    Current = 'current',
    Waited = 'waited',
}

export enum SessionRunnedBy {
    Time = 'time',
    Weight = 'weight',
}

export const runnedByOptions = [SessionRunnedBy.Time, SessionRunnedBy.Weight];

export interface AppState {
    box: any;
    auth: AuthState;
    requestStatus: RequestStatusState;
    pagination: TPaginationInfo;
    hashes: IHashState;
    [ENTITY.USER]: TUserEntities;
    [ENTITY.ACCESS]: TMachineAccessEntities;
    [ENTITY.MACHINE]: TMachineEntities;
    [ENTITY.GROUP]: TMachineGroupEntities;
    [ENTITY.MACHINE_UPDATE]: TMachineUpdateEntities;
    [ENTITY.MACHINE_MODEL]: TMachineModelEntities;
    [ENTITY.ZMState]: TZMState;
    [ENTITY.PMState]: TPMState;
    [ENTITY.Cycle]: TCycleEntities;
    [ENTITY.MachineNetwork]: TMachineNetwork;
    [ENTITY.RECIPES]: TRecipeEntities;
    [ENTITY.CATEGORIES]: TCategoryEntities;
    [ENTITY.RECIPE_FAVORITES]: TRecipeFavoritesEntities;
    [ENTITY.NOTIFICATION]: TNotifications;
}

export type StoreAction = {
    type: string;
    payload: any;
    entityReducer?: string;
};

export type DispatchType = (args: StoreAction) => StoreAction;

export type Identity = {
    userId?: number;
    isGuest: boolean;
    firstName?: string;
    lastName?: string;
    role?: string;
};

export interface IUserPostData {
    firstName: string;
    lastName: string;
    userEmail: string;
    password: string;
    role: string;
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc',
}

export interface IPaginationPage {
    ids: [string];
    lastDocumentId?: string;
    prevLastDocumentId?: string;
}
export interface IPaginationInfo {
    entityName: string;
    pageName: string;
    currentPage: number;
    count: number;
    perPage: number;
    filter?: {
        [key: string]: any;
    };
    sort?: {
        field: string;
        dir: SortDirection;
    };
    pages: {
        [key: number]: IPaginationPage;
    };
    pagesNew: string[];
}
export type TPaginationInfo = {
    [key: string]: IPaginationInfo;
};
interface ISortParams {
    field: string;
    sort: number;
}
export enum Actions {
    View = 1,
    Edit = 2,
    Delete = 3,
    Request = 4,
    Add = 5,
    Move = 6,
    Check = 7,
    Image = 8,
    EditSmall = 10,
}
export interface IPagerParams {
    pageName?: string; // paginator name
    // sort?: object;      // object with sorting key/values
    sort?: ISortParams;
    filter?: any; //object;    // object with filtering key/values
    page?: number; // page number
    perPage: number; // count items on one page
    force?: boolean; // reload data in the redux and pager
    count?: number; // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
    entityName?: string;

    lastDocumentId?: string;
}

export enum FilterType {
    Text = 'Text',
    Select = 'Select',
    Multiselect = 'Multiselect',
    Touche = 'Touche',
    Radio = 'Radio',
    VerticalRadio = 'VerticalRadio',
    GroupButton = 'GroupButton',
    VerticalGroupButton = 'VerticalGroupButton',
    EllipseButton = 'EllipseButton',
    CheckBox = 'CheckBox',
    Switch = 'Switch',
    VerticalCheckBox = 'VerticalCheckBox',
    FilterReset = 'FilterReset',
    Number = 'Number',
    Button = 'Button',
}
export enum Sort {
    ASC = 1,
    DESC = -1,
    none = 0,
}
export interface IOptions {
    label: string;
    value: string | number;
}
export interface IMultiselectOptions {
    label: string;
    options: IOptions[];
}
export interface IField {
    label?: string;
    labelIcon?: ReactNode;
    placeholder?: string;
    type?: FilterType;
    initialValue?: any;
    sorted?: boolean;
    rowClassName?: string;
    column?: {
        itemClassName?: string;
        headClassName?: string;
        inputClassName?: string;
        editable?: boolean;
        draw?: (object: any, field?: string) => JSX.Element;
        disabled?: (object: any, field?: string) => void;
        options?: Array<IOptions>;
    };
    filter?: {
        group: string;
        /** container styles */
        className?: string;
        /** container styles */
        // inputClassName?: string;
        styleFilterContainer?: ViewStyle;
        styleFilterItem?: ViewStyle;
        activeClassName?: string;
        labelClassName?: string;
        showLabel?: boolean;
        icon?: InputIcon;
        iconSvg?: ReactNode;
        iconSvgChecked?: ReactNode;
        options?: Array<IOptions | IMultiselectOptions>;
        customFilterEvent?: () => void | undefined;
    };
}
export enum InputIcon {
    USER = 'user',
    PASSPORT = 'passport',
    EDIT = 'edit',
    EMAIL = 'email',
    SPINNER = 'spinner',
    SEARCH = 'search',
    PASSWORD = 'password',
    ERROR = 'error',
}
export interface IFieldList {
    [field: string]: IField;
}

export interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
}

export enum PaginationType {
    SHORT = 'SHORT',
    LIGHT = 'LIGHT',
    MEDIUM = 'MEDIUM',
}

export const thicknesses = [
    {
        label: '1mm',
        value: 1,
    },
    {
        label: '2mm',
        value: 2,
    },
    {
        label: '3mm',
        value: 3,
    },
    {
        label: '4mm',
        value: 4,
    },
    {
        label: '5mm',
        value: 5,
    },
    {
        label: '6mm',
        value: 6,
    },
    {
        label: '7mm',
        value: 7,
    },
    {
        label: '8mm',
        value: 8,
    },
    {
        label: '9mm',
        value: 9,
    },
    {
        label: '10mm',
        value: 10,
    },
    {
        label: '15mm',
        value: 15,
    },
    {
        label: '20mm',
        value: 20,
    },
    {
        label: '25mm',
        value: 25,
    },
    {
        label: '30mm',
        value: 30,
    },
];
export const thicknessesValues = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30,
];

export enum ServerErrorCode {
    NoUserForId = 'no-user-for-id', //"not found user for uid"
    NoRecipeForId = 'no-recipe-for-id', //"not found recipe for uid"
    NotAccessedAction = 'not-accessed-action', //"not accessed action"
    TokenNotVerify = 'token-not-verified', //"token not verified"
    NotInvitationForId = 'no-invitation-for-id', //"not found invitation for id"
    NoAccessForId = 'no-access-for-id', // "not found machines access for id"
    NotProvidedUser = 'not-provided-user', // "not provided user"
    NotProvidedRecource = 'not-provided-recource', // "not provided recource"
    NotFoundUserForEmail = 'not-found-user-for-email', //"not found user for email"
    NotFoundMachineGroup = 'not-found-machine-group', //"not found machines group for id"
    NotFoundModel = 'not-found-model', //"not found machine model for id"
    NotFoundMachine = 'not-found-machine', //"not found machines group for id"
    NotFoundCategory = 'not-found-category', //"not found category for id"
    NoRecipeFavoriteId = 'not-found-recipe-favorite', //"not found recipe favorite for id"
    UserAlreadyExist = 'user-already-exist', //"user with same email already exist
    UserAlreadyHaveInvite = 'user-already-have-invite', //"user already have invite
    Unauthorized = 'unathorized', //unauthorized
    NoTokenProvided = 'no-token-provided', //"No token provided"
    NotFoundCycle = 'not-found-cycle', //"not found machine cycle for id"

    IdentityUpdatingError = 'identity-updating-error', //"Identity update failed"

    LoginFailed = 'login-failed', //"Login failed"
    RegisterFailed = 'register-failed', // "User register fail"
    InviteSentFailed = 'invite-sent-failed', //"Can not send invite"
    InviteAcceptFailed = 'invite-accept-failed', //invite accept failed
    InviteReceiveFailed = 'invite-receive-failed', //"can not receive invite"

    MachinesReceiveFailed = 'machines-receive-failed', //"Can not receive machine"
    MachineAddFailed = 'machine-add-failed', //"Can not add machine"
    MachineUpdateFailed = 'machine-update-failed', //"Can not update machine"
    MachineFetchFailed = 'machine-info-fetched-failed', //"Can not fetch machine info"
    MachineDeleteFailed = 'machine-delete-failed', //"Can not delete machine"
    MachinePairFailed = 'machine-pair-failed', //"Can not pair machine"
    MachinePairConfirmFailed = 'machine-pair-confirm-failed', //"Can not pair machine"
    FCMTokenUpdateFailed = 'fcm-token-update-failed', //"Can not update FCM token"

    MachineGroupsReceiveFailed = 'machine-groups-receive-failed', //"Can not receive machine groups"
    MachineGroupAddFailed = 'machine-group-add-failed', //"Can not add machine group"
    MachineGroupCreateFailed = 'machine-group-create-failed', //"Can not create machine group"
    MachineGroupUpdateFailed = 'machine-group-update-failed', //"Can not update machine group"
    MachineGroupFetchFailed = 'machine-group-info-fetched-failed', //"Can not fetch machine group info"
    MachineGroupDeleteFailed = 'machine-group-delete-failed', //"Can not delete machine group"
    MachineGroupMachinesReceiveFailed = 'machine-group-machines-receive-failed', //"Can not receive machine group machines"

    MachineAccessReceiveFailed = 'machine-access-receive-failed', //"Can not receive machine access"
    MachineAccessAddFailed = 'machine-access-add-failed', //"Can not add machine access"
    MachineAccessUpdateFailed = 'machine-access-update-failed', //"Can not update machine access"
    MachineAccessFetchFailed = 'machine-access-info-fetched-failed', //"Can not fetch machine access info"
    MachineAccessDeleteFailed = 'machine-access-delete-failed', //"Can not delete machine access"

    MachinesTrackFailed = 'machines-track-failed', //"machines track failed"
    MachinesUntrackFailed = 'machines-untrack-failed', //"machines untrack failed"

    CycleScheduleFailed = 'cycle-schedule-failed', //"cycle schedule failed"
    CycleReceiveFailed = 'cycle-receive-failed', //"cycle receive failed"
    CycleUpdateFailed = 'cycle-update-failed', // "cycle update failed"
    CycleDeleteFailed = 'cycle-delete-failed', // "cycle delete failed"

    RequestSendingFailed = 'request-sending-failed', // "request sending failed"

    UserDeleteFailedOwnMachine = 'user-delete-failed-own-machine', //"Unable to delete user. Transfer access to the machines to another user before deleting"
}

export enum ServerMessageCode {
    InvitationDeleted = 'invitation-deleted', // Invitation for ${id} deleted success
    InvitationAccepted = 'invitation-accepted', // Invitation for ${id} deleted success
    MachineAccessDeleted = 'machine-access-deleted', // Machine Access for ${id} deleted success
    MachineAccessForUserDeleted = 'machine-access-for-user-deleted', // Machine Access for user deleted success
    MachineGroupDeleted = 'machine-group-deleted', // Machine Group for ${id} deleted success
    MachineModelDeleted = 'machine-model-deleted', // Machine Model for ${id} deleted success
    MachineDeleted = 'machine-deleted', // Machine for ${id} deleted success
    UserDeleted = 'user-deleted', // User for ${id} deleted success
    CycleDeleted = 'cycle-deleted', // Cycle for ${id} deleted success

    IdentityUpdated = 'identity-updated', // Identity updated successfully
    UserLogin = 'user-login', //"User logined success",
    UserRegister = 'user-register', //" User register success"
    InviteSent = 'invite-sent', //invite sent success
    InviteAccepted = 'invite-accept', //invite accepted success
    InviteReceived = 'invite-received', //invite received succes

    MachinesReceived = 'machines-received', //"machines receive success"
    MachineUpdated = 'machine-updated', //"machine updated success"
    MachineInfoFetched = 'machine-info-fetched', //"machine info fetched success"
    MachineAdded = 'machine-added', //"machine added success"
    MachinePaired = 'machine-paired', //"machine paired success"
    MachinePairConfirmed = 'machine-pair-confirmed', //"machine paired success"
    FCMTokenUpdated = 'fcm-token-updated', //"FCM Token updated success"

    MachineGroupsReceived = 'machine-groups-received', //"machine group receive success"
    MachineGroupUpdated = 'machine-group-updated', //"machine group updated success"
    MachineGroupInfoFetched = 'machine-group-info-fetched', //"machine group info fetched success"
    MachineGroupAdded = 'machine-group-added', //"machine group added success"
    MachineGroupCreated = 'machine-group-created', //"machine group created success"
    MachineGroupMachinesReceived = 'machine-groups-machines-received', //"machine group receive success"

    MachineAccessReceived = 'machine-access-received', //"machine access receive success"
    MachineAccessUpdated = 'machine-access-updated', //"machine access updated success"
    MachineAccessInfoFetched = 'machine-access-info-fetched', //"machine access info fetched success"
    MachineAccessAdded = 'machine-access-added', //"machine access added success"

    MachinesTracked = 'machines-tracked', //"machines tracked success"
    MachinesUntracked = 'machines-untracked', //"machines untracked success"

    CycleScheduled = 'cycle-scheduled', //"cycle scheduled success"
    CycleReceived = 'cycle-received', //"cycle received success"
    CycleUpdated = 'cycle-updated', //"cycle deleted success"

    RequestSent = 'request-sent', // "request sent"
}

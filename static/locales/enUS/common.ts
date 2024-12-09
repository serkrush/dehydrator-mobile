import {
    CONFIRM_STRING,
    DELETE_CONFIRM_STRING,
    PermissionLevel,
    SessionRunnedBy,
    SettingsOption,
} from 'src/constants';
import {ZoneAvailableState} from 'src/entities/models/Machine';
import {Zone} from 'src/entities/models/MachineModel';

export default {
    translation: {
        'app-title': 'BENCHFOODS',

        //Language
        language_enUS: 'English - US',
        language_uk: 'Ukrainian',

        //
        country_US: 'United States',
        country_AU: 'Australia',
        country_CA: 'Canada',
        country_UK: 'United Kingdom',
        country_NZ: 'New Zealand',

        //
        scale_metric: 'Metric (°C / KG)',
        scale_imperial: 'Imperial (°F / LB)',

        //
        'not-all-selected': 'Not all options are selected',

        //
        [`permissions_${PermissionLevel.SuperAdmin}`]: 'Super Admin',
        [`permissions_${PermissionLevel.Admin}`]: 'Admin',
        [`permissions_${PermissionLevel.User}`]: 'User',
        [`permissions_${PermissionLevel.Viewer}`]: 'Viewer',

        //Tabs
        'tab-home': 'Home',
        'tab-data-and-charts': 'Data & Charts',
        'tab-notifications': 'Notifications',
        'tab-settings': 'Settings',
        'tab-machines': 'Machines',
        'tab-main': 'Main',

        //

        [SettingsOption.UserAndPermission]: 'User & Permission',
        //[SettingsOption.LanguageAndRegion]: 'Language & Region',
        [SettingsOption.Dehydrators]: 'Your dehydrators',
        //[SettingsOption.Advanced]: 'Advanced Settings',

        [SettingsOption.MyProfile]: 'My Profile',
        [SettingsOption.UserPermissions]: 'User Permissions',
        [SettingsOption.MyMachines]: 'My Machines',
        [SettingsOption.Notifications]: 'Notifications',
        [SettingsOption.LanguageAndRegion]: 'Language & region',
        [SettingsOption.SoftwareUpdates]: 'Software updates',
        [SettingsOption.DiagnosticData]: 'Diagnostic Data',
        [SettingsOption.Advanced]: 'Advanced Settings',

        //
        'my-profile-title': 'User Details',
        'my-profile-description': 'Edit your personal details here.',

        'user-permissions-list-title': 'Current Users',
        'user-permissions-list-description': 'List of all existing users',

        'update-permissions-title': 'User Details',
        'update-permissions-description': 'Edit this user’s permissions',

        'share-permission-title': 'Share Permissions',
        'share-permission-description': 'Enter email of other users',

        'user-transferring-list-title': 'Transferring rights to another user',
        'user-transferring-list-description':
            'Be careful! After the transfer of rights, you will lose access to all your users, dehydrators and groups. These actions are irreversible!',

        //

        'no-notifications': 'You havenʼt received any notifications yet',

        //

        'upload-proof': 'Upload Proof',
        'machine-updated': 'Machine data updated',
        file: 'File',
        //

        'current-dehydrators-title': 'Current Dehydrators',
        'current-dehydrators-description': 'Add and edit current dehydrators',

        'current-freeze-title': 'Current Freeze Dryers',
        'current-freeze-description': 'Add and edit current freeze dryers',

        'current-groups-title': 'Current Groups',
        'current-groups-description': 'Add and edit current groups',
        //

        'current-language': 'CURRENT LANGUAGE',
        'current-country': 'CURRENT COUNTRY',
        'current-scale': 'METRIC / IMPERIAL',

        'select-language': 'Select App Language',
        'select-country': 'Select Country',
        'select-region': 'Select Region',
        'select-region-and-timezone': 'Select Region and Timezone',
        'select-timezone': 'Select Timezone',
        'select-scale': 'Select Scale',
        'select-measurement-scale': 'Select Measurement Scale',
        'select-currency': 'Select currency',

        'welcome-desc': 'TAKE YOUR DEHYDRATING\nTO THE NEXT LEVEL',
        'sign-in-desc': 'Log in',
        'register-desc': 'REGISTER AN ACCOUNT',

        'placeholder-email': 'Email',
        'placeholder-name': 'Name',
        'placeholder-full-name': 'Full Name',
        'placeholder-first-name': 'First Name',
        'placeholder-last-name': 'Last Name',
        'placeholder-password': 'Password',
        'placeholder-confirm-password': 'Confirm Password',
        'name-of-user': 'Name of User',

        permissions: 'Permissions',
        'update-permissions': 'Add User Permission',
        'current-permissions': 'Current Permissions',
        'share-permissions': 'Share Permissions',
        'select-permissions': 'Select Permissions',

        'permission-shared-success': 'Permission shared success',
        'share-group-permissions': 'Share Group Permissions',
        'level-of-permissions': 'Level of Permissions',
        'send-invite': 'Send Invite',
        'send-ivite-success': 'Invite sent success',

        'accessible-dehydrators': 'Accessible Dehydrators',

        'accessible-groups-title': 'Accessible Group Dehydrators',
        'accessible-groups-description': 'Add and edit groups',

        'accessible-dehydrators-title': 'Accessible Dehydrators',
        'accessible-dehydrators-description':
            'Add and edit individual machines',

        'add-group': 'Add group',
        'add-a-dehydrator': 'Add a Dehydrator',
        'add-dehydrator': 'Add Dehydrator',
        'edit-dehydrator': 'Edit Dehydrator',
        'edit-machine': 'Edit Machine',

        'select-user': 'Select User',
        'transferring-rights-title': 'Transferring rights',
        'transfer-rights-all-resources-message': `Are you sure you want to transfer rights on all accessible resources? To confirm, please type "${CONFIRM_STRING}" in the field below and hit confirm.`,
        'success-transferring-rights': 'Rights was successfully transferred',

        machines: 'Machines',
        groups: 'Groups',

        'group-title': 'Add/Edit a Group',
        'group-view-title': 'View a Group',
        'group-add-title': 'Add a New Group',
        'group-edit-title': 'Edit Group',

        dehydrators: 'Dehydrators',
        'select-resource': 'Select Resource',
        pair: 'Pair',
        'add-dehydrator-lan':
            'Make sure your phone is connected to the same Wifi network as the dehydrator you are wanting to pair with.',
        'scan-lan': 'Scan for available dehydrators',
        'dehydrator-not-show': 'Dehydrator not showing up?',
        'dehydrator-not-show-message':
            'Go to the Wi-Fi settings screen on your dehydrator and check your network connection.\n\nGo to the Pairing section and scan the QR code to connect the dehydrator to the app.',
        'pair-qr': 'Pair by QR code',
        'scan-qr': 'Scan QR code',

        'not-showing-up-span': 'not showing up?',

        'group-list-title': 'Groups of machine',
        'no-groups-desc':
            "You don't have any groups yet.\nStart by adding a group",
        'adding-a-group': 'adding a group',

        'group-screen-title': 'Group Details',
        'group-screen-description': 'Edit your groups details',

        'group-list-screen-title': 'List of Groups',
        'group-list-screen-description': 'Add and edit your groups',

        'machine-list-title': 'Add Machine',
        'machine-list-screen-title': 'List of Machines',
        'machine-list-screen-description': 'Add and edit your machines',

        'get-started': 'Get Started',

        'sign-in': 'Sign In',
        login: 'login',
        register: 'Register',
        'create-acc': 'Create Account',
        logout: 'Log Out',
        'add-user': 'Add User',
        'add-user-title': 'Add a User',

        'login-with': 'login with',
        google: 'Google',
        facebook: 'Facebook',
        account: 'account',

        or: 'or',
        'forgot-password': 'Forgot password',
        'onboarding-next': 'next',

        success: 'Success',
        fail: 'Fail',
        'reset-password-alert':
            'A password reset email has been sent. Please check your mail',
        'social-using-for-login': 'You used to register',
        'email-not-exist': 'User with this email was not found',
        'send-email': 'Send Email',
        'change-password': 'Change Password',
        'current-password': 'Current Password',
        'new-password': 'New Password',
        'confirm-new-password': 'Confirm New Password',
        'logout-all-devices': 'Log out of all devices',
        'group-name': 'Group Name',
        'group-name-placeholder': 'Group Name',
        'group-location': 'Location',
        'group-location-placeholder': 'Location',

        'success-add-user': 'User added successfully',
        'success-edit-user': 'User data edited successfully',
        'success-delete-user': 'User deleted successfully',

        'success-delete-machine': 'Machine deleted successfully',

        'success-delete-recipe-favorites':
            'The recipe was removed from favorites',
        cancel: 'Cancel',
        save: 'Save',
        'delete-acc': 'DELETE ACCOUNT',
        'delete-deh': 'DELETE DEHYDRATOR',
        'delete-group': 'DELETE GROUP',

        'dont-have-acc': "Don't have an account?",
        'have-acc': 'Already have an account?',

        //
        time_m: 'm',
        time_h: 'h',
        weight_g: 'g',

        //
        normal: 'Normal',
        reduced: 'Reduced',
        light: 'Light',

        //
        stage_set_initTemperature: 'Set Temperature',
        stage_set_weight_loss: 'Percentage Weight Loss',
        stage_set_duration: 'Stage Time',
        stage_set_heatingIntensity: 'Heating Intensity',
        stage_set_fanPerformance: 'Fan Speed',
        stage_set_fanPerformance1: 'Fan Performance 1',
        stage_set_fanPerformance2: 'Fan Performance 2',

        //
        add: 'Add',
        start: 'Start',
        delete: 'Delete',
        stages: 'Stages',
        'select-zone': 'Select Zone',
        schedule: 'Schedule',

        //
        'delete-schedule-title': 'Delete Schedule',
        'delete-schedule-description':
            'Are you sure you want to delete this scheduled cycle?',

        'delete-user-title': 'Delete User',
        'delete-user-description':
            'Are you sure you want to delete this account? To confirm please type name of user in the field below and hit delete',

        //
        [`zones_${Zone.Top}`]: 'Top',
        [`zones_${Zone.Bottom}`]: 'Bottom',
        [`zones_${Zone.Middle}`]: 'Middle',
        [`zones_${Zone.Left}`]: 'Left',
        [`zones_${Zone.Right}`]: 'Right',

        //
        [ZoneAvailableState.Available]: 'available',
        [ZoneAvailableState.Error]: 'error',
        [ZoneAvailableState.Offline]: 'offline',
        [ZoneAvailableState.InProgress]: 'in progress',
        [ZoneAvailableState.Scheduled]: 'scheduled',

        //
        'select-dehydrator': 'Select Dehydrator',
        'manual-control': 'Manual Control',
        'dehydration-cycle': 'Dehydration Cycle',

        //
        'cycles-list': 'Cycles List',

        //
        'current-stage': 'Current stage',
        pause: 'Pause',
        'cancel-cycle': 'Cancel cycle',
        stage_set_weight: 'Set weight',

        //
        'user-updated-success': 'User data updated success',
        'password-updated-success': 'Password updated success',
        'user-permissions-removed-success':
            'User`s permissions was successfully removed',

        //
        'group-added-success': 'Group added success',
        'group-updated-success': 'Group updated success',
        'group-deleted-success': 'Group deleted success',

        'machine-paired-success': 'Machine paired success',

        //
        update: 'Update',
        'is-active': 'Is active',
        'is-paused': 'Is Paused',
        'is-cooling': 'Is Cooling',
        'is-sanitization': 'Is Sanitization',
        resume: 'Resume',
        stop: 'Stop',
        upload: 'Upload',
        'upload-proof-title': 'Upload proof of pure',
        costPer: 'Cost per kW/h',

        //
        'select-machine': 'Select Machine',
        'no-dehydrator': 'no dehydrator',
        'no-dehydrator-desc':
            'You do not have any machines added. Press the Add a machine button to open the screen for pairing.',
        'add-a-machine': 'Add a machine',

        //
        'manage-details': 'manage details',
        'view-all': 'view all',

        'no-user-desc': "You don't have any users yet.\nStart by adding a user",
        'adding-a-user': 'adding a user',

        //
        'add-machine-to-group': 'Add Machine to Group',

        //
        'add-no-machine-desc':
            "You don't have any machines yet. Start by adding a machine for you to pair",
        'adding-a-machine': 'adding a machine',

        //
        tray_count: 'tray',
        'tray-area': 'tray area',
        'tray-sq': 'sq.',
        zone_count_one: 'zone',
        zone_count_many: 'zones',
        dehydrator: 'Dehydrator',
        zone: 'zone',
        idle: 'idle',
        paused: 'paused',
        cooling: 'cooling',
        cleaning: 'cleaning',

        temperature: 'Temperature',
        'fan-speed': 'Fan speed',

        'total-time': 'Total time',
        weight: 'Weight',
        time: 'Time',
        heating: 'Heating Intensity',
        power: 'Power',

        'by-recipe': 'By recipe/preset',
        'run-session-by': 'Run session by',
        'time-remaining': 'Time remaining',

        [`session_run_by_${SessionRunnedBy.Time}`]: 'Time',
        [`session_run_by_${SessionRunnedBy.Weight}`]: 'Weight',

        'socket-connecting': 'Connecting...',
        'socket-press-available': 'Press for reconnect',

        confirm: 'Confirm',

        year: 'Year',
        month: 'Month',
        day: 'Day',
        hours: 'Hours',
        minutes: 'Minutes',

        'time-d': 'd',
        'time-h': 'h',
        'time-m': 'm',
        'time-s': 's',
        ago: 'ago',
        now: 'now',

        'tare-weight': 'Tare weight',
        'set-parameters': 'Set Parameters',

        //
        'select-recipe': 'select recipe',
        presets: 'presets',
        preset: 'preset',
        'bf cookbook': 'bf cookbook',
        'my recipes': 'my recipes',
        'my categories': 'my categories',
        'my recipe': 'my recipe',
        'data & charts': 'data & charts',

        //
        'tap to visit': 'tap to visit',

        forum: 'forum',
        'forum-description': 'forum description',

        liveChat: 'live chat',
        'liveChat-description': 'live chat description',

        website: 'website',
        'website-description': 'website description',
        required: 'Required',

        guid: 'GUID',
        scan: 'Scan',

        //Errors

        'delete-user-wrong-name': 'Invalid user name entered',
        'request-timeout': 'Request timed out. Please try again later',
        'can-not-delete-already-setuped-stages':
            'Can not delete already setuped stages',

        'auth/email-already-exists':
            'Already exists an account with the given email address',

        'default-error-title': 'Error',
        'auth/invalid-email-title': 'Invalid email',
        'auth/user-disabled-title': 'User disabled',
        'auth/user-not-found-title': 'User not found',
        'auth/wrong-password-title': 'Wrong password',
        'auth/email-already-in-use-title': 'Email already in use',
        'auth/operation-not-allowed-title': 'Not allowed operation',
        'auth/weak-password-title': 'Weak password',
        'auth/invalid-credential-title': 'Invalid credential',
        'auth/network-request-failed-title': 'Request failed',

        'schedule-past-time':
            'You cannot schedule a cycle for a time that has already passed. Please select a date in the future',

        'password-not-valide-alert-title': 'Ooops',
        'password-dont-match-alert-message': "Passwords don't match.",
        'password-invalid-length-alert-message':
            'The password must be 8 characters or more',
        'password-invalid-cases-alert-message':
            'The password must contain both cases',
        'password-invalid-digit-alert-message':
            'The password must contain numbers',

        'empty-fields': 'Some of fields are empty',
        'default-error-message': 'Something went wrong. Please try again',
        'Network request failed': 'Network request failed',
        'not-connected': 'No network connection. Please check your connection',
        'auth/invalid-email-message': 'The email address is not valid',
        'auth/user-disabled-message':
            'User corresponding to the given credential has been disabled',
        'auth/user-not-found-message':
            'Is no user corresponding to the given email',
        'auth/wrong-password-message':
            ' Password is invalid for the given email, or if the account corresponding to the email does not have a password set',
        'auth/email-already-in-use-message':
            'Already exists an account with the given email address',
        'auth/operation-not-allowed-message': 'Operation not allowed. ',
        'auth/weak-password-message': ' Password is not strong enough',
        'auth/invalid-credential-message':
            'The supplied auth credential is incorrect, malformed or has expired',
        'auth/network-request-failed-message':
            'Something went wrong. Please try again',

        'invalid-values': 'Invalid values. Please check fields',
        'invalid-parameters': 'invalid parameters provided',
        'invalid-delete-string': 'Invalid delete string',
        'invalid-confirmation-string': 'Invalid confirmation string',

        'type-here': 'Type here',

        'machine-pair-request-success': 'Connection request sent',
        'pair-timeout': 'Failed to pair. Please try to scan and pair again',
        'wrong-pair-data': 'The received data is invalid. Try again',
        'invalid-email': 'Invalid email address',

        'delete-dehydrator-title': 'Delete dehydrator',

        'delete-dehydrator-message': `Are you sure you want to delete your dehydrator? To confirm please type "${DELETE_CONFIRM_STRING}" in the field below and hit confirm`,

        'delete-user-permissions-title': 'Delete User Permissions',

        'delete-user-permissions-message': `Are you sure you want to delete these user permissions? To confirm, please type "${DELETE_CONFIRM_STRING}" in the field below and hit confirm.`,

        'page-next': 'next',
        'page-previous': 'previous',
        'page-of': 'of',
        bookmarked: 'Bookmarked',
        'no-entries-yet': 'No Entries Yet',
        categories: 'Categories',
        'create-new-recipe': 'Create new recipe',
        'create-new-category': 'Create new category',
        'methods-list': 'Methods List',
        'ingredients-list': 'Ingredients List',
        'you-havent-added-ingredients':
            'You havenʼt added any ingredients to this list',
        'you-havent-added-methods':
            'You havenʼt added any methods to this list',
        description: 'Description',
        create: 'Create',
        'recipe-name': 'Name of Recipe',
        'category-name': 'Name of Category',
        'delete-dehydrator-group-title': 'Delete group',
        'delete-dehydrator-group-message':
            'Are you sure you want to delete your group? To confirm please type "delete" in the field below and hit delete',

        'delete-confirmation-string': 'delete',
        confirmation: 'confirmation',
        'delete-user-error-title': 'Delete User Error',
        'delete-user-error-own-description':
            'Sorry, there needs to be other owner attached to the machine. Please share permissions before deleting.',
        close: 'Close',
        method: 'Method',
        ingredients: 'Ingredients',
        'edit-recipe': 'Edit Recipe',
        edit: 'Edit',
        'favourite-presets': 'Favourite Presets',
        thickness: 'Thickness',
        'present-adjustment': 'Present Adjustment',
        marinated: 'Marinated',
        'edit-category': 'Edit Category',
        'favourite-recipes': 'Favourite Recipes',
        'no-recipes': 'You havenʼt added any recipes.',
        'no-categories': 'You havenʼt added any categories.',
        'open-camera': 'Open Camera',
        'choose-from-gallery': 'Choose from Gallery',
        'delete-category': 'Delete category?',
        'delete-recipe': 'Delete recipe?',
        yes: 'Yes',
        'stage-time': 'Stage Time',
        'dehydrator-not-selected': 'Dehydrator not selected.',
        'unsaved-changes':
            'You have unsaved changes. Are you sure you want to exit and lose all unsaved data?',
        'exit-without-saving': 'Exit without saving',
        'success-delete-recipe': 'Successfully delete the recipe.',
        'success-delete-category': 'Successfully delete the category.',
        'success-save-category': 'Successfully save the category.',
        'success-save-recipe': 'Successfully save the recipe.',
        'success-save-recipe-favorites': 'Success in saving favorite recipes.',
        'error-category-has-recipe':
            'Category cannot be deleted. Delete recipes.',
        'no-cookbooks': 'There are no cookbooks.',
        'no-presets': 'There are no presets.',
        'heating-intensity': 'Heating Intensity',
        'not-owner': 'You are not the owner of this machine',
        'reset-to-factory': 'Reset to factory',
        'change-owner': 'Change owner',
        'Something went wrong while taking camera permission':
            'Something went wrong while taking camera permission',
        'This feature is not supported on this device':
            'This feature is not supported on this device',
        'Permission Denied': 'Permission Denied',
        'Please give permission from settings to continue using camera.':
            'Please give permission from settings to continue using camera.',
        'Go To Settings': 'Go To Settings',

        'guid do not match': 'guid do not match',
        'machine-not-exist': 'Requested machine do not exist',

        'not-accessed-screen': 'Screen not accessed',
        'start-for': 'Start for...',
        zones: 'Zones',
        'not-have-scale':
            'The selected dehydrator model does not have a scale.',
        category: 'Category',
        'sub-category': 'Sub-Category',
        'send-recipe': 'Send Recipe'
    },
};

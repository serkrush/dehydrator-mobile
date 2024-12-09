import {ServerErrorCode} from 'src/constants';

export default {
    translation: {
        [ServerErrorCode.NoUserForId]: 'not found user for uid',
        [ServerErrorCode.NoRecipeForId]: 'not found recipe for uid',
        [ServerErrorCode.NotAccessedAction]: 'Not accessed action',
        [ServerErrorCode.TokenNotVerify]: 'token not verified',
        [ServerErrorCode.NotInvitationForId]: 'not found invitation for id',
        [ServerErrorCode.NoAccessForId]: 'not found machines access for id',
        [ServerErrorCode.NotProvidedUser]: 'not provided user',
        [ServerErrorCode.NotProvidedRecource]: 'not provided recource',
        [ServerErrorCode.NotFoundUserForEmail]: 'not found user for email',
        [ServerErrorCode.NotFoundMachineGroup]:
            'not found machines group for id',
        [ServerErrorCode.NotFoundModel]: 'not found machine model for id',
        [ServerErrorCode.NotFoundMachine]: 'not found machines group for id',
        [ServerErrorCode.NotFoundCategory]: 'not found category for id',
        [ServerErrorCode.NoRecipeFavoriteId]:
            'not found recipe favorite for id',
        [ServerErrorCode.UserAlreadyExist]:
            'user with same email already exist',
        [ServerErrorCode.UserAlreadyHaveInvite]: 'user already have invite',
        [ServerErrorCode.Unauthorized]: 'unauthorized',
        [ServerErrorCode.NoTokenProvided]: 'No token provided',
        [ServerErrorCode.NotFoundCycle]: 'not found machine cycle for id',

        [ServerErrorCode.IdentityUpdatingError]: 'Identity update failed',

        [ServerErrorCode.LoginFailed]: 'Login failed',
        [ServerErrorCode.RegisterFailed]: 'User register fail',
        [ServerErrorCode.InviteSentFailed]: 'Can not send invite',
        [ServerErrorCode.InviteAcceptFailed]: 'invite accept failed',
        [ServerErrorCode.InviteReceiveFailed]: 'can not receive invite',

        [ServerErrorCode.MachinesReceiveFailed]: 'Can not receive machine',
        [ServerErrorCode.MachineAddFailed]: 'Can not add machine',
        [ServerErrorCode.MachineUpdateFailed]: 'Can not update machine',
        [ServerErrorCode.MachineFetchFailed]: 'Can not fetch machine info',
        [ServerErrorCode.MachineDeleteFailed]: 'Can not delete machine',
        [ServerErrorCode.MachinePairFailed]: 'Can not pair machine',
        [ServerErrorCode.MachinePairConfirmFailed]: 'Can not pair machine',
        [ServerErrorCode.FCMTokenUpdateFailed]: 'Can not update FCM token',

        [ServerErrorCode.MachineGroupsReceiveFailed]:
            'Can not receive machine groups',
        [ServerErrorCode.MachineGroupAddFailed]: 'Can not add machine group',
        [ServerErrorCode.MachineGroupCreateFailed]:
            'Can not create machine group',
        [ServerErrorCode.MachineGroupUpdateFailed]:
            'Can not update machine group',
        [ServerErrorCode.MachineGroupFetchFailed]:
            'Can not fetch machine group info',
        [ServerErrorCode.MachineGroupDeleteFailed]:
            'Can not delete machine group',
        [ServerErrorCode.MachineGroupMachinesReceiveFailed]:
            'Can not receive machine group machines',

        [ServerErrorCode.MachineAccessReceiveFailed]:
            'Can not receive machine access',
        [ServerErrorCode.MachineAccessAddFailed]: 'Can not add machine access',
        [ServerErrorCode.MachineAccessUpdateFailed]:
            'Can not update machine access',
        [ServerErrorCode.MachineAccessFetchFailed]:
            'Can not fetch machine access info',
        [ServerErrorCode.MachineAccessDeleteFailed]:
            'Can not delete machine access',

        [ServerErrorCode.MachinesTrackFailed]: 'machines track failed',
        [ServerErrorCode.MachinesUntrackFailed]: 'machines untrack failed',

        [ServerErrorCode.CycleScheduleFailed]: 'cycle schedule failed',
        [ServerErrorCode.CycleReceiveFailed]: 'cycle receive failed',
        [ServerErrorCode.CycleUpdateFailed]: 'cycle update failed',
        [ServerErrorCode.CycleDeleteFailed]: 'cycle delete failed',

        [ServerErrorCode.RequestSendingFailed]: 'request sending failed',
        [ServerErrorCode.UserDeleteFailedOwnMachine]:
            'Unable to delete user. Transfer access to the machines to another user before deleting',
    },
};

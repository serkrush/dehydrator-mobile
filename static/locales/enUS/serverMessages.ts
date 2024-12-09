import {ServerMessageCode} from 'src/constants';

export default {
    translation: {
        [ServerMessageCode.InvitationDeleted]: 'Invitation deleted success',
        [ServerMessageCode.InvitationAccepted]: 'Invitation accepted success',
        [ServerMessageCode.MachineAccessDeleted]:
            'Machine access deleted success',
        [ServerMessageCode.MachineAccessForUserDeleted]:
            'Machine Access for user deleted success',
        [ServerMessageCode.MachineGroupDeleted]:
            'Machine Group deleted success',
        [ServerMessageCode.MachineModelDeleted]:
            'Machine Model deleted success',
        [ServerMessageCode.MachineDeleted]: 'Machine deleted success',
        [ServerMessageCode.UserDeleted]: 'User deleted success',
        [ServerMessageCode.CycleDeleted]: 'Cycle deleted success',

        [ServerMessageCode.IdentityUpdated]: 'Identity updated successfully',
        [ServerMessageCode.UserLogin]: 'User logined success',
        [ServerMessageCode.UserRegister]: 'User register success',
        [ServerMessageCode.InviteSent]: 'Invite sent success',
        [ServerMessageCode.InviteAccepted]: 'Invite accepted success',
        [ServerMessageCode.InviteReceived]: 'Invite received succes',

        [ServerMessageCode.MachinesReceived]: 'machines receive success',
        [ServerMessageCode.MachineUpdated]: 'machine updated success',
        [ServerMessageCode.MachineInfoFetched]: 'machine info fetched success',
        [ServerMessageCode.MachineAdded]: 'machine added success',
        [ServerMessageCode.MachinePaired]: 'machine paired success',
        [ServerMessageCode.MachinePairConfirmed]: 'machine paired success',
        [ServerMessageCode.FCMTokenUpdated]: 'FCM Token updated success',

        [ServerMessageCode.MachineGroupsReceived]:
            'machine group receive success',
        [ServerMessageCode.MachineGroupUpdated]:
            'machine group updated success',
        [ServerMessageCode.MachineGroupInfoFetched]:
            'machine group info fetched success',
        [ServerMessageCode.MachineGroupAdded]: 'machine group added success',
        [ServerMessageCode.MachineGroupCreated]:
            'machine group created success',
        [ServerMessageCode.MachineGroupMachinesReceived]:
            'machine group receive success',

        [ServerMessageCode.MachineAccessReceived]:
            'machine access receive success',
        [ServerMessageCode.MachineAccessUpdated]:
            'machine access updated success',
        [ServerMessageCode.MachineAccessInfoFetched]:
            'machine access info fetched success',
        [ServerMessageCode.MachineAccessAdded]: 'machine access added success',

        [ServerMessageCode.MachinesTracked]: 'machines tracked success',
        [ServerMessageCode.MachinesUntracked]: 'machines untracked success',

        [ServerMessageCode.CycleScheduled]: 'cycle scheduled success',
        [ServerMessageCode.CycleReceived]: 'cycle received success',
        [ServerMessageCode.CycleUpdated]: 'cycle deleted success',

        [ServerMessageCode.RequestSent]: 'request sent',
    },
};

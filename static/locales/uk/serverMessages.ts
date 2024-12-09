import {ServerMessageCode} from 'src/constants';

export default {
    translation: {
        [ServerMessageCode.InvitationDeleted]: 'Запрошення успішно видалено',
        [ServerMessageCode.InvitationAccepted]: 'Запрошення успішно прийнято',
        [ServerMessageCode.MachineAccessDeleted]:
            'Доступ до машини видалено успішно',
        [ServerMessageCode.MachineAccessForUserDeleted]:
            'Доступи до машин для користувача успішно видалено',
        [ServerMessageCode.MachineGroupDeleted]: 'Групу машин успішно видалено',
        [ServerMessageCode.MachineModelDeleted]:
            'Модель машини успішно видалено',
        [ServerMessageCode.MachineDeleted]: 'Машину успішно видалено',
        [ServerMessageCode.UserDeleted]: 'Користувача успішно видалено',
        [ServerMessageCode.CycleDeleted]: 'Цикл видалено успішно',

        [ServerMessageCode.IdentityUpdated]: 'Інформацію успішно оновлено',
        [ServerMessageCode.UserLogin]: 'Користувач успішно ввійшов',
        [ServerMessageCode.UserRegister]: 'Успішна реєстрація користувача',
        [ServerMessageCode.InviteSent]: 'Запрошення надіслано успішно',
        [ServerMessageCode.InviteAccepted]: 'Запрошення прийнято успішно',
        [ServerMessageCode.InviteReceived]: 'Запрошення отримано успішно',

        [ServerMessageCode.MachinesReceived]:
            'Інформація про машини успішно отримана',
        [ServerMessageCode.MachineUpdated]: 'машина оновлена ​​успішно',
        [ServerMessageCode.MachineInfoFetched]:
            'інформацію про машину отримано успішно',
        [ServerMessageCode.MachineAdded]: 'машина додана успішно',
        [ServerMessageCode.MachinePaired]: "машина з'єдналася успішно",
        [ServerMessageCode.MachinePairConfirmed]: "машина з'єднана успішно",
        [ServerMessageCode.FCMTokenUpdated]: 'Успішне оновлення FCM токена',

        [ServerMessageCode.MachineGroupsReceived]:
            'група машин отримана успішно',
        [ServerMessageCode.MachineGroupUpdated]:
            'група машин оновлена ​​успішно',
        [ServerMessageCode.MachineGroupInfoFetched]:
            'інформація про групу машин успішно отримана',
        [ServerMessageCode.MachineGroupAdded]: 'група машин успішно додана',
        [ServerMessageCode.MachineGroupCreated]: 'група машин успішно створена',
        [ServerMessageCode.MachineGroupMachinesReceived]:
            'група машин отримана успішно',

        [ServerMessageCode.MachineAccessReceived]:
            'доступ до машини отримано успішно',
        [ServerMessageCode.MachineAccessUpdated]:
            'доступ до машини оновлено успішно',
        [ServerMessageCode.MachineAccessInfoFetched]:
            'інформація про доступ до машини успішно отримана',
        [ServerMessageCode.MachineAccessAdded]:
            'доступ до машини додано успішно',

        [ServerMessageCode.MachinesTracked]: 'машини відстежуються успішно',
        [ServerMessageCode.MachinesUntracked]:
            'відстеження машин завершене успішно',

        [ServerMessageCode.CycleScheduled]: 'Цикл заплановано успішно',
        [ServerMessageCode.CycleReceived]: 'цикл отримано успішно',
        [ServerMessageCode.CycleUpdated]: 'цикл успішно видалено',

        [ServerMessageCode.RequestSent]: 'запит надіслано',
    },
};

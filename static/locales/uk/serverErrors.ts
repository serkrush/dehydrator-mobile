import {ServerErrorCode} from 'src/constants';

export default {
    translation: {
        [ServerErrorCode.NoUserForId]: 'Не знайдено користувача для uid',
        [ServerErrorCode.NoRecipeForId]: 'Не знайдено рецепт для uid',
        [ServerErrorCode.NotAccessedAction]: 'Недоступна дія',
        [ServerErrorCode.TokenNotVerify]: 'Токен не пройшов перевірку',
        [ServerErrorCode.NotInvitationForId]: 'Не знайдено запрошення для id',
        [ServerErrorCode.NoAccessForId]:
            'Не знайдено доступ до машин для ідентифікатора',
        [ServerErrorCode.NotProvidedUser]: 'Ненаданий користувач',
        [ServerErrorCode.NotProvidedRecource]: 'Не надано ресурс',
        [ServerErrorCode.NotFoundUserForEmail]:
            'Не знайдено користувача для електронної пошти',
        [ServerErrorCode.NotFoundMachineGroup]:
            'Не знайдено групу машин для ідентифікатора',
        [ServerErrorCode.NotFoundModel]: 'Не знайдено модель машини для id',
        [ServerErrorCode.NotFoundMachine]:
            'Не знайдено групу машин для ідентифікатора',
        [ServerErrorCode.NotFoundCategory]: 'Не знайдено категорію для id',
        [ServerErrorCode.NoRecipeFavoriteId]:
            'Не знайдено улюблений рецепт для ідентифікатора',
        [ServerErrorCode.UserAlreadyExist]:
            'користувач із такою електронною адресою вже існує',
        [ServerErrorCode.UserAlreadyHaveInvite]:
            'у користувача вже є запрошення',
        [ServerErrorCode.Unauthorized]: 'Неавторизовано',
        [ServerErrorCode.NoTokenProvided]: 'Токен не надано',
        [ServerErrorCode.NotFoundCycle]: 'Не знайдено цикл для id',

        [ServerErrorCode.IdentityUpdatingError]:
            'Помилка оновлення ідентифікаційної інформації',

        [ServerErrorCode.LoginFailed]: 'Помилка входу',
        [ServerErrorCode.RegisterFailed]: 'Помилка реєстрації користувача',
        [ServerErrorCode.InviteSentFailed]: 'Не вдалося надіслати запрошення',
        [ServerErrorCode.InviteAcceptFailed]: 'Не вдалося прийняти запрошення',
        [ServerErrorCode.InviteReceiveFailed]: 'Не вдалося отримати запрошення',

        [ServerErrorCode.MachinesReceiveFailed]: 'Не вдалося отримати машину',
        [ServerErrorCode.MachineAddFailed]: 'Не вдалося додати машину',
        [ServerErrorCode.MachineUpdateFailed]: 'Не вдалося оновити машину',
        [ServerErrorCode.MachineFetchFailed]:
            'Не вдалося отримати інформацію про машину',
        [ServerErrorCode.MachineDeleteFailed]: 'Не вдалося видалити машину',
        [ServerErrorCode.MachinePairFailed]: 'Не вдалося підключити машину',
        [ServerErrorCode.MachinePairConfirmFailed]:
            'Не вдалося підключити машину',
        [ServerErrorCode.FCMTokenUpdateFailed]: 'Не вдалося оновити FCM токен',

        [ServerErrorCode.MachineGroupsReceiveFailed]:
            'Не вдалося отримати групи машин',
        [ServerErrorCode.MachineGroupAddFailed]:
            'Не вдалося додати групу машин',
        [ServerErrorCode.MachineGroupCreateFailed]:
            'Не вдалося створити групу машин',
        [ServerErrorCode.MachineGroupUpdateFailed]:
            'Не вдалося оновити групу машин',
        [ServerErrorCode.MachineGroupFetchFailed]:
            'Не вдалося отримати інформацію про групу машин',
        [ServerErrorCode.MachineGroupDeleteFailed]:
            'Не вдалося видалити групу машин',
        [ServerErrorCode.MachineGroupMachinesReceiveFailed]:
            'Не вдалося отримати машини групи машин',

        [ServerErrorCode.MachineAccessReceiveFailed]:
            'Не вдалося отримати доступ до машини',
        [ServerErrorCode.MachineAccessAddFailed]:
            'Не вдалося додати доступ до машини',
        [ServerErrorCode.MachineAccessUpdateFailed]:
            'Не вдалося оновити доступ до машини',
        [ServerErrorCode.MachineAccessFetchFailed]:
            'Не вдалося отримати інформацію про доступ до машини',
        [ServerErrorCode.MachineAccessDeleteFailed]:
            'Не вдалося видалити доступ до машини',

        [ServerErrorCode.MachinesTrackFailed]: 'Не вдалося відстежити машини',
        [ServerErrorCode.MachinesUntrackFailed]:
            'Не вдалося скасувати відстеження машин',

        [ServerErrorCode.CycleScheduleFailed]: 'Не вдалося розкладу циклу',
        [ServerErrorCode.CycleReceiveFailed]: 'Не вдалося отримати цикл',
        [ServerErrorCode.CycleUpdateFailed]: 'Не вдалося оновити цикл',
        [ServerErrorCode.CycleDeleteFailed]: 'Не вдалося видалити цикл',

        [ServerErrorCode.RequestSendingFailed]: 'Не вдалося надіслати запит',
        [ServerErrorCode.UserDeleteFailedOwnMachine]:
            'Не вдалося видалити користувача. Передайте доступи до машин іншому користувачеві перед видаленням',
    },
};

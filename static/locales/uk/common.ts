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
        language_enUS: 'Англіська - US',
        language_uk: 'Українська',

        //
        country_US: 'Сполучені Штати',
        country_AU: 'Австралія',
        country_CA: 'Канада',
        country_UK: 'Великобританія',
        country_NZ: 'Нова Зеландія',

        //
        scale_metric: 'Метрична (°C / КГ)',
        scale_imperial: 'Імперська (°F / ФУНТ)',

        //
        'not-all-selected': 'Вибрано не всі параметри',

        //
        [`permissions_${PermissionLevel.SuperAdmin}`]: 'Супер Адмін',
        [`permissions_${PermissionLevel.Admin}`]: 'Адмін',
        [`permissions_${PermissionLevel.User}`]: 'Користувач',
        [`permissions_${PermissionLevel.Viewer}`]: 'Переглядач',

        //Tabs
        'tab-home': 'Головна',
        'tab-data-and-charts': 'Дані & Графіки',
        'tab-notifications': 'Сповіщення',
        'tab-settings': 'Налаштування',
        'tab-machines': 'Машини',
        'tab-main': 'Головна',

        //

        [SettingsOption.UserAndPermission]: 'Користувач & Дозвіл',
        //[SettingsOption.LanguageAndRegion]: 'Мова & Регіон',
        [SettingsOption.Dehydrators]: 'Ваші дегідратори',
        //[SettingsOption.Advanced]: 'Розширені налаштування',

        [SettingsOption.MyProfile]: 'Мій профіль',
        [SettingsOption.UserPermissions]: 'Дозволи користувача',
        [SettingsOption.MyMachines]: 'Мої пристрої',
        [SettingsOption.Notifications]: 'Сповіщення',
        [SettingsOption.LanguageAndRegion]: 'Мова та регіон',
        [SettingsOption.SoftwareUpdates]: 'Оновлення програмного забезпечення',
        [SettingsOption.DiagnosticData]: 'Діагностичні дані',
        [SettingsOption.Advanced]: 'Розширені налаштування',

        //
        'my-profile-title': 'Деталі користувача',
        'my-profile-description': 'Відредагуйте свої особисті дані тут.',

        'user-permissions-list-title': 'Поточні користувачі',
        'user-permissions-list-description':
            'Список усіх існуючих користувачів',

        'user-transferring-list-title': 'Передача прав іншому користувачу',
        'user-transferring-list-description':
            'Будьте обережні! Після передачі прав ви втратите доступ до всіх своїх користувачів, дегідраторів і груп. Ці дії незворотні!',

        'update-permissions-title': 'Деталі користувача',
        'update-permissions-description':
            'Редагувати дозволи цього користувача',

        'share-permission-title': 'Поширити дозволи',
        'share-permission-description':
            'Введіть електронну адресу інших користувачів',

        //

        'no-notifications': 'Ви ще не отримали жодного сповіщення',

        //
        'upload-proof': 'Завантажити Доказ',
        'machine-updated': 'Дані пристрою оновлені',
        file: 'Файл',
        //

        'current-dehydrators-title': 'Поточні дегідратори',
        'current-dehydrators-description':
            'Додати та редагувати поточні дегідратори',

        'current-freeze-title': 'Поточні сублімаційні сушарки',
        'current-freeze-description':
            'Додати та редагувати поточні сублімаційні сушарки',

        'current-groups-title': 'Поточні групи',
        'current-groups-description': 'Додати та редагувати поточні групи',
        //

        'current-language': 'ПОТОЧНА МОВА',
        'current-country': 'ПОТОЧНА КРАЇНА',
        'current-scale': 'МЕТРИЧНА / ІМПЕРСЬКА',

        'select-language': 'Обрати Мову Застосунку',
        'select-country': 'Обрати Країну',
        'select-region': 'Оберіть регіон',
        'select-region-and-timezone': 'Оберіть регіон та часову зону',
        'select-timezone': 'Оберіть часову зону',
        'select-scale': 'Обрати Систему Міри',
        'select-measurement-scale': 'Обрати Систему Міри',
        'select-currency': 'Обрати валюту',

        'welcome-desc': 'ПІДІЙМІТЬ ВАШУ ДЕГІДРАЦІЮ\nНА НАСТУПНИЙ РІВЕНЬ',
        'sign-in-desc': 'увійти',
        'register-desc': 'ЗАРЕЄСТРУЙТЕ АККАУНТ',

        'placeholder-email': 'Пошта',
        'placeholder-name': "ім'я",
        'placeholder-full-name': "Повне ім'я",
        'placeholder-first-name': "Ім'я",
        'placeholder-last-name': 'Прізвище',
        'placeholder-password': 'Пароль',
        'placeholder-confirm-password': 'Підтвердити пароль',
        'name-of-user': "Ім'я Користувача",

        permissions: 'Дозволи',
        'update-permissions': 'Додати дозволи користувача',
        'current-permissions': 'Поточні дозволи',
        'share-permissions': 'Поширити дозволи',
        'select-permissions': 'Обрати дозвіл',

        'permission-shared-success': 'Дозволи надіслані успішно',
        'share-group-permissions': 'Надіслати Дозвіл На Групу',
        'level-of-permissions': 'Рівень доступу',
        'send-invite': 'Надіслати запрошення',
        'send-ivite-success': 'Запрошення надіслано успішно',

        'accessible-dehydrators': 'Доступні Дегідратори',

        'accessible-groups-title': 'Доступні групи дегідраторів',
        'accessible-groups-description': 'Додати та редагувати групи',

        'accessible-dehydrators-title': 'Доступні дегідратори',
        'accessible-dehydrators-description':
            'Додати та редагувати окремі машини',

        'add-group': 'Додати Групу',
        'add-a-dehydrator': 'Додати Дегідратор',
        'add-dehydrator': 'Додати Дегідратор',
        'edit-dehydrator': 'Відредагувати Дегідратор',
        'edit-machine': 'Відредагувати Пристрій',

        'select-user': 'Оберіть користувача',
        'transferring-rights-title': 'Передача прав',
        'transfer-rights-all-resources-message': `Ви впевнені, що хочете передати права на всі доступні ресурси? Щоб підтвердити, введіть "${CONFIRM_STRING}" у поле нижче та натисніть "Підтвердити".`,
        'success-transferring-rights': 'Права було успішно передано',

        machines: 'Машини',
        groups: 'Групи',

        'group-title': 'Додати/Редагувати Групу',
        'group-add-title': 'Додати Нову Групу',
        'group-view-title': 'Переглянути Групу',
        'group-edit-title': 'Редагувати Групу',

        dehydrators: 'Дегідратори',
        'select-resource': 'Обрати Ресурс',
        pair: 'Зпарувати',
        'add-dehydrator-lan':
            'Переконайтеся, що ваш телефон під’єднано до тієї ж мережі Wi-Fi, що й дегідратор, з яким ви хочете створити пару',
        'scan-lan': 'Сканувати доступні дегідратори',
        'dehydrator-not-show': 'Дегідратор не відображається?',
        'dehydrator-not-show-message':
            'Перейдіть на екран налаштувань Wi-Fi на вашому дегідраторі та перевірте підключення до мережі.\n\nПерейдіть до розділу "Парування" та відскануйте QR-код, щоб підключити дегідратор до програми.',
        'pair-qr': 'Зпарувати за допомогою QR код',
        'scan-qr': 'Сканувати QR код',

        'not-showing-up-span': 'не відображається?',

        'group-list-title': 'Групи пристроїв',
        'no-groups-desc': 'У вас ще немає груп.\nПочніть з додавання групи',
        'adding-a-group': 'додавання групи',

        'group-screen-title': 'Деталі групи',
        'group-screen-description': 'Редагувати деталі ваших груп',

        'group-list-screen-title': 'Список груп',
        'group-list-screen-description': 'Додавайте та редагуйте свої групи',

        'machine-list-title': 'Додати Пристрій',
        'machine-list-screen-title': 'Список пристроїв',
        'machine-list-screen-description': 'Додайте та редагуйте свої пристрої',

        'get-started': 'Почати',

        'sign-in': 'Увійти',
        login: 'Увійти',
        register: 'Зареєструватися',
        'create-acc': 'Створити аккаунт',
        logout: 'Вийти',
        'add-user': 'Додати  Користувача',
        'add-user-title': 'Додати  Користувача',

        'login-with': 'увійти з',
        google: 'Google',
        facebook: 'Facebook',
        account: 'обліковий запис',

        or: 'або',
        'forgot-password': 'Забули пароль',
        'onboarding-next': 'далі',

        success: 'Успіх',
        fail: 'Помилка',
        'reset-password-alert':
            'Електронний лист для зміни пароля надіслано. Будь ласка, перевірте свою пошту',
        'email-not-exist': 'Користувача з введеним імейлом не знайдено',
        'social-using-for-login': 'Для реєстрації ви використовували',

        'send-email': 'Надіслати лист',
        'change-password': 'Змінити пароль',
        'current-password': 'Поточний пароль',
        'new-password': 'Новий пароль',
        'confirm-new-password': 'Підтвердити новий пароль',
        'logout-all-devices': 'Вийти з усіх пристроїв',
        'group-name': 'Назва Групи',
        'group-name-placeholder': 'Назва Групи',
        'group-location': 'Локація',
        'group-location-placeholder': 'Локація',

        'success-add-user': 'Користувач доданий успішно',
        'success-edit-user': 'Дані користувача оновлено успішно',
        'success-delete-user': 'Користувач видалений успішно',

        'success-delete-machine': 'Пристрій видалено успішно',
        'success-delete-recipe-favorites':
            'Рецепт було вилучено зі збереженних',
        cancel: 'Відміна',
        save: 'Зберегти',
        'delete-acc': 'ВИДАЛИТИ АККАУНТ',
        'delete-deh': 'ВИДАЛИТИ ДЕГІДРАТОР',
        'delete-group': 'ВИДАЛИТИ ГРУПУ',

        'dont-have-acc': 'Не маєте аккаунта?',
        'have-acc': 'Вже маєте аккаунт?',

        //
        time_m: 'хв',
        time_h: 'г',
        weight_g: 'г',

        //
        normal: 'Нормальна',
        reduced: 'Зменшена',
        light: 'Низька',

        //
        stage_set_initTemperature: 'Встановити ​​температуру',
        stage_set_weight_loss: 'Втрата ваги у відсотках',
        stage_set_duration: 'Час етапу',
        stage_set_heatingIntensity: 'Інтенсивність нагріву',
        stage_set_fanPerformance: 'Швидкість вентилятора',
        stage_set_fanPerformance1: 'Продуктивність вентилятора 1',
        stage_set_fanPerformance2: 'Продуктивність вентилятора 2',

        //
        add: 'Додати',
        start: 'Почати',
        delete: 'Видалити',
        stages: 'Етапи',
        'select-zone': 'Обрати Зону',
        schedule: 'Запланувати',

        //
        'delete-schedule-title': 'Видалити запланований цикл',
        'delete-schedule-description':
            'Ви впевнені, що бажаєте видалити цей запланований цикл?',

        'delete-user-title': 'Видалити користувача',
        'delete-user-description':
            "Ви впевнені, що хочете видалити цей обліковий запис? Щоб підтвердити, будь ласка, введіть ім'я користувача у полі нижче та натисніть видалити",

        //
        [`zones_${Zone.Top}`]: 'Верхня',
        [`zones_${Zone.Bottom}`]: 'Нижня',
        [`zones_${Zone.Middle}`]: 'Середня',
        [`zones_${Zone.Left}`]: 'Ліва',
        [`zones_${Zone.Right}`]: 'Права',

        //
        [ZoneAvailableState.Available]: 'доступно',
        [ZoneAvailableState.Error]: 'помилка',
        [ZoneAvailableState.Offline]: 'офлайн',
        [ZoneAvailableState.InProgress]: 'в процесі',
        [ZoneAvailableState.Scheduled]: 'заплановано',

        //
        'select-dehydrator': 'Обрати Дегідратор',
        'manual-control': 'Ручне керування',
        'dehydration-cycle': 'Цикл дегідрації',

        //
        'cycles-list': 'Список циклів',

        //
        'current-stage': 'Поточний етап',
        pause: 'Пауза',
        'cancel-cycle': 'Відмінити цикл',
        stage_set_weight: 'Встановити вагу',

        //
        'user-updated-success': 'Дані користувача оновлені успішно',
        'password-updated-success': 'Пароль оновлено успішно',
        'user-permissions-removed-success': 'Права користувача було видалено',

        //
        'group-added-success': 'Група успішно додано',
        'group-updated-success': 'Група успішно оновлена',
        'group-deleted-success': 'Група успішно видалена',

        'machine-paired-success': 'Пара створена успішно',

        //
        update: 'Оновити',
        'is-active': 'Активно',
        'is-paused': 'Зупинено',
        'is-cooling': 'Охолодження',
        'is-sanitization': 'Очищення',
        resume: 'Продовжити',
        stop: 'Стоп',
        upload: 'Завантажити',
        'upload-proof-title': 'Завантажити доказ покупки',
        costPer: 'Вартість за кВт/год',

        //
        'select-machine': 'Обраний пристрій',
        'no-dehydrator': 'Немає дегідратора',
        'no-dehydrator-desc':
            'У вас немає доданих пристроїв. Натисніть кнопку Додати пристрій щоб відкрити екран для створення пари.',
        'add-a-machine': 'Додати пристрій',

        //
        'manage-details': 'керувати деталями',
        'view-all': 'переглянути усі',

        'no-user-desc':
            'У вас ще немає користувачів.\nПочніть з додавання користувача',
        'adding-a-user': 'додавання користувача',

        //
        'add-machine-to-group': 'Додати Пристрій до Групи',

        //
        'add-no-machine-desc':
            'У вас ще немає пристроїв. Почніть із додавання пристрою, який ви можете з’єднати',
        'adding-a-machine': 'додавання пристрою',

        //
        tray_count: 'підносів',
        'tray-area': 'площа підносів',
        'tray-sq': 'кв.',
        zone_count_one: 'зона',
        zone_count_many: 'зони',
        dehydrator: 'Дегідратор',
        zone: 'зона',
        idle: 'неактивний',
        paused: 'призупинено',
        cooling: 'охолодження',
        cleaning: 'очищення',

        temperature: 'Температура',
        'fan-speed': 'Швидкість вентилятора',
        'total-time': 'Загальний час',
        weight: 'Вага',
        time: 'Час',
        heating: 'Інтенсивність нагріву',
        power: 'Потужність',

        'by-recipe': 'За рецептом/налаштуванням',
        'run-session-by': 'Сеанс запущений за',
        'time-remaining': 'Час, що залишився',

        [`session_run_by_${SessionRunnedBy.Time}`]: 'Time',
        [`session_run_by_${SessionRunnedBy.Weight}`]: 'Weight',

        'socket-connecting': "Під'єднання...",
        'socket-press-available': "Натистіть для перепід'єднання",

        confirm: 'Підтвердити',

        year: 'Рік',
        month: 'Місяць',
        day: 'День',
        hours: 'Години',
        minutes: 'Хвилини',

        'time-d': 'д',
        'time-h': 'г',
        'time-m': 'м',
        'time-s': 'с',
        ago: 'назад',
        now: 'зараз',

        'tare-weight': 'Вага тари',
        'set-parameters': 'Встановити Параметри',

        //
        'select-recipe': 'обрати рецепт',
        presets: 'пресети',
        preset: 'пресет',
        'bf cookbook': 'кулінарна книга BF',
        'my recipes': 'мої рецепти',
        'my categories': 'мої категорії',
        categories: 'Категорії',
        'my recipe': 'мій рецепт',
        'data & charts': 'дані та діаграми',

        //
        'tap to visit': 'торкніться, щоб відвідати',

        forum: 'форум',
        'forum-description': 'опис форуму',

        liveChat: 'чат',
        'liveChat-description': 'опис чату',

        website: 'веб-сайт',
        'website-description': 'опис веб-сайту',
        required: "Обов'язковий",

        guid: 'GUID',
        scan: 'Сканувати',

        //Errors
        'delete-user-wrong-name': "Введено недійсне ім'я користувача",
        'request-timeout':
            'Час очікування запиту минув. Будь ласка, спробуйте пізніше',
        'can-not-delete-already-setuped-stages':
            'Неможливо видалити вже встановлені етапи',

        'auth/email-already-exist':
            'Обліковий запис із вказаною електронною адресою вже існує',

        'default-error-title': 'Помилка',
        'auth/invalid-email-title': 'Недійсна електронна адреса',
        'auth/user-disabled-title': 'Користувач деактивований',
        'auth/user-not-found-title': 'Користувач не знайдений',
        'auth/wrong-password-title': 'Неправильний пароль',
        'auth/email-already-in-use-title':
            'Електронна пошта вже використовується',
        'auth/operation-not-allowed-title': 'Недозволена операція',
        'auth/weak-password-title': 'Слабкий пароль',
        'auth/invalid-credential-title': 'Неправильні облікові дані',
        'auth/network-request-failed-title': 'Запит не виконано',

        'schedule-past-time':
            'Ви не можете запланувати цикл на час, який уже минув. Будь ласка, виберіть дату в майбутньому',

        'password-not-valide-alert-title': 'Уууупс',
        'password-dont-match-alert-message': 'Паролі не збігаються',
        'password-invalid-length-alert-message':
            'Пароль має бути 8 символів або більше',
        'password-invalid-cases-alert-message':
            'Пароль має містити обидва регістри',
        'password-invalid-digit-alert-message': 'Пароль має містити цифри',

        'empty-fields': 'Деякі поля порожні',
        'default-error-message':
            'Щось пішло не так. Будь ласка спробуйте ще раз',
        'Network request failed': 'Помилка запиту мережі',
        'not-connected':
            "Немає підключення до мережі. Будь ласка, перевірте ваше з'єднання",
        'auth/invalid-email-message': 'Адреса електронної пошти недійсна',
        'auth/user-disabled-message':
            'Користувача, який відповідає вказаним обліковим даним, вимкнено',
        'auth/user-not-found-message':
            'Немає користувача, який відповідає вказаній електронній пошті',
        'auth/wrong-password-message':
            'Пароль для даної електронної пошти недійсний або для облікового запису, який відповідає цій електронній пошті, не встановлено пароль',
        'auth/email-already-in-use-message':
            'Обліковий запис із вказаною електронною адресою вже існує',
        'auth/operation-not-allowed-message': 'Операція заборонена. ',
        'auth/weak-password-message': 'Пароль недостатньо надійний',
        'auth/invalid-credential-message':
            'Надані облікові дані автентифікації неправильні, неправильно сформовані або їх термін дії минув',
        'auth/network-request-failed-message':
            'Щось пішло не так. Будь ласка спробуйте ще раз',

        'invalid-values': 'Невірні значення. Будь ласка перевірте поля',
        'invalid-parameters': 'Надано недійсні параметри',
        'invalid-delete-string': 'Не правильний рядок видалення',
        'invalid-confirmation-string': 'Не правильна строка підтвердження',

        'type-here': 'Введіть тут',

        'machine-pair-request-success': "Запит на з'єднання надіслано",
        'pair-timeout':
            'Не вдалося створити пару. Будь ласка, спробуйте відсканувати та створити пару ще раз',
        'wrong-pair-data': 'Отримані дані недійсні. Спробуйте знову',
        'invalid-email': 'Недійсна адреса електронної пошти',

        'delete-dehydrator-title': 'Видалити дегідратор',

        'delete-dehydrator-message': `Ви впевнені, що хочете видалити свій дегідратор? Щоб підтвердити, введіть "${DELETE_CONFIRM_STRING}" у поле нижче та натисніть Підтвердити`,

        'delete-user-permissions-title': 'Видалити права користувача',

        'delete-user-permissions-message': `Ви впевнені, що хочете видалити ці права користувача? Щоб підтвердити, введіть "${DELETE_CONFIRM_STRING}" у поле нижче та натисніть підтвердити.`,

        'page-next': 'наступний',
        'page-previous': 'попередня',
        'page-of': 'з',
        bookmarked: 'Додано в закладки',
        'no-entries-yet': 'Поки що немає записів',
        'create-new-recipe': 'Створити новий рецепт',
        'create-new-category': 'Створити нову категорію',
        'methods-list': 'Список методів',
        'ingredients-list': 'Список інгредієнтів',
        'you-havent-added-ingredients':
            'Ви не додали жодних інгредієнтів до цього списку',
        'you-havent-added-methods':
            'Ви не додали жодних методів до цього списку',
        description: 'Опис',
        create: 'Створити',
        'recipe-name': 'Назва рецепта',
        'category-name': 'Назва категорії',
        'delete-dehydrator-group-title': 'Видалити шрупу',
        'delete-dehydrator-group-message':
            'Ви впевнені, що хочете видалити свою групу? Щоб підтвердити, введіть "видалити" у поле нижче та натисніть видалити',

        'delete-confirmation-string': 'видалити',
        confirmation: 'підтвердження',

        'delete-user-error-title': 'Видалити помилку користувача',
        'delete-user-error-own-description':
            'Вибачте, для пристроїв потрібен інший власник. Будь ласка, поділіться дозволами перед видаленням.',
        close: 'Закрити',
        method: 'Метод',
        ingredients: 'Інгредієнти',
        'edit-recipe': 'Редагувати Рецепт',
        edit: 'Редагувати',
        'favourite-presets': 'Улюблені пресети',
        thickness: 'Товщина',
        'present-adjustment': 'Поточне коригування',
        marinated: 'Маринований',
        'edit-category': 'Редагувати категорію',
        'favourite-recipes': 'Улюблені рецепти',
        'no-recipes': 'Ви не додали жодного рецепта.',
        'no-categories': 'Ви не додали жодної категорії.',
        'open-camera': 'Відкрити камеру',
        'choose-from-gallery': 'Вибрати з галереї',
        'delete-category': 'Видалити категорію?',
        'delete-recipe': 'Видалити рецепт?',
        yes: 'Так',
        'stage-time': 'Час етапу',
        'dehydrator-not-selected': 'Дегідратор не вибрано.',
        'unsaved-changes':
            'У вас є незбережені зміни. Ви впевнені, що бажаєте вийти та втратити всі незбережені дані?',
        'exit-without-saving': 'Вийти без збереження',
        'success-delete-recipe': 'Успішно видалено рецепт.',
        'success-delete-category': 'Категорію успішно видалено.',
        'success-save-category': 'Успішне збереження категорії.',
        'success-save-recipe': 'Успішно збережено рецепт.',
        'success-save-recipe-favorites':
            'Успіх у збереженні улюблених рецептів.',
        'error-category-has-recipe':
            'Категорію неможливо видалити. Видалити рецепти.',
        'no-cookbooks': 'Кулінарної книги немає.',
        'no-presets': 'Немає попередніх налаштувань.',
        'heating-intensity': 'Інтенсивність нагріву',
        'not-owner': 'Ви не є власником цієї машини',
        'reset-to-factory': 'Відновити заводські налаштування',
        'change-owner': 'Змінити власника',

        'Something went wrong while taking camera permission':
            'Під час отримання дозволу на камеру сталася помилка',
        'This feature is not supported on this device':
            'Ця функція не підтримується на цьому пристрої',
        'Permission Denied': 'Permission Denied',
        'Please give permission from settings to continue using camera.':
            'Будь ласка, дайте дозвіл із налаштувань, щоб продовжити використання камери.',
        'Go To Settings': 'Перейти до налаштувань',

        'guid do not match': 'guid не збігаються',
        'machine-not-exist': 'Запитана машина не існує',

        'not-accessed-screen': 'Немає доступу до екрана',
        'start-for': 'Почати для...',
        zones: 'Зони',
        'not-have-scale': 'Обрана модель дегідратора не має шкали.',
        category: 'Категорія',
        'sub-category': 'Підкатегорія',
        'send-recipe': 'Надіслати рецепт',
    },
};

import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {NativeModules} from 'react-native';
import enUS from '../static/locales/enUS/common';
import enUSServerErrors from '../static/locales/enUS/serverErrors';
import enUSServerMessages from '../static/locales/enUS/serverMessages';
import enUSNotifications from '../static/locales/enUS/notifications';

import uk from '../static/locales/uk/common';
import ukServerErrors from '../static/locales/uk/serverErrors';
import ukServerMessages from '../static/locales/uk/serverMessages';
import ukNotifications from '../static/locales/uk/notifications';

const resources = {
    enUS: {
        translation: {
            ...enUS.translation,
            ...enUSServerErrors.translation,
            ...enUSServerMessages.translation,
            ...enUSNotifications.translation,
        },
    },
    uk: {
        translation: {
            ...uk.translation,
            ...ukServerErrors.translation,
            ...ukServerMessages.translation,
            ...ukNotifications.translation,
        },
    },
};

const locale: string = NativeModules.I18nManager.localeIdentifier;

const languageDetector: any = {
    type: 'languageDetector',
    async: true,
    detect: (cb: any) => cb(locale?.substring(0, 2)),
    init: () => {},
    cacheUserLanguage: () => {},
};

i18next.use(languageDetector).use(initReactI18next).init({
    compatibilityJSON: 'v3',
    fallbackLng: 'enUS',
    debug: true,
    resources,
});

import {
    ZoneAdditionalStatus,
    ZoneAvailableState,
} from 'src/entities/models/Machine';
import palette from '../palette';

const main = {
    mainBackground: palette.lightGray,

    spinner: palette.orange,
    checkbox: palette.orange,
    checkboxText: "#1A1A1A",

    tabBar: {
        active: palette.orange,
        inactive: palette.blueDark,
    },

    header: {
        text: {
            main: palette.blueBlack,
            additional: palette.blue,
        },
        border: palette.blueLight,
    },

    input: {
        background: 'white',
        text: {
            title: palette.blueDark,
            value: palette.blueBlack,
        },
        border: palette.blueLight,
        shadow: '#1018280D',
    },

    bottomText: palette.blueBlack,
    textButton: palette.orange,

    button: {
        primary: {
            background: palette.orange,
            content: palette.white,
            shadow: '#00000040',
            border: palette.orange,
        },
        alternative: {
            background: palette.gray5,
            content: palette.blue,
            shadow: '#00000040',
            border: 'clear',
        },
        outlined: {
            background: palette.white,
            content: palette.blueDark,
            shadow: '#1018280D',
            border: palette.blueLight,
        },
        destructive: {
            background: palette.red,
            content: palette.white,
            shadow: '#1018280D',
            border: palette.red,
        },
    },

    imageButton: {
        primary: {
            background: palette.blueDark,
            content: palette.white,
            border: 'clear',
            shadow: 'clear',
        },
        alternative: {
            background: palette.gray,
            content: palette.white,
            shadow: 'clear',
            border: palette.white,
        },
        outlined: {
            background: palette.white,
            content: palette.blueBlack,
            border: palette.gray,
            shadow: 'clear',
        },
        destructive: {
            background: '#F9F0EF',
            content: '#F24E41',
            shadow: 'clear',
            border: '#F98179',
        },
        orange: {
            background: '#F9F5EF',
            content: '#ED8A24',
            shadow: 'clear',
            border: '#F9B679',
        },
    },

    card: {
        base: {
            background: palette.white,
            border: palette.gray,
            shadow: '#1018280D',
        },

        selected: {
            background: palette.orangeLightest,
            border: palette.orange,
            shadow: '#1018280D',
        },

        text: {
            h1: 'black',
            h2: palette.blueBlack,
            h3: palette.blue,
            h4: palette.blueBlack,

            mainContent: palette.blueDark,
            additionalContent: palette.midGray,

            unactive: '#5E675A40',
        },

        subcontainer: {
            background: palette.lightGray,
            separator: palette.gray,
        },
    },

    zoneState: {
        main: {
            [ZoneAvailableState.Available]: {
                background: '#F0FFEE',
                border: '#C7F9AF',
                content: '#28B446',
            },

            [ZoneAvailableState.InProgress]: {
                background: '#F0FFEE',
                border: '#C7F9AF',
                content: '#28B446',
            },

            [ZoneAvailableState.Offline]: {
                background: '#F9FAFB',
                border: palette.gray,
                content: palette.midGray,
            },

            [ZoneAvailableState.Error]: {
                background: '#FFEEEE',
                border: '#F9AFAF',
                content: '#ED2424',
            },

            [ZoneAvailableState.Scheduled]: {
                background: '#FFF6EE',
                border: '#F9DBAF',
                content: palette.orange,
            },
        },

        additional: {
            [ZoneAdditionalStatus.None]: {
                background: '#F9FAFB',
                border: palette.gray,
                content: '#354054',
            },

            [ZoneAdditionalStatus.Idle]: {
                background: '#F9FAFB',
                border: palette.gray,
                content: '#354054',
            },

            [ZoneAdditionalStatus.Paused]: {
                background: '#F9FAFB',
                border: palette.gray,
                content: '#354054',
            },

            [ZoneAdditionalStatus.Cooling]: {
                background: '#F9FAFB',
                border: palette.gray,
                content: '#354054',
            },

            [ZoneAdditionalStatus.Cleaning]: {
                background: '#F9FAFB',
                border: palette.gray,
                content: '#354054',
            },
        },
    },

    exclamation: {
        content: palette.red,
        background: '#FEE4E2',
        border: '#FEF3F2',
    },

    aletView: {
        content: '#DC6803',
        background: '#FEF0C7',
        border: '#FFFAEB',
    },
};

export default main;

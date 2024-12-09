import {Dimensions, TextStyle} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {families} from './families';

const {fontScale} = Dimensions.get('window');

export const normalize = size => {
    console.log('normalize', size, fontScale);
    return size / fontScale;
};

export const fonts: {
    [key: string]: TextStyle;
} = {
    h1: {
        fontFamily: families.oswald,
        fontWeight: '400',
        fontSize: RFValue(32, 812),
        textTransform: 'uppercase',
        lineHeight: RFValue(40, 812),
    },

    h2: {
        fontFamily: families.oswald,
        fontWeight: '400',
        fontSize: RFValue(21, 812),
        textTransform: 'uppercase',
        lineHeight: RFValue(28, 812),
    },

    h3: {
        fontFamily: families.oswald,
        fontWeight: '400',
        fontSize: RFValue(18, 812),
        textTransform: 'uppercase',

        lineHeight: RFValue(24, 812),

        letterSpacing: 0,
    },

    h4: {
        fontFamily: families.oswald,
        fontWeight: '400',
        fontSize: RFValue(16, 812),
        textTransform: 'uppercase',

        letterSpacing: 0,
    },

    textSizeL28: {
        fontFamily: families.inter,
        fontWeight: '600',
        fontSize: RFValue(18, 812),

        lineHeight: RFValue(28, 812),

        letterSpacing: 0,
    },

    textSizeLL: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: RFValue(18, 812),

        letterSpacing: 0,
    },

    textSizeM: {
        fontFamily: families.inter,
        fontWeight: '500',
        fontSize: RFValue(16, 812),

        lineHeight: RFValue(16, 812),

        letterSpacing: 0,
    },

    textSizeML: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: RFValue(16, 812),

        lineHeight: RFValue(24, 812),

        letterSpacing: 0,
    },

    textSizeM24: {
        fontFamily: families.inter,
        fontWeight: '500',
        fontSize: RFValue(16, 812),

        lineHeight: RFValue(24, 812),

        letterSpacing: 0,
    },

    textSizeS20: {
        fontFamily: families.inter,
        fontWeight: '500',
        fontSize: RFValue(14, 812),

        lineHeight: RFValue(20, 812),

        letterSpacing: 0,
    },

    textSizeSB: {
        fontFamily: families.inter,
        fontWeight: '600',
        fontSize: RFValue(14, 812),

        letterSpacing: 0,
    },

    textSizeSL: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: RFValue(14, 812),

        lineHeight: RFValue(20, 812),

        letterSpacing: 0,
    },

    textSizeXS: {
        fontFamily: families.inter,
        fontWeight: '500',
        fontSize: RFValue(12, 812),

        lineHeight: RFValue(16, 812),

        letterSpacing: 0,
    },

    button: {
        fontFamily: families.inter,
        fontWeight: '600',
        fontSize: RFValue(16, 812),

        lineHeight: RFValue(16, 812),

        letterSpacing: 0,
    },

    button24: {
        fontFamily: families.inter,
        fontWeight: '600',
        fontSize: RFValue(16, 812),

        lineHeight: RFValue(24, 812),

        letterSpacing: 0,
    },

    decorativeB: {
        fontFamily: families.inter,
        fontWeight: '600',
        fontSize: RFValue(11, 812),

        letterSpacing: 0,
    },

    decorative: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: RFValue(11, 812),

        lineHeight: RFValue(16, 812),

        letterSpacing: 0,
    },

    textSizeXSL: {
        fontFamily: families.inter,
        fontWeight: '400',
        fontSize: RFValue(12, 812),

        lineHeight: RFValue(18, 812),

        letterSpacing: 0,
    },
};

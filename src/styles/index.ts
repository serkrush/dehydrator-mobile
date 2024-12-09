import {colors, families, fonts} from '../theme';
import {StyleSheet} from 'react-native';

const baseStyles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },

    baseContainer: {
        flex: 1,
        //paddingVertical: 4,
        paddingHorizontal: 20,
    },

    baseLoginContainer: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        flex: 1,
    },

    baseText: {
        color: '#ffffff',
        fontSize: 20,
        fontFamily: families.oswald,
    },

    settingsTitle: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 4,
        textTransform: 'capitalize',
    },

    settingsUtilButtonText: {fontFamily: families.oswald, fontSize: 18},

    inputContainer: {
        backgroundColor: colors.input.background,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.input.border,
        shadowColor: colors.input.shadow,
        shadowOpacity: 1,
        shadowOffset: {width: 0, height: -2},
        elevation: 2,
    },

    inputTitleText: {
        ...fonts.textSizeS20,
        color: colors.input.text.title,
    },

    inputValueText: {
        ...fonts.textSizeM24,
        color: colors.input.text.value,
    },

    backButton: {
        backgroundColor: colors.imageButton.outlined.background,
        width: 40,
        height: 40,
        borderRadius: 8,
        borderColor: colors.imageButton.outlined.border,
        borderWidth: 1,
    },

    orangeButton: {
        backgroundColor: colors.imageButton.orange.background,
        width: 40,
        height: 40,
        borderRadius: 8,
        borderColor: colors.imageButton.orange.border,
        borderWidth: 1,
    },
    sectionTitle: {
        ...fonts.textSizeL28,
        color: colors.card.text.mainContent,
    },
    sectionDescription: {
        ...fonts.textSizeSL,
        color: colors.card.text.mainContent,
    },
});

export default baseStyles;

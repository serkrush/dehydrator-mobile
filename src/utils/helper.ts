import {Alert, Dimensions, Linking, Platform} from 'react-native';
import {thicknessesValues} from 'src/constants';
import {PolynomialRegression} from 'ml-regression-polynomial';
import {RESULTS} from 'react-native-permissions';
import {EPermissionTypes, usePermissions} from './usePermissions';
import {useTranslation} from 'react-i18next';

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const goToSettings = () => {
    if (isIos) {
        Linking.openURL('app-settings:');
    } else {
        Linking.openSettings();
    }
};

export const getWindowWidth = Dimensions.get('window').width;
export const getWindowHeight = Dimensions.get('window').height;
export function isEmpty(obj: any) {
    return (
        [Object, Array].includes((obj || {}).constructor) &&
        !Object.entries(obj || {}).length
    );
}
export const isNumber = value =>
    value && isNaN(Number(value)) ? 'Must be a number' : undefined;

export function isFunction(obj: any) {
    return typeof obj === 'function';
}

// export function convertToHoursMinutes(
//     minutes: number,
//     compactFormat?: boolean,
// ): string {
//     const hours = Math.floor(minutes / 60);
//     const mins = Math.floor(minutes % 60);
//     if (compactFormat) {
//         return `${hours}:${mins.toString().padStart(2, '0')}`;
//     }
//     return `${hours} hrs ${mins} mins`;
// }

function calculateExpectedDryingTimes(
    baseTime: number,
    thicknesses: number[],
): number[] {
    console.log('calculateExpectedDryingTimes baseTime', baseTime);
    return thicknesses.map(
        thickness => (baseTime * Math.log(thickness)) / Math.log(5),
    );
}

export function convertToHoursMinutes(
    minutes: number,
    compactFormat?: boolean,
): string {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (compactFormat) {
        return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${hours} hrs ${mins} mins`;
}
export function fitPolynomialRegression(
    // fruitName: string,
    baseTime: number,
    moistureContent: number,
    thickness: number,
) {
    console.log('fitPolynomialRegression baseTime', baseTime);
    console.log('fitPolynomialRegression thicknesses', thicknessesValues);
    const expectedTimes = calculateExpectedDryingTimes(
        baseTime,
        thicknessesValues,
    );
    console.log('fitPolynomialRegression expectedTimes', expectedTimes);

    // Polynomial Regression (degree 4 for better fit)
    const regression = new PolynomialRegression(
        thicknessesValues,
        expectedTimes,
        4,
    );
    console.log('fitPolynomialRegression regression', regression);

    // Predicting drying times
    const predictedTimes = thicknessesValues.map(thickness =>
        Math.round(regression.predict(thickness)),
    );

    // Convert predicted times to hours and minutes
    const predictedTimesHM = predictedTimes.map(time =>
        convertToHoursMinutes(time),
    );
    return predictedTimes[thickness - 1];
}
// export function fitPolynomialRegression(
//     // fruitName: string,
//     baseTime: number,
//     moistureContent: number,
//     thickness: number,
// ) {
//     const expectedTimes = calculateExpectedDryingTimes(baseTime, thicknessesValues);
//     console.log('fitPolynomialRegression expectedTimes', expectedTimes)

//     const regression = new PolynomialRegression(thicknessesValues, expectedTimes, 4);
//     // [ [27, 25] ]
//     console.log('fitPolynomialRegression regression !!!->', regression)
//     return 10

//     // // Predicting drying times
//     // const predictedTimes = thicknessesValues.map((thickness) =>
//     //     Math.round(regression.predict(thickness)),
//     // );

//     // // Convert predicted times to hours and minutes
//     // const predictedTimesHM = predictedTimes.map((time) =>
//     //     convertToHoursMinutes(time),
//     // );
//     // return predictedTimes[thickness - 1];
// }
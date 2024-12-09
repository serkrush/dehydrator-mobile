const kgToLbCoef = 2.2;
const sqMToSqFtCoef = 10.7639;

const temperatureConvert = (
    value: number,
    isMetricToImperial: boolean = true,
) => {
    if (isMetricToImperial) {
        return (value * 9) / 5 + 32;
    } else {
        return ((value - 32) * 5) / 9;
    }
};

const weightConvert = (value: number, isMetricToImperial: boolean = true) => {
    return isMetricToImperial ? value * kgToLbCoef : value / kgToLbCoef;
};

const areaConvert = (value: number, isMetricToImperial: boolean = true) => {
    return isMetricToImperial ? value * sqMToSqFtCoef : value / sqMToSqFtCoef;
};

export {temperatureConvert, weightConvert, areaConvert};

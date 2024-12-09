import {capitalize} from './capitalize';

export const capitalizeEachWord = (str: string, separator = ' ') => {
    const parts = str.split(separator);

    let res = '';
    parts.forEach((part, index) => {
        if (index != 0) {
            res += separator + capitalize(part);
        } else {
            res += capitalize(part);
        }
    });

    return res;
};

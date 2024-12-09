import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BookmarkSvg = ({
    stroke = '#ED8A24' as ColorValue,
    fill = '#ED8A24' as ColorValue,
    width = 14,
    height = 18,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 14 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
                d="M1.1665 5.5C1.1665 4.09987 1.1665 3.3998 1.43899 2.86503C1.67867 2.39462 2.06112 2.01217 2.53153 1.77248C3.0663 1.5 3.76637 1.5 5.1665 1.5H8.83317C10.2333 1.5 10.9333 1.5 11.4682 1.77248C11.9386 2.01217 12.321 2.39462 12.5607 2.86503C12.8332 3.3998 12.8332 4.09987 12.8332 5.5V16.5L6.99984 13.1667L1.1665 16.5V5.5Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default BookmarkSvg;
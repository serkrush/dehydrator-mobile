import React from 'react';
import {ColorValue} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const ArrowRightSvg = ({
    stroke = '#022833' as ColorValue,
    width = 8,
    height = 14,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
                d="M1 13L7 7L1 1"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default ArrowRightSvg;

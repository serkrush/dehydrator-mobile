import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PlusSvg = ({
    stroke = 'white' as ColorValue,
    strokeWidth = 2,
    width = 16,
    height = 16,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M8 1V15M1 8H15"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default PlusSvg;

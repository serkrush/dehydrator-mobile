import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const CheckSvg = ({
    stroke = '#0A4C5E' as ColorValue,
    width = 20,
    height = 20,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M20.285 6.23865C20.5658 6.5194 20.5658 6.99124 20.285 7.27198L10.285 17.272C10.0043 17.5527 9.53244 17.5527 9.2517 17.272L4.2517 12.272C3.971 11.9912 3.971 11.5194 4.2517 11.2387C4.53244 10.958 5.00429 10.958 5.28503 11.2387L9.76888 15.7226L19.2517 6.23865C19.5324 5.95791 20.0043 5.95791 20.285 6.23865Z"
                stroke={stroke}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default CheckSvg;

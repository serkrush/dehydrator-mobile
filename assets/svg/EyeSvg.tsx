import React from 'react';
import {ColorValue} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const EyeSvg = ({
    stroke = '#0A4C5E' as ColorValue,
    width = 20,
    height = 20,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
                d="M2.01677 10.5947C1.90329 10.4149 1.84654 10.3251 1.81477 10.1865C1.79091 10.0824 1.79091 9.91824 1.81477 9.81416C1.84654 9.67558 1.90329 9.58574 2.01677 9.40599C2.95461 7.92103 5.74617 4.16699 10.0003 4.16699C14.2545 4.16699 17.0461 7.92103 17.9839 9.40599C18.0974 9.58574 18.1542 9.67558 18.1859 9.81416C18.2098 9.91824 18.2098 10.0824 18.1859 10.1865C18.1542 10.3251 18.0974 10.4149 17.9839 10.5947C17.0461 12.0797 14.2545 15.8337 10.0003 15.8337C5.74617 15.8337 2.95461 12.0797 2.01677 10.5947Z"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M10.0005 12.5C11.3812 12.5 12.5005 11.3807 12.5005 10C12.5005 8.61925 11.3812 7.5 10.0005 7.5C8.61974 7.5 7.50049 8.61925 7.50049 10C7.50049 11.3807 8.61974 12.5 10.0005 12.5Z"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default EyeSvg;

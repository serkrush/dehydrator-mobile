import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const HeartSvg = ({
    fill = '#ED8A24' as ColorValue,
    stroke = '#ED8A24' as ColorValue,
    strokeWidth = 1.5,
    width = 16,
    height = 14,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.99437 3.29753C8.31302 1.33194 5.50933 0.803194 3.40276 2.60309C1.29619 4.40298 0.999624 7.41234 2.65392 9.54107C4.02936 11.311 8.19191 15.0438 9.55617 16.252C9.70879 16.3872 9.78515 16.4547 9.87412 16.4813C9.95182 16.5045 10.0368 16.5045 10.1145 16.4813C10.2035 16.4547 10.2799 16.3872 10.4325 16.252C11.7967 15.0438 15.9593 11.311 17.3347 9.54107C18.989 7.41234 18.7287 4.38406 16.5859 2.60309C14.4431 0.822132 11.6756 1.33194 9.99437 3.29753Z"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default HeartSvg;
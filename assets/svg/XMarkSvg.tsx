import React from 'react';
import {ColorValue} from 'react-native';
import Svg, {Path} from 'react-native-svg';

const XMarkSvg = ({
    fill = '#1A1A1A' as ColorValue,
    width = 13,
    height = 13,
    fillOpacity = 0.5,
}) => {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <Path
                d="M1.87793 0.18457L6.88184 5.21582L11.8857 0.211914C12.1318 -0.0615234 12.542 -0.0615234 12.8154 0.211914C13.0615 0.458008 13.0615 0.868164 12.8154 1.11426L7.78418 6.14551L12.7881 11.1494C13.0615 11.3955 13.0615 11.8057 12.7881 12.0518C12.542 12.3252 12.1318 12.3252 11.8857 12.0518L6.85449 7.04785L1.85059 12.0518C1.60449 12.3252 1.19434 12.3252 0.948242 12.0518C0.674805 11.8057 0.674805 11.3955 0.948242 11.1221L5.95215 6.11816L0.948242 1.11426C0.674805 0.868164 0.674805 0.458008 0.948242 0.18457C1.19434 -0.0615234 1.60449 -0.0615234 1.87793 0.18457Z"
                fill={fill}
                fillOpacity={fillOpacity}
            />
        </Svg>
    );
};

export default XMarkSvg;

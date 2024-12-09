import React from 'react';
import { ColorValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const NotificationSvg = ({
    stroke = '#ED8A24' as ColorValue, // Default stroke color
    width = 24,
    height = 24,
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
                d="M9.35395 21C10.0591 21.6224 10.9854 22 11.9998 22C13.0143 22 13.9405 21.6224 14.6456 21M17.9998 8C17.9998 6.4087 17.3677 4.88258 16.2425 3.75736C15.1172 2.63214 13.5911 2 11.9998 2C10.4085 2 8.88236 2.63214 7.75714 3.75736C6.63192 4.88258 5.99978 6.4087 5.99978 8C5.99978 11.0902 5.22025 13.206 4.34944 14.6054C3.61491 15.7859 3.24764 16.3761 3.2611 16.5408C3.27602 16.7231 3.31464 16.7926 3.46155 16.9016C3.59424 17 4.19237 17 5.38863 17H18.611C19.8072 17 20.4054 17 20.538 16.9016C20.685 16.7926 20.7236 16.7231 20.7385 16.5408C20.752 16.3761 20.3847 15.7859 19.6502 14.6054C18.7793 13.206 17.9998 11.0902 17.9998 8Z"
                stroke={stroke} // Default stroke color
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default NotificationSvg;

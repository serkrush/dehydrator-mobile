// import './spinner.scss';
import React from 'react';
import {View} from 'react-native';
import {FaSpinner} from 'src/components/FaIcons/icons';

export interface IPreloaderProps {
    wrapperClassName: string;
    active?: boolean;
    color?: string;
    size?: string;
    parentBackGroundShadow?: boolean;
    children?: any;
}
// if you need a parent center then add props wrapperClassName='w-full h-full'

function Preloader(props: IPreloaderProps) {
    const {
        wrapperClassName,
        color = 'black',
        size = '24px',
        active = false,
        parentBackGroundShadow = false,
        children,
    } = props;
    return (
        <View
            className={`spinner flex flex-col items-center justify-center z-max ${
                parentBackGroundShadow
                    ? 'spinnerBackGround absolute top-0 left-0 '
                    : ''
            } ${!active ? 'hidden' : ''} ${wrapperClassName || ''}`}>
            {children || (
                <FaSpinner className="" size={`${size}`} color={`${color}`} />
            )}
        </View>
    );
}

export default Preloader;

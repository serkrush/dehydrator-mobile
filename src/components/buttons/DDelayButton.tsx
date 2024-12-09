import React from 'react';
import {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    ColorValue,
    ImageSourcePropType,
    ImageStyle,
    StyleProp,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {useSelector} from 'react-redux';
import ContainerContext from 'src/ContainerContext';
import {AppState, RequestStatus} from 'src/constants';
import DUpdatedButton, {ButtonStyle} from './DUpdatedButton';
import {CheckType} from '../SpinnerBase';

type ButtonSubmittingType = {
    onPress?: (...args: any) => void;
    disabled?: boolean;

    containerStyle?: StyleProp<ViewStyle>;

    text?: string;
    textStyle?: StyleProp<TextStyle>;

    source?: ImageSourcePropType;
    imageStyle?: StyleProp<ImageStyle>;
    tintColor?: ColorValue;
    useTintColor?: boolean;
    imageHeight?: number;
    imageWidth?: number;
    changeDisabledOpacity?: boolean;
    reverse?: boolean;

    baseStyle?: ButtonStyle;
    delay?: number;
};

export const DDelayButton = ({
    onPress = () => {},
    disabled = false,
    containerStyle = {},

    text,
    textStyle = {},

    source,
    imageStyle = {},
    tintColor,
    useTintColor = true,
    imageHeight = 18,
    imageWidth = 18,
    changeDisabledOpacity = true,
    reverse,

    baseStyle,
    delay = 5000,
}: ButtonSubmittingType) => {
    const di = useContext(ContainerContext);
    const t = di.resolve('t');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const delayOnPress = () => {
        onPress();
        setIsSubmitting(true);
        const timeout = setInterval(() => {
            clearTimeout(timeout);
            setIsSubmitting(false);
        }, delay);
    };

    return (
        <DUpdatedButton
            onPress={delayOnPress}
            containerStyle={containerStyle}
            text={text}
            disabled={isSubmitting || disabled}
            textStyle={[textStyle, {alignSelf: 'center'}]}
            source={source}
            imageStyle={imageStyle}
            tintColor={tintColor}
            useTintColor={useTintColor}
            imageHeight={imageHeight}
            imageWidth={imageWidth}
            changeDisabledOpacity={changeDisabledOpacity}
            reverse={reverse}
            showActivity={isSubmitting}
            baseStyle={baseStyle}
        />
    );
};

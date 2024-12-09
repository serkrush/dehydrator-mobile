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
    entityName: CheckType;
    actionType: string;
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
};

export const DButtonSubmitting = ({
    entityName,
    actionType,
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
}: ButtonSubmittingType) => {
    const di = useContext(ContainerContext);
    const t = di.resolve('t');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const requestStatuses = useSelector(
        (state: AppState) => state.requestStatus,
    );
    const requestData = requestStatuses[entityName];
    useEffect(() => {
        if (requestData) {
            if (requestData.status === RequestStatus.LOADING) {
                if (requestData.actionType === actionType) {
                    setIsSubmitting(true);
                } else {
                    setIsDisabled(true);
                }
            } else if (
                requestData.status === RequestStatus.SUCCESS ||
                requestData.status === RequestStatus.ERROR
            ) {
                if (requestData.actionType === actionType) {
                    setIsSubmitting(false);
                } else {
                    setIsDisabled(false);
                }
            }
        }
    }, [requestStatuses]);

    return (
        <DUpdatedButton
            onPress={onPress}
            containerStyle={containerStyle}
            text={text}
            disabled={isDisabled || isSubmitting || disabled}
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

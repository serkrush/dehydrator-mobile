import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import container from 'src/container';
import baseStyles from 'src/styles';
import {colors, fonts} from 'src/theme';
import {images} from 'src/theme/images';
import DUpdatedButton, {
    ButtonProps as buttonProps,
} from '../buttons/DUpdatedButton';
import DImageButton, {
    ButtonProps as imageButtonProps,
} from '../buttons/DUpdatedImageButton';
import ContextMenu from './ContextMenu';

export enum ViewType {
    Button,
    ImageButton,
    Element,
}

export interface ViewProps {
    type: ViewType;
    value: imageButtonProps | buttonProps | React.JSX.Element;
}

export enum HeaderButtonsType {
    Buttons,
    ContextMenu,
}

interface HeaderProps {
    showBackButton?: boolean;
    backAction?: () => void;

    leftButtons?: ViewProps[];
    rightButtons?: ViewProps[];

    title?: string;
    titleStyle?: StyleProp<TextStyle>;

    containerStyle?: StyleProp<ViewStyle>;
    titleContainer?: StyleProp<ViewStyle>;
    leftButtonsContainer?: StyleProp<ViewStyle>;
    rightButtonsContainer?: StyleProp<ViewStyle>;
    rightButtonsType?: HeaderButtonsType;
}

export default function Header({
    showBackButton = false,
    backAction = () => {
        container.resolve('navigator').pop();
    },

    leftButtons = [],
    rightButtons = [],

    title = undefined,
    titleStyle = {},

    containerStyle = {},
    titleContainer = {},
    leftButtonsContainer = {},
    rightButtonsContainer = {},
    rightButtonsType = HeaderButtonsType.Buttons,
}: HeaderProps) {
    const {t} = useTranslation();
    const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.buttonsContainer, leftButtonsContainer]}>
                {showBackButton && (
                    <DImageButton
                        source={images.arrows.left}
                        imageWidth={24}
                        imageHeight={24}
                        tintColor={colors.imageButton.outlined.content}
                        containerStyle={[
                            baseStyles.backButton,
                            {
                                shadowOpacity: 0,
                                shadowColor: 'clear',
                                shadowOffset: {width: 0, height: 0},
                                elevation: 0,
                            },
                        ]}
                        onPress={backAction}
                    />
                )}
                {leftButtons.map(value => {
                    switch (value.type) {
                        case ViewType.Button:
                            return DUpdatedButton(value.value as buttonProps);
                        case ViewType.ImageButton:
                            return DImageButton(
                                value.value as imageButtonProps,
                            );
                        case ViewType.Element:
                            return <>{value.value}</>;
                    }
                })}
            </View>
            <View style={[styles.titleContainer, titleContainer]}>
                <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
                {rightButtonsType === HeaderButtonsType.Buttons && (
                    <View
                        style={[
                            styles.buttonsContainer,
                            rightButtonsContainer,
                        ]}>
                        {rightButtons.map(value => {
                            switch (value.type) {
                            case ViewType.Button:
                                return DUpdatedButton(
                                        value.value as buttonProps,
                                );
                            case ViewType.ImageButton:
                                return DImageButton(
                                        value.value as imageButtonProps,
                                );
                            case ViewType.Element:
                                return <>{value.value}</>;
                            }
                        })}
                    </View>
                )}
            </View>

            {rightButtonsType === HeaderButtonsType.ContextMenu && (
                <View style={[styles.buttonsContainer]}>
                    <DImageButton
                        source={images.threeDots}
                        imageWidth={24}
                        imageHeight={24}
                        tintColor={colors.imageButton.outlined.content}
                        containerStyle={[
                            baseStyles.backButton,
                            {
                                shadowOpacity: 0,
                                shadowColor: 'clear',
                                shadowOffset: {width: 0, height: 0},
                                elevation: 0,
                                borderWidth: 0,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                            },
                        ]}
                        onPress={() => setIsContextMenuVisible(true)}
                    />
                </View>
            )}
            {rightButtonsType === HeaderButtonsType.ContextMenu && (
                <ContextMenu
                    isVisible={isContextMenuVisible}
                    actions={rightButtons}
                    handleClose={() => setIsContextMenuVisible(false)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },

    titleContainer: {
        alignSelf: 'center',
        flex: 1,
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },

    buttonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },

    titleStyle: {
        ...fonts.h2,
        color: colors.header.text.main,
        lineHeight: undefined,
    },

    imageButton: {
        backgroundColor: colors.imageButton.primary.background,
        width: 40,
        height: 40,
        borderRadius: 100,
    },
});

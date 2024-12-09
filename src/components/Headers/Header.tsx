import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    StyleProp,
    TextStyle,
    ColorValue,
    ViewStyle,
} from 'react-native';
import {colors, families, fonts} from 'src/theme';
import DImageButton from '../buttons/DImageButton';
import {images} from 'src/theme/images';
import container from 'src/container';
import DTextButton from '../buttons/DTextButton';

export default function Header({
    title,
    titleStyle = styles.title as StyleProp<TextStyle>,
    titleContainerStyle = styles.container as StyleProp<ViewStyle>,
    onBackPress = () => {
        container.resolve('navigator').pop();
    },
    back = false,
    separator = true,
    rightButtonText = undefined as string | undefined,
    rightButtonPress = undefined as any | undefined,
    buttonTintColor = 'white' as ColorValue,

    rightButton = undefined as any | undefined,
}) {
    return (
        <View style={{paddingTop: 4}}>
            <View style={[styles.header]}>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignContent: 'space-between',
                    }}>
                    <View style={[{/*flex: 1, */ justifyContent: 'center'}]}>
                        {back && (
                            <DImageButton
                                tintColor={buttonTintColor}
                                onPress={onBackPress}
                                source={images.arrows.back}
                                width={20}
                                height={20}
                            />
                        )}
                    </View>
                    <View
                        style={[
                            {
                                minWidth: '40%',
                                maxWidth: '60%',
                                justifyContent: 'center',
                            },
                        ]}>
                        <View style={[titleContainerStyle]}>
                            <Text style={[titleStyle]}>{title}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        alignContent: 'flex-end',
                    }}>
                    {rightButton}
                    {rightButton == undefined && rightButtonText && (
                        <View style={[styles.container, {padding: 12}]}>
                            <DTextButton
                                onPress={rightButtonPress}
                                text={rightButtonText}
                                textStyle={{
                                    color: buttonTintColor,
                                    fontSize: 14,
                                }}
                            />
                        </View>
                    )}
                </View>
            </View>
            {separator && (
                <View
                    style={{
                        width: '100%',
                        height: 0,
                        borderBottomWidth: 2,
                        borderBottomColor: 'white',
                        paddingTop: 8,
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 44,
    },

    container: {
        backgroundColor: '#f5f6f240',
        borderRadius: 100,
        paddingHorizontal: 8,
    },

    title: {
        textAlign: 'center',
        fontFamily: families.oswald,
        fontSize: 30,
        fontWeight: '500',
        color: colors.header.text.main,
    },
});

import React, {useMemo} from 'react';
import {
    StyleSheet,
    Text,
    View,
    StyleProp,
    ViewStyle,
    TextStyle,
    DimensionValue,
    Image,
    ImageSourcePropType,
    AppState,
} from 'react-native';
import {fonts} from 'src/theme';
import baseStyles from 'src/styles';
import DDropdown from '../DDropdown';
import TitleDropdown from '../TitleDropdown';

import {Dropdown} from 'react-native-element-dropdown';
import {images} from 'src/theme/images';
import palette from 'src/theme/colors/palette';
import {useSelector} from 'react-redux';
import {ENTITY} from 'src/constants';
import ImageStore from '../ImageStore';

export default function AccessDropdownRow({
    resourceLabel,
    data,
    value,
    setValue,
    placeholder,
    textStyle = {} as StyleProp<TextStyle>,
    dropdownContainerStyle = {} as StyleProp<ViewStyle>,
    dropdownTextStyle = {} as StyleProp<TextStyle>,
    dropdownPlaceholderTextStyle = undefined as StyleProp<TextStyle>,
    dropdownWidth = undefined as DimensionValue | undefined,
    modelId = '',

    imageSource = undefined as ImageSourcePropType | undefined,
}) {
    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });
    const image = useMemo(() => {
        const currentModel = models[modelId];
        if (currentModel && currentModel.mediaResources) {
            return currentModel.mediaResources;
        }
        return '';
    }, [models, modelId]);

    const renderItem = item => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                    paddingHorizontal: 16,
                    alignItems: 'center',
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.dropdownText, dropdownTextStyle]}>
                        {item.label}
                    </Text>
                </View>
                {item.value === value && (
                    <Image
                        source={images.checkMark}
                        style={{height: 20, width: 20}}
                    />
                )}
            </View>
        );
    };

    const richData = data.map(value => {
        return {...value, resourceLabel: value.label + ' | ' + resourceLabel};
    });

    return (
        <>
            <Dropdown
                data={richData}
                style={[styles.dropdownContainer, dropdownContainerStyle]}
                placeholderStyle={[
                    styles.dropdownText,
                    dropdownPlaceholderTextStyle ?? dropdownTextStyle,
                ]}
                selectedTextStyle={[styles.dropdownText, dropdownTextStyle]}
                maxHeight={300}
                placeholder={placeholder}
                value={value}
                onChange={item => {
                    setValue(item.value);
                }}
                labelField={'resourceLabel'}
                valueField={'value'}
                renderItem={renderItem}
                // renderLeftIcon={() => {
                //     return renderLeftIcon(value);
                // }}
                renderLeftIcon={() => {
                    if (!imageSource) {
                        return <View />;
                    }
                    return (
                        <View
                            style={{
                                width: 60,
                                height: 60,
                            }}>
                            <ImageStore
                                folder={`models/${modelId}`}
                                style={{
                                    height: 48,
                                    width: 50,
                                    resizeMode: 'contain',
                                }}
                                name={image}
                            />
                        </View>
                    );
                }}
                iconStyle={[{width: 30, height: 30}]}
            />
            {/* <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Text
                    style={[{maxWidth: '55%'}, baseStyles.baseText, textStyle]}>
                    {title}
                </Text>
                <View style={{width: dropdownWidth ? dropdownWidth : '45%'}}>
                    <DDropdown
                        data={data}
                        value={value}
                        setValue={setValue}
                        placeholder={placeholder}
                        containerStyle={dropdownContainerStyle}
                        textStyle={dropdownTextStyle}
                        placeholderTextStyle={dropdownPlaceholderTextStyle}
                    />
                </View>
            </View> */}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        backgroundColor: '#303030',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 16,
    },

    text: {
        fontSize: 14,
        color: 'white',
    },

    dropdownContainer: {
        // height: 48,
        // borderRadius: 24,
        // backgroundColor: '#f5f6f2',
        // width: '100%',
        // alignContent: 'center',
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    dropdownText: {
        // fontSize: 30,
        // fontFamily: families.oswald,
        // textAlign: 'center',
    },
});

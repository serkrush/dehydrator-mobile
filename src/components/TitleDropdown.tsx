import React from 'react';
import {
    Image,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {images} from 'src/theme/images';

export default function TitleDropdown({
    data,
    title = '',
    placeholder,
    value,
    setValue,
    containerStyle = {} as StyleProp<ViewStyle>,
    dropdownContainerStyle = {} as StyleProp<ViewStyle>,
    titleTextStyle = {} as StyleProp<TextStyle>,
    valueTextStyle = {} as StyleProp<TextStyle>,
    placeholderTextStyle = undefined as StyleProp<TextStyle>,
    labelField = 'label',
    valueField = 'value',
    disable = false,

    showLeftIcon = false,
    imagesPath = undefined as undefined | string[],
    imagesPrefix = '',
}) {
    const renderLeftIcon = itemValue => {
        if (
            !showLeftIcon ||
            itemValue == undefined ||
            imagesPath == undefined
        ) {
            return <View />;
        }

        let ref = images;
        let refValid = true;
        imagesPath.forEach(el => {
            if (ref != undefined && ref[el] != undefined) {
                ref = ref[el];
            } else {
                refValid = false;
            }
        });

        let source = refValid ? ref[`${imagesPrefix}${itemValue}`] : undefined;

        if (source == undefined) {
            return <View />;
        }
        return (
            <View style={{paddingRight: 8}}>
                <Image
                    source={source}
                    style={{
                        height: 20,
                        width: 20,
                    }}
                />
            </View>
        );
    };

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
                    {renderLeftIcon(item.value)}
                    <Text style={[styles.dropdownText, valueTextStyle]}>
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

    return (
        <View style={{gap: 4}}>
            {title && <Text style={titleTextStyle}>{title}</Text>}
            <View style={containerStyle}>
                <Dropdown
                    disable={disable}
                    data={data}
                    style={[styles.dropdownContainer, dropdownContainerStyle]}
                    placeholderStyle={[
                        styles.dropdownText,
                        placeholderTextStyle ?? valueTextStyle,
                    ]}
                    selectedTextStyle={[styles.dropdownText, valueTextStyle]}
                    maxHeight={300}
                    labelField={labelField}
                    valueField={valueField}
                    placeholder={placeholder}
                    value={value}
                    onChange={item => {
                        setValue(item.value);
                    }}
                    renderItem={renderItem}
                    renderLeftIcon={() => {
                        return renderLeftIcon(value);
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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

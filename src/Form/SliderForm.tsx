import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Slider from 'react-native-slider';
import palette from 'src/theme/colors/palette';

interface SliderFormProps {
    ticks: number[];
    minimumValue: number;
    maximumValue: number;
    step?: number;
    label?: string;
    value: number;
    handleChange: (value) => void;
}

export default function SliderForm({
    ticks,
    minimumValue,
    maximumValue,
    step = 1,
    label = '',
    value,
    handleChange
}: SliderFormProps) {
    // const [vvalue, setValue] = useState(value);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View>
                <View style={{zIndex: 10}}>
                    <Slider
                        value={value}
                        onValueChange={handleChange}
                        minimumValue={minimumValue}
                        maximumValue={maximumValue}
                        step={step}
                        thumbStyle={styles.thumb}
                        trackStyle={styles.track}
                        minimumTrackTintColor={palette.midGray}
                        maximumTrackTintColor={palette.midGray}
                    />
                </View>
                <View style={styles.ticksContainer}>
                    {ticks.map((tick, index) => (
                        <View key={index} style={styles.tickMark} />
                    ))}
                </View>
                <View style={styles.labelsContainer}>
                    <Text style={styles.labelText}>Less</Text>
                    <Text style={styles.labelText}>More</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 20,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: palette.lightGray,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: palette.blueDark,
        // marginBottom: 15,
    },
    thumb: {
        width: 17,
        height: 17,
        backgroundColor: palette.white,
        borderRadius: 10,
        borderColor: palette.orange,
        borderWidth: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    track: {
        height: 1,
        borderRadius: 2,
    },
    ticksContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        width: '100%',
        top: 16,
    },
    tickMark: {
        width: 1,
        height: 7,
        backgroundColor: palette.midGray,
    },
    labelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 5,
    },
    labelText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#5E675A80',
    },
});

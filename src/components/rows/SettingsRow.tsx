import React from 'react';
import {StyleSheet, TouchableOpacity, Text, Image, View} from 'react-native';
import container from 'src/container';
import {colors, fonts} from 'src/theme';
import palette from 'src/theme/colors/palette';
import {images} from 'src/theme/images';

const settingsRowColor = {
    container: colors.card.base,
    content: colors.card.text.mainContent,
};

export default function SettingsRow({
    option,
    disabled = false,
    changeDisabledOpacity = true,
}: {
    option;
    disabled?: boolean;
    changeDisabledOpacity?: boolean;
}) {
    const navigator = container.resolve('navigator');
    const t = container.resolve('t');
    return (
        <TouchableOpacity
            disabled={disabled}
            key={option}
            style={[
                styles.container,
                {opacity: disabled && changeDisabledOpacity ? 0.5 : 1},
            ]}
            onPress={() => {
                navigator.navigate(`${option}`);
            }}>
            <View style={{flexDirection: 'row', gap: 16, alignItems: 'center'}}>
                <Image
                    tintColor={settingsRowColor.content}
                    source={images.settings[option]}
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: settingsRowColor.content,
                    }}
                />
                <Text style={styles.text}>{t(option)}</Text>
            </View>
            <View>
                <Image
                    tintColor={settingsRowColor.content}
                    source={images.arrows.right}
                    style={{
                        width: 20,
                        height: 20,
                        tintColor: settingsRowColor.content,
                    }}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 56,
        borderRadius: 4,
        backgroundColor: settingsRowColor.container.background,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 10,

        shadowColor: settingsRowColor.container.shadow,
        shadowOpacity: 1,
        shadowOffset: {width: 0, height: -2},
        elevation: 2,
    },

    text: {
        ...fonts.textSizeML,
        color: settingsRowColor.content,
    },
});

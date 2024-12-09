import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import BaseScreenLayout from './BaseUpdatedScreenLayout';
import {colors, fonts} from 'src/theme';
import baseStyles from 'src/styles';
import DSvgButton from '../buttons/DSvgButton';
import ArrowLeftSvg from '../../../assets/svg/ArrowLeftSvg';
import palette from 'src/theme/colors/palette';

const machinesScreenColors = {
    backgroundColor: colors.mainBackground,
    sectionText: colors.header.text.main,
    groupText: colors.header.text.main,
};
interface LayoutProps {
    children: React.ReactNode;
    onBackPress: () => void;
    titleText: string;
    buttonBlock?: React.ReactNode;
    cleanSocketSubscriptions?: boolean;
}

function Layout({
    children,
    onBackPress,
    titleText,
    buttonBlock,
    cleanSocketSubscriptions,
}: LayoutProps) {
    return (
        <BaseScreenLayout
            cleanSocketSubscriptions={cleanSocketSubscriptions}
            style={{backgroundColor: machinesScreenColors.backgroundColor}}
            containerStyle={{paddingHorizontal: 16}}>
            <View style={{paddingTop: 8, flex: 1}}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: 16,
                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            gap: 8,
                            flexShrink: 1,
                        }}>
                        <DSvgButton
                            svg={
                                <ArrowLeftSvg
                                    stroke={palette.blueBlack}
                                    width={6}
                                    height={12}
                                />
                            }
                            additionalStyle={baseStyles.backButton}
                            onPress={onBackPress}
                        />
                        <View
                            style={{
                                alignSelf: 'flex-end',
                                flexShrink: 1,
                            }}>
                            <Text
                                style={[styles.sectionText]}
                                numberOfLines={1}
                                ellipsizeMode="tail">
                                {titleText}
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            flexShrink: 0,
                            flexGrow: 1,
                            alignItems: 'flex-end',
                        }}>
                        {buttonBlock}
                    </View>
                </View>
                <View style={styles.container}>{children}</View>
            </View>
        </BaseScreenLayout>
    );
}

export default Layout;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    sectionText: {
        ...fonts.h2,
        color: machinesScreenColors.sectionText,
    },
});

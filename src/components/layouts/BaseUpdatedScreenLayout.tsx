import React, {useEffect} from 'react';
import {View, ViewStyle} from 'react-native';
import baseStyles from 'src/styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useActions} from 'src/hooks/useEntity';

export default function BaseScreenLayout({
    style = {},
    containerStyle = {},
    children,
    cleanSocketSubscriptions = true,
}: {
    style?: ViewStyle;
    containerStyle?: ViewStyle;
    children: any;
    cleanSocketSubscriptions?: boolean;
}) {
    const {resubscribeOnDevicesUpdate} = useActions('MachineEntity');
    useEffect(() => {
        if (cleanSocketSubscriptions) {
            resubscribeOnDevicesUpdate({deviceIds: []});
        }
    }, []);

    return (
        <SafeAreaView style={[baseStyles.safeArea, style]}>
            <View style={[baseStyles.baseContainer, containerStyle]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

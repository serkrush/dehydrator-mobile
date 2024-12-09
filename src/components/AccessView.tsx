import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
    TextStyle,
    ImageSourcePropType,
} from 'react-native';
import {colors, families, fonts} from 'src/theme';
import {PermissionLevel} from 'src/constants';
import {useTranslation} from 'react-i18next';
import DImageButton from './buttons/DImageButton';
import {images} from 'src/theme/images';
import palette from 'src/theme/colors/palette';
import AccessDropdownRow from './rows/AccessDropdownRow';

export default function AccessView({
    accessiblePermissions,
    access,
    resource,
    resourceLabel,
    imageSource = undefined as ImageSourcePropType | undefined,
    dropdownContainerStyle = {} as StyleProp<ViewStyle>,
    dropdownTextStyle = {} as StyleProp<TextStyle>,
    onEditPress = item => {},
    onDeletePress = item => {},
    modelId = '',
    onPermissionChange,
    isLast,
}) {
    const {t} = useTranslation();
    const [permission, setPermission] = useState(
        access.permissionLevel ?? PermissionLevel.Viewer,
    );

    const [currentResource, setCurrentResource] = useState(resource);

    const setNewPermission = value => {
        setPermission(value);
        onPermissionChange(currentResource, value);
    };

    useEffect(() => {
        setPermission(access.permissionLevel ?? PermissionLevel.Viewer);
    }, [access]);

    useEffect(() => {
        setCurrentResource(resource);
    }, [resource]);

    return (
        <View
            style={[
                {
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                },
                isLast
                    ? {}
                    : {
                          borderBottomColor: colors.card.base.border,
                          borderBottomWidth: 1,
                      },
            ]}>
            <View
                style={{
                    width: 'auto',
                    minWidth: '75%',
                }}>
                <AccessDropdownRow
                    resourceLabel={resourceLabel}
                    placeholder={t('select-permissions')}
                    dropdownContainerStyle={[
                        {height: 80},
                        dropdownContainerStyle,
                    ]}
                    dropdownTextStyle={[
                        {
                            color: '#303030',
                            fontSize: 18,
                            fontFamily: families.oswald,
                        },
                        dropdownTextStyle,
                        styles.text,
                    ]}
                    modelId={modelId}
                    data={accessiblePermissions}
                    value={permission}
                    setValue={setNewPermission}
                    textStyle={styles.text}
                    imageSource={imageSource}
                />
            </View>

            <View
                style={[
                    {
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                    },
                ]}>
                <DImageButton
                    tintColor={'black'}
                    source={images.cardEdit}
                    height={20}
                    width={20}
                    onPress={() => {
                        onEditPress(resource);
                    }}
                />

                <DImageButton
                    tintColor={'red'}
                    source={images.delete}
                    height={20}
                    width={20}
                    onPress={() => {
                        onDeletePress(resource);
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        borderRadius: 24,
        backgroundColor: '#f5f6f2',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        ...fonts.textSizeM,
        color: palette.orange,
    },
});

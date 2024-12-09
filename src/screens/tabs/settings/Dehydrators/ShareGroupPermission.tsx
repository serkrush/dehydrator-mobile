import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, View} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';
import DropdownRow from 'src/components/rows/DropdownRow';
import FieldRow from 'src/components/rows/FieldRow';
import Header from 'src/components/Headers/Header';
import DButton from 'src/components/buttons/DButton';
import BaseSettingsScreenLayout from 'src/components/layouts/BaseSettingsScreenLayout';
import {
  PermissionLevel,
  Flag,
  superAdminLevels,
  ENTITY,
  RequestStatus,
} from 'src/constants';
import {IMachineGroup} from 'src/entities/models/MachineGroup';
import {useActions} from 'src/hooks/useEntity';
import baseStyles from 'src/styles';
import {families, fonts} from 'src/theme';
import dataFunc from 'src/utils/dropdownDataFunc';

const mapStateToProps = state => {
  let group = undefined as undefined | IMachineGroup;
  let spinnerActive = false;
  if (state && state.box) {
    group = state.groups[state.box[Flag.CurrentUpdatedGroupId]];
  }

  if (state && state.requestStatus && state.requestStatus[ENTITY.ACCESS]) {
    spinnerActive =
      state.requestStatus[ENTITY.ACCESS]?.status == RequestStatus.LOADING;
  }

  return {
    group,
    spinnerActive,
  };
};

function ShareGroupPermission({group, spinnerActive, route}) {
  const permissions = dataFunc(superAdminLevels, 'permissions');
  const {t} = useTranslation();

  const [email, setEmail] = useState('');
  const [permissionLevel, setPermissionsLevel] = useState(
    PermissionLevel.Viewer,
  );
  const [currentGroup, setCurrentGroup] = useState(group);

  const {sharePermissions} = useActions('MachineAccessEntity');

  useEffect(() => {
    setCurrentGroup(group);
  }, [group]);

  const onCancelPress = () => {};

  const onSendInvitePress = () => {
    sharePermissions({
      data: {
        email,
        machineGroupId: currentGroup.id,
        permissionLevel: permissionLevel,
      },
    });
  };

  return (
    <BaseSettingsScreenLayout>
      <Header
        title={t('share-group-permissions')}
        titleStyle={baseStyles.settingsTitle}
        back={true}
      />
      <View style={{flex: 1, justifyContent: 'space-between', paddingTop: 16}}>
        <View style={{gap: 12}}>
          <FieldRow
            fieldTitle={t('share-permissions') + ':'}
            fieldPlaceholder={t('placeholder-email')}
            value={email}
            setValue={setEmail}
            secureTextEntry={false}
          />
          <DropdownRow
            title={t(`level-of-permissions`) + ':'}
            placeholder={t(`select-permissions`).toUpperCase()}
            dropdownContainerStyle={{height: 36}}
            dropdownTextStyle={{
              color: '#303030',
              fontSize: 18,
              fontFamily: families.oswald,
            }}
            data={permissions}
            value={permissionLevel}
            setValue={setPermissionsLevel}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <DButton
            onPress={onCancelPress}
            style={{width: 120, height: 36}}
            textStyle={baseStyles.settingsUtilButtonText}
            text={t('cancel')}
          />
          <DButton
            onPress={onSendInvitePress}
            style={{width: 120, height: 36}}
            textStyle={baseStyles.settingsUtilButtonText}
            text={t('send-invite')}
          />
        </View>
      </View>
    </BaseSettingsScreenLayout>
  );
}

export default connect(mapStateToProps)(ShareGroupPermission);

const styles = StyleSheet.create({});

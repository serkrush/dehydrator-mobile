import React, {useContext, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import ContainerContext from 'src/ContainerContext';
import Header from 'src/components/Headers/UpdatedHeader';
import {
    AppState,
    ENTITY,
    Flag,
    SettingsOption,
    fanPercentage,
    percentageOptions,
} from 'src/constants';
import baseStyles from 'src/styles';
import {colors, fonts} from 'src/theme';
import BaseScreenLayout from 'src/components/layouts/BaseUpdatedScreenLayout';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFormik} from 'formik';
import {useSelector} from 'react-redux';
import {useActions} from 'src/hooks/useEntity';
import {AdvancedSettings, FunSpeed} from 'src/entities/models/Machine';
import Input from 'src/Form/Input';
import Multiselect from 'src/Form/Multiselect';
import TitleDropdown from 'src/components/TitleDropdown';
import BaseTitleDropdown from 'src/components/BaseTitleDropdown';
import DUpdatedButton, {
    ButtonStyle,
} from 'src/components/buttons/DUpdatedButton';
import DSpinner from 'src/components/DSpinner';
import Card from 'src/components/views/Card';
import DMachineRow from 'src/components/AdvancedSettings/DMachineRow';

export default function Advanced() {
    const {t} = useTranslation();

    const di = useContext(ContainerContext);
    const navigator = di.resolve('navigator');
    const config = di.resolve('config');

    const currentMachineId = useSelector((state: AppState) => {
        return state.box ? state.box[Flag.CurrentUpdatedMachineId] : undefined;
    });

    const machines = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE];
    });

    const machine = useMemo(() => {
        return machines[currentMachineId];
    }, [currentMachineId, machines]);

    const models = useSelector((state: AppState) => {
        return state[ENTITY.MACHINE_MODEL];
    });
    const model = models[machine.modelId];

    const initFan: FunSpeed[] = useMemo(() => {
        let res = [];
        machine?.fanSpeed?.forEach(value => {
            res.push({...value});
        });
        return res;
    }, [machine]);

    const initValues = useMemo(() => {
        console.log('Change init Values');
        return {
            fanSpeed: [...initFan],
            heatingIntensity: machine?.heatingIntensity,
        };
    }, [machine]);

    const {updateMachine, updateSettings} = useActions('MachineEntity');

    const onCancelPress = () => {
        formik.setFieldValue('fanSpeed', [...initFan]);
        formik.setFieldValue('heatingIntensity', machine.heatingIntensity);
    };

    const formik = useFormik({
        initialValues: initValues,
        validate: (values: AdvancedSettings) => {
            const errors: any = {};
            if (!values.fanSpeed) {
                errors.fanSpeed = t('required');
            }

            if (!values.heatingIntensity) {
                errors.heatingIntensity = t('required');
            }

            return errors;
        },
        onSubmit: values => {
            // updateMachine({
            //     data: {
            //         machineData: {...machine, ...values},
            //     },
            // });
            updateSettings({machineId: machine.id, settings: values});
        },
    });

    return (
        <BaseScreenLayout style={{backgroundColor: colors.mainBackground}}>
            <View style={{flex: 1, paddingTop: 4}}>
                <Header
                    title={t(SettingsOption.Advanced)}
                    showBackButton={true}
                />
                <View style={{paddingTop: 16, paddingBottom: 20}} key={machine.id}>
                    <DMachineRow
                        key={`row-${machine.id}`}
                        machine={machine}
                        modelInfo={model}
                    />
                </View>
                <ScrollView>
                    <View style={{justifyContent: 'space-between', flex: 1}}>
                        <Card style={{gap: 24}}>
                            {formik?.values?.fanSpeed?.length > 0 &&
                                formik?.values?.fanSpeed.map((value, index) => {
                                    return (
                                        <View key={`${index}`}>
                                            <BaseTitleDropdown
                                                data={fanPercentage}
                                                title={`${t('fan-speed')} | ${t(
                                                    formik.values.fanSpeed[
                                                        index
                                                    ].id,
                                                )}`}
                                                placeholder={t('fan-speed')}
                                                value={
                                                    formik?.values?.fanSpeed[
                                                        index
                                                    ]
                                                }
                                                setValue={data => {
                                                    const exist = [
                                                        ...formik.values
                                                            .fanSpeed,
                                                    ];
                                                    console.log(data);
                                                    exist[index].value = data;
                                                    formik.setFieldValue(
                                                        'fanSpeed',
                                                        [...exist],
                                                    );
                                                }}
                                            />
                                        </View>
                                    );
                                })}
                            <BaseTitleDropdown
                                data={percentageOptions}
                                title={t('heating')}
                                placeholder={t('heating')}
                                value={formik.values.heatingIntensity}
                                setValue={data => {
                                    formik.setFieldValue(
                                        'heatingIntensity',
                                        data,
                                    );
                                }}
                            />
                        </Card>
                    </View>
                </ScrollView>
                <View style={{gap: 8, paddingVertical: 16}}>
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Primary}
                        text={t('save')}
                        onPress={formik.handleSubmit}
                    />
                    <DUpdatedButton
                        baseStyle={ButtonStyle.Outlined}
                        text={t('cancel')}
                        onPress={onCancelPress}
                    />
                </View>
            </View>
            <DSpinner checkEntities={'MachineEntity'} />
        </BaseScreenLayout>
    );
}

const styles = StyleSheet.create({
    title: {
        ...fonts.textSizeL28,
        color: colors.card.text.h2,
    },
});

import React, {ReactNode, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {useTranslation} from 'react-i18next';
import Input from './Inputs/Input';
// import Select from './Inputs/Select';
import RadioContainer from './Inputs/RadioElements/RadioContainer';
import CheckContainer from './Inputs/CheckElements/CheckContainer';
import FilterReset from './Inputs/FilterReset';
import {
    FilterType,
    InputIcon,
    IOptions,
    IMultiselectOptions,
} from 'src/constants';
import Multiselect from './Inputs/Multiselect';
import Touche from './Inputs/Touche';
import Button from './Inputs/Button';
import SwitchFilter from './Inputs/SwitchFilter';
import palette from 'src/theme/colors/palette';

export interface IFilterItemProps {
    // className?: string;
    styleFilterContainer?: ViewStyle;
    styleFilterItem?: ViewStyle;
    label: string;
    type: FilterType;
    icon?: InputIcon;
    iconSvg?: ReactNode;
    iconSvgChecked?: ReactNode;
    name: string;
    value: any;
    showLabel?: boolean;
    placeholder: string;
    labelClassName?: string;
    inputClassName?: string;
    activeClassName?: string;

    options?: Array<IOptions | IMultiselectOptions>;
    onFilterChanged: (field: string, value: any) => void;
    labelIcon?: ReactNode;
    customFilterEvent: any;
}

export default function FilterItem(props: IFilterItemProps) {
    const {
        value,
        type,
        icon,
        iconSvg,
        iconSvgChecked,
        name,
        label,
        options,
        showLabel,
        placeholder,
        labelClassName,
        inputClassName,
        activeClassName,
        onFilterChanged,
        // className,
        styleFilterContainer,
        styleFilterItem,
        labelIcon,
        customFilterEvent,
    } = props;

    const {t} = useTranslation();

    const handleOnChange = useCallback(
        (filterName: string, filterValue: any) => {
            onFilterChanged(filterName, filterValue);
        },
        [onFilterChanged],
    );

    const element = useMemo(() => {
        switch (type) {
            default:
            case FilterType.Text:
                return (
                    <Input
                        name={name}
                        value={value}
                        icon={icon}
                        style={styles.input}
                        placeholder={placeholder}
                        onChange={handleOnChange}
                    />
                );
            case FilterType.Multiselect:
                return (
                    <Multiselect
                        name={name}
                        value={value}
                        label={label}
                        options={options}
                        style={styles.input}
                        onChange={handleOnChange}
                    />
                );
            // case FilterType.Select:
            //     return (
            //         <Select
            //             name={name}
            //             value={value}
            //             items={options}
            //             style={styles.input}
            //             onChange={handleOnChange}
            //         />
            //     );
            case FilterType.CheckBox:
            case FilterType.VerticalCheckBox:
                return (
                    <CheckContainer
                        icon={iconSvg}
                        iconChecked={iconSvgChecked}
                        name={name}
                        value={value}
                        items={options}
                        type={type}
                        style={styles.input}
                        onChange={handleOnChange}
                    />
                );
            case FilterType.Touche:
                return (
                    <Touche
                        style={styles.input}
                        name={name}
                        option={options && options[0]}
                        onChange={handleOnChange}
                        icon={iconSvg}
                        iconChecked={iconSvgChecked}
                    />
                );
            case FilterType.Button:
                return (
                    <Button
                        icon={iconSvg}
                        text={label}
                        actionButton={customFilterEvent}
                    />
                );
            case FilterType.Switch:
                return (
                    <SwitchFilter
                        // style={styles.input}
                        name={name}
                        // option={options && options[0]}
                        onChange={handleOnChange}
                        // icon={iconSvg}
                    />
                );
            case FilterType.Radio:
            case FilterType.GroupButton:
            case FilterType.EllipseButton:
            case FilterType.VerticalRadio:
            case FilterType.VerticalGroupButton:
                return (
                    <RadioContainer
                        name={name}
                        value={value}
                        items={options}
                        type={type}
                        style={styles.input}
                        activeClassName={activeClassName}
                        onChange={handleOnChange}
                    />
                );
            case FilterType.FilterReset:
                return <FilterReset name={name} onChange={handleOnChange} />;
        }
    }, [handleOnChange, icon, name, options, placeholder, type, value]);

    return (
        <View
            style={{
                ...styles.container,
                ...styleFilterContainer,
            }}>
            {showLabel && label && (
                <View style={styles.labelContainer}>
                    {labelIcon && (
                        <View style={{marginRight: 8}}>{labelIcon}</View>
                    )}
                    <Text style={styles.label}>{t(label)}</Text>
                </View>
            )}
            <View style={{...styles.elementContainer, ...styleFilterItem}}>
                {element}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        // flexDirection: 'row',
        marginTop: 10,
        // justifyContent: 'space-between',
    },
    labelContainer: {
        marginRight: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        color: palette.blueDark,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    elementContainer: {
        width: '49%',
        flexGrow: 1,
    },
    input: {
        flex: 1,
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
    },
    custom: {},
    customLabel: {},
});
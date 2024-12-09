import React, {useState, useMemo, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import GroupButton from './GroupButton';
import RadioButton from './RadioButton';
import EllipseButton from './EllipseButton';
import {IOptions, FilterType} from 'src/constants';

export interface IRadioItemProps {
    name: string;
    option: IOptions;
    checked?: boolean;
    onChange?: (option: IOptions, checked: boolean) => void;
    className?: string;
    isVerticalDirection?: boolean;
    activeClassName?: string;
}

interface IRadioContainerProps {
    type: FilterType;
    name: string;
    value: string;
    items: IOptions[];
    onChange?: (name: string, value: any) => void;
    className?: string;
    activeClassName?: string;
}

export default function RadioContainer(props: IRadioContainerProps) {
    const {type, name, value, items, onChange, className, activeClassName} =
        props;

    const isVerticalDirection = useMemo(
        () =>
            [FilterType.VerticalRadio, FilterType.VerticalGroupButton].includes(
                type,
            ),
        [type],
    );

    const directionStyle = useMemo(() => {
        switch (type) {
            case FilterType.Radio:
                return styles.horizontal;
            case FilterType.EllipseButton:
                return styles.wrap;
            case FilterType.VerticalRadio:
                return styles.vertical;
            case FilterType.VerticalGroupButton:
                return styles.verticalGroup;
            default:
                return styles.default;
        }
    }, [type]);

    const [selectedOption, setSelected] = useState<IOptions>({} as IOptions);

    useEffect(() => {
        let initValue = {} as IOptions;
        if (items && items.length > 0) {
            const foundOption = items.find(option => option.value === value);
            initValue = foundOption || items[0];
        }
        setSelected(initValue);
    }, [items, value]);

    const onRadioItemChange = useCallback(
        (option: IOptions, checked: boolean) => {
            if (checked) {
                setSelected(option);
                onChange && onChange(name, option.value);
            }
        },
        [name, onChange],
    );

    const renderItem = ({item}: {item: IOptions}) => {
        const radioItem: IRadioItemProps = {
            name,
            option: item,
            checked: item.value === selectedOption.value,
            isVerticalDirection,
            onChange: onRadioItemChange,
        };

        switch (type) {
            case FilterType.Radio:
            case FilterType.VerticalRadio:
                return (
                    <RadioButton
                        key={`RadioButton_${item.value}`}
                        {...radioItem}
                        className={className}
                    />
                );
            case FilterType.GroupButton:
                return (
                    <GroupButton
                        key={`GroupButton_${item.value}`}
                        {...radioItem}
                        className={className}
                        activeClassName={activeClassName}
                    />
                );
            case FilterType.EllipseButton:
                return (
                    <EllipseButton
                        key={`EllipseButton_${item.value}`}
                        {...radioItem}
                        className={className}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <View style={directionStyle}>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.value}
                extraData={selectedOption}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    wrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    vertical: {
        flexDirection: 'column',
    },
    verticalGroup: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    default: {
        // Default style if needed
    },
});

// import React, { useState, useMemo, useCallback, useEffect } from 'react';
// import GroupButton from './GroupButton';
// import RadioButton from './RadioButton';
// import EllipseButton from './EllipseButton';
// import { IOptions, FilterType } from 'src/constants';

// export interface IRadioItemProps {
//     name: string;
//     option: IOptions;
//     checked?: boolean;
//     onChange?: (option: IOptions, checked: boolean) => void;
//     className?: string;
//     isVerticalDirection?: boolean;
//     activeClassName?: string;
// }
// interface IRadioContainerProps {
//     type: FilterType;
//     name: string;
//     value: string;
//     items: IOptions[];
//     onChange?: (name: string, value: any) => void;
//     className?: string;
//     activeClassName?: string;
// }

// export default function RadioContainer(props: IRadioContainerProps){
//     const { type, name, value, items, onChange, className, activeClassName } = props;

//     const isVerticalDirection = useMemo(() => [
//         FilterType.VerticalRadio,
//         FilterType.VerticalGroupButton].includes(type)
//     , [type]);

//     const directionStyle = useMemo(() => {
//         switch (type) {
//         case FilterType.Radio:
//             return 'flex space-x-4';
//         case FilterType.EllipseButton:
//             return 'w-full flex flex-wrap justify-center lg:justify-start -mt-2 -mb-4';
//         case FilterType.VerticalRadio:
//             return 'flex-col';
//         case FilterType.VerticalGroupButton:
//             return 'flex-col justify-start items-start';

//         }

//     }, [type]);

//     const [selectedOption, setSelected] = useState({} as IOptions);
//     useEffect(() => {
//         let initValue = {} as IOptions;
//         if(items && items.length > 0){
//             const findedOption = items?.filter((option: IOptions) => option?.value === value);
//             initValue = (findedOption?.length > 0? findedOption[0] : items[0]) as IOptions;
//         }
//         setSelected(initValue);
//     }, [items, selectedOption, value]);

//     const onRadioItemChange = useCallback((option: IOptions, checked: boolean) => {
//         if(checked){
//             setSelected(option);
//             onChange(name, option.value);
//         }
//     }, [name, onChange]);

//     const optionsRender = useMemo(() => items?.map((opt: IOptions) => {
//         const radioItem: IRadioItemProps = {
//             name: name, option: opt,
//             checked: opt.value === selectedOption.value,
//             isVerticalDirection: isVerticalDirection,
//             onChange: onRadioItemChange,
//         };

//         switch (type) {
//         case FilterType.Radio:
//         case FilterType.VerticalRadio:
//             return <RadioButton key={`RadioButton_${opt.value}`} {...radioItem} className={className}/>;
//         case FilterType.GroupButton:
//             return <GroupButton key={`GroupButton_${opt.value}`} {...radioItem} className={className} activeClassName={activeClassName}/>;
//         case FilterType.EllipseButton:
//             return <EllipseButton key={`EllipseButton_${opt.value}`} {...radioItem} className={className} />;
//         }
//     }), [items, name, selectedOption.value, isVerticalDirection, onRadioItemChange, type]);

//     return(
//         <>
//             {(optionsRender?.length > 0) && (
//                 <div className={`flex ${directionStyle}`}>
//                     { optionsRender }
//                 </div>
//             )}
//         </>
//     );
// }

import i18next from 'i18next';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, StyleSheet, View} from 'react-native';
import {Dropdown, Option} from 'react-native-paper-dropdown';
import {images} from 'src/theme/images';
import BaseTitleDropdown from './BaseTitleDropdown';

export default function DDatePicker({
    showYear = true,
    showMonth = true,
    showDay = true,
    showHours = true,
    showMinutes = true,

    startDate = new Date(),
    onChange = value => {},
}: {
    showYear?: boolean;
    showMonth?: boolean;
    showDay?: boolean;
    showHours?: boolean;
    showMinutes?: boolean;

    startDate?: Date;
    onChange?: (date: Date) => void;
}) {
    const {t} = useTranslation();

    const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

    const mapValueToOptions = (min, max) => {
        let res: Option[] = [];
        for (let i = min; i <= max; i++) {
            res.push({
                label: `${i}`,
                value: `${i}`,
            });
        }
        return res;
    };

    const [year, setYear] = useState<string | undefined>(
        `${startDate.getFullYear()}`,
    );
    const [month, setMonth] = useState<string | undefined>(
        `${startDate.getMonth() + 1}`,
    );
    const [day, setDay] = useState<string | undefined>(
        `${startDate.getDate()}`,
    );
    const [hours, setHours] = useState<string | undefined>(
        `${startDate.getHours()}`,
    );
    const [minutes, setMinutes] = useState<string | undefined>(
        `${startDate.getMinutes()}`,
    );

    const now = new Date();
    const minYear = now.getFullYear();
    const maxYear = minYear + 1;
    const minMonth = 1;
    const maxMonth = 12;
    const minDay = 1;
    let maxDay = daysInMonth(Number(year), Number(month));
    const minHour = 0;
    const maxHour = 23;
    const minMinutes = 0;
    const maxMinutes = 59;

    const [dayOptions, setDayOptions] = useState(
        mapValueToOptions(minDay, maxDay),
    );

    useEffect(() => {
        maxDay = daysInMonth(Number(year), Number(month));
        if (Number(day) > maxDay) {
            setDay(`${maxDay}`);
        }
        setDayOptions(mapValueToOptions(minDay, maxDay));
    }, [year, month]);

    useEffect(() => {
        const date = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hours),
            Number(minutes),
        );
        onChange(date);
    }, [year, month, day, hours, minutes]);

    return (
        <View style={{width: '100%', gap: 8}}>
            {showYear && (
                <BaseTitleDropdown
                    key={'year'}
                    title={t('year')}
                    placeholder={t('year')}
                    data={mapValueToOptions(minYear, maxYear)}
                    value={year}
                    setValue={setYear}
                />
            )}
            {showMonth && (
                <BaseTitleDropdown
                    key={'months'}
                    data={mapValueToOptions(minMonth, maxMonth)}
                    title={t('month')}
                    placeholder={t('month')}
                    value={month}
                    setValue={setMonth}
                />
            )}
            {showDay && (
                <BaseTitleDropdown
                    key={'day'}
                    title={t('day')}
                    placeholder={t('day')}
                    data={dayOptions}
                    value={day}
                    setValue={setDay}
                />
            )}

            {showHours && (
                <BaseTitleDropdown
                    key={'hours'}
                    title={t('hours')}
                    placeholder={t('hours')}
                    data={mapValueToOptions(minHour, maxHour)}
                    value={hours}
                    setValue={setHours}
                />
            )}
            {showMinutes && (
                <BaseTitleDropdown
                    key={'minutes'}
                    title={t('minutes')}
                    placeholder={'minutes'}
                    data={mapValueToOptions(minMinutes, maxMinutes)}
                    value={minutes}
                    setValue={setMinutes}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f5f6f2',
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },

    text: {
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
        color: 'black',
    },
});

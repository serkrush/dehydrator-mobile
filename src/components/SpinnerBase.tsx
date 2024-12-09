import {connect, useSelector} from 'react-redux';
import {AppState, ENTITY, Flag, RequestStatus} from '../constants';
import {useEffect, useState} from 'react';
import useEntity from '../hooks/useEntity';
import {IEntityContainer} from '../entities';
import {View} from 'react-native';
import React from 'react';
import {useIsFocused} from '@react-navigation/native';

export type CheckType = keyof IEntityContainer;

export interface SpinnerProps {
    checkEntities: CheckType | CheckType[];
    children;
    onlyFocused?: boolean;
}

export default function SpinnerBase({
    checkEntities,
    children,
    onlyFocused = true,
}: SpinnerProps) {
    const isFocused = useIsFocused();

    const statuses = useSelector((state: AppState) => {
        return state?.requestStatus;
    });
    const [active, setActive] = useState(false);
    useEffect(() => {
        let res = false;
        if (!statuses) {
            setActive(false);
            return;
        }
        const keys = Object.keys(statuses) as CheckType[];
        if (Array.isArray(checkEntities)) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (
                    key &&
                    checkEntities.includes(key as CheckType) &&
                    statuses[key]?.status == RequestStatus.LOADING
                ) {
                    res = true;
                    break;
                }
            }
        } else {
            res =
                keys.includes(checkEntities) &&
                statuses[checkEntities]?.status == RequestStatus.LOADING;
        }
        setActive(res);
    }, [statuses]);

    if ((!onlyFocused || isFocused) && active) {
        return children;
    } else {
        return <></>;
    }
}

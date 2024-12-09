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
    checkFlags: string | string[];
    children;
    onlyFocused?: boolean;
}

export default function FlagSpinnerBase({
    checkFlags,
    children,
    onlyFocused = true,
}: SpinnerProps) {
    const isFocused = useIsFocused();

    const box = useSelector((state: AppState) => {
        return state?.box;
    });
    // console.log('statuses', statuses);
    // console.log('checkEntities', checkEntities);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let res = false;
        if (!box) {
            setActive(false);
            return;
        }

        if (Array.isArray(checkFlags)) {
            for (let i = 0; i < checkFlags.length; i++) {
                const flag = checkFlags[i];
                const value =
                    box != undefined && flag != undefined
                        ? box[flag]
                        : undefined;

                if (value != undefined) {
                    if (value) {
                        res = true;
                        break;
                    }
                }
            }
        } else {
            res =
                box != undefined &&
                box[checkFlags] != undefined &&
                box[checkFlags] != false;
        }
        //console.log('res', res);
        setActive(res);
    }, [box]);

    //console.log('active', active);
    if ((!onlyFocused || isFocused) && active) {
        // console.log('SPINNER');
        return children;
    } else {
        return <View />;
    }
    //return {active && children}
}

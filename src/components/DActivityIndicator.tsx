import React from 'react';
import {ActivityIndicator} from 'react-native';
import SpinnerBase, {CheckType} from './SpinnerBase';

interface SpinnerProps {
    checkEntities: CheckType | CheckType[];
}

export default function DActivityIndicator({checkEntities}: SpinnerProps) {
    return (
        <SpinnerBase checkEntities={checkEntities}>
            <ActivityIndicator />
        </SpinnerBase>
    );
}

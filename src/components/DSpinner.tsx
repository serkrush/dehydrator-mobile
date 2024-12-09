import SpinnerBase, {CheckType} from './SpinnerBase';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {colors} from 'src/theme';

interface SpinnerProps {
  checkEntities: CheckType | CheckType[];
}

export default function DSpinner({checkEntities}: SpinnerProps) {
  return (
    <SpinnerBase checkEntities={checkEntities}>
      <Spinner
        visible={true}
        textStyle={{color: colors.spinner}}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </SpinnerBase>
  );
}

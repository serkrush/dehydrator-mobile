import SpinnerBase, {CheckType} from './SpinnerBase';
import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import {colors} from 'src/theme';
import FlagSpinnerBase from './FlagSpinnerBase';

interface SpinnerProps {
  checkFlags: string | string[];
}

export default function DFlagSpinner({checkFlags}: SpinnerProps) {
  return (
    <FlagSpinnerBase checkFlags={checkFlags}>
      <Spinner
        visible={true}
        textStyle={{color: colors.spinner}}
        overlayColor="rgba(0,0,0,0.5)"
      />
    </FlagSpinnerBase>
  );
}

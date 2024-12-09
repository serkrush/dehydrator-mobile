// import {IPMState, TPMState} from '../types/MachineTypes';
// import * as actionTypes from '../actions';
// import coreConfig from '../../../config';

// const initialState: TPMState = [];

// const pmState = (
//   state: TPMState = initialState,
//   action: any = {},
// ): TPMState => {
//   const {type, payload} = action;
//   if (type === actionTypes.SET_PM_STATE) {
//     console.log('pmState payload', payload, Object.keys(payload));
//     let newItems = [...state];
//     Object.keys(payload).forEach(machineId => {
//       const newData = payload[machineId];
//       const idx = newItems.findIndex(z => z.machineId === machineId);
//       if (idx >= 0) {
//         newItems[idx] = {...newData};
//       } else {
//         newItems.push({...newData});
//       }
//     });
//     return newItems;
//   }
//   return state;
// };

// export default pmState;

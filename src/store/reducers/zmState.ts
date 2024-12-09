// import * as actionTypes from '../actions';
// import coreConfig from '../../../config';
// import {
//   CycleStatus,
//   ICycleState,
//   IZMState,
//   IZoneParams,
//   TZMState,
// } from '../types/MachineTypes';

// const initialState: TZMState = [];

// const zmState = (
//   state: TZMState = initialState,
//   action: any = {},
// ): TZMState => {
//   const {type, payload} = action;
//   //console.log('zmState reducer', action);
//   if (type === actionTypes.SET_ZM_STATE) {
//     console.log('zmState payload', payload, Object.keys(payload));
//     let newItems = [...state];
//     Object.keys(payload).forEach(uid => {
//       const newData = payload[uid];
//       const cycleUid = `${newData.machineId}_${newData.zoneNumber}`;
//       const idx = newItems.findIndex(z => z.uid === cycleUid);
//       if (idx >= 0) {
//         newItems[idx] = {...newData, uid: cycleUid};
//       } else {
//         newItems.push({...newData, uid: cycleUid});
//       }
//     });
//     return newItems;
//   }
//   return state;
// };

// export default zmState;

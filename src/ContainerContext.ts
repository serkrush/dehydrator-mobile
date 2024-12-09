import React from 'react';
import container from './container';
const ContainerContext = React.createContext<typeof container>({} as any);
export default ContainerContext;

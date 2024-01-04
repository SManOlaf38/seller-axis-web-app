'use client';

import { useReducer, ReactNode } from 'react';
import ShipmentsReducer, { initialState } from './reducer';
import ShipmentsContext from './context';

function ShipmentsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ShipmentsReducer, initialState);

  return (
    <ShipmentsContext.Provider value={{ state, dispatch }}>{children}</ShipmentsContext.Provider>
  );
}


export default ShipmentsProvider;

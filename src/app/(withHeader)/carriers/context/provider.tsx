'use client';

import { ReactNode, useReducer } from 'react';

import RetailerCarrierContext from './context';
import RetailerCarrierReducer, { initialState } from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(RetailerCarrierReducer, initialState);

  return (
    <RetailerCarrierContext.Provider value={{ state, dispatch }}>
      {children}
    </RetailerCarrierContext.Provider>
  );
}

export default Provider;

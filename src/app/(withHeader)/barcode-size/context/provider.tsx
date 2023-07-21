'use client';

import { useReducer, ReactNode } from 'react';
import BarcodeSizeReducer, { initialState } from './reducer';
import BarcodeSizeContext from './context';

function BarcodeSizeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(BarcodeSizeReducer, initialState);

  return (
    <BarcodeSizeContext.Provider value={{ state, dispatch }}>
      {children}
    </BarcodeSizeContext.Provider>
  );
}

export default BarcodeSizeProvider;

'use client';

import { ReactNode, useReducer } from 'react';

import SFTPContext from './context';
import SFTPReducer, { initialState } from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(SFTPReducer, initialState);

  return (
    <SFTPContext.Provider value={{ state, dispatch }}>
      {children}
    </SFTPContext.Provider>
  );
}

export default Provider;

'use client';

import { useReducer, ReactNode } from 'react';
import { initialState } from './reducer';
import RetailerContext from './context';
import RetailerReducer from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(RetailerReducer, initialState);

  return (
    <RetailerContext.Provider value={{ state, dispatch }}>{children}</RetailerContext.Provider>
  );
}

export default Provider;

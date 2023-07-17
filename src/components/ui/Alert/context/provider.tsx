'use client';

import { useReducer, ReactNode } from 'react';
import { initialState } from './reducer';
import AlertContext from './context';
import AlertReducer from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(AlertReducer, initialState);

  return <AlertContext.Provider value={{ state, dispatch }}>{children}</AlertContext.Provider>;
}

export default Provider;

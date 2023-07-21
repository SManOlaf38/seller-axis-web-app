'use client';

import { useReducer, ReactNode } from 'react';
import BoxReducer, { initialState } from './reducer';
import BoxContext from './context';

function BoxProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(BoxReducer, initialState);

  return <BoxContext.Provider value={{ state, dispatch }}>{children}</BoxContext.Provider>;
}

export default BoxProvider;

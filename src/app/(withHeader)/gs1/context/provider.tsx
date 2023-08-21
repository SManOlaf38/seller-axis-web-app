'use client';

import { useReducer, ReactNode } from 'react';
import Gs1Reducer, { initialState } from './reducer';
import Gs1Context from './context';

function Gs1Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(Gs1Reducer, initialState);

  return <Gs1Context.Provider value={{ state, dispatch }}>{children}</Gs1Context.Provider>;
}

export default Gs1Provider;

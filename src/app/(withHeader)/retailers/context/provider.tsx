'use client';

import { useReducer, ReactNode } from 'react';
import { initialState } from './reducer';
import ProductContext from './context';
import RetailerReducer from './reducer';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(RetailerReducer, initialState);

  return <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>;
}

export default Provider;

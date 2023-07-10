'use client';

import { useReducer, ReactNode } from 'react';
import OrderReducer, { initialState } from './reducer';
import OrderContext from './context';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(OrderReducer, initialState);

  return <OrderContext.Provider value={{ state, dispatch }}>{children}</OrderContext.Provider>;
}

export default Provider;

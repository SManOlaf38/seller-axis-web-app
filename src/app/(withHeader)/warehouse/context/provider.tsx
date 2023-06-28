'use client'

import { useReducer, ReactNode } from 'react'

import SearchReducer, { initialState } from './reducer';
import { WarehouseContext } from '.';

function WarehouseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return (
    <WarehouseContext.Provider value={{ state, dispatch }}>
      {children}
    </WarehouseContext.Provider>
  );
}

export default WarehouseProvider

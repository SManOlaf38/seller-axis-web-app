'use client'

import { useReducer, ReactNode } from 'react'

import SearchReducer, { initialState } from './reducer';
import { OrganizationContext } from '.';

function OrganizationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return (
    <OrganizationContext.Provider value={{ state, dispatch }}>
      {children}
    </OrganizationContext.Provider>
  );
}

export default OrganizationProvider

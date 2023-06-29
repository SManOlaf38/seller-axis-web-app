'use client'

import { useReducer, ReactNode } from 'react'

import SearchReducer, { initialState } from './reducer';
import { AuthContext } from '.';

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider

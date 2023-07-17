'use client';

import { useReducer, ReactNode } from 'react';

import SearchReducer, { initialState } from './reducer';
import AccountContext from './context';

function AccountProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return <AccountContext.Provider value={{ state, dispatch }}>{children}</AccountContext.Provider>;
}

export default AccountProvider;

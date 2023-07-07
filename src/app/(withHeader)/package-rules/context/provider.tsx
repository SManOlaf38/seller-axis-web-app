'use client';

import { useReducer, ReactNode } from 'react';
import PackageRuleReducer, { initialState } from './reducer';
import PackageRuleContext from './context';

function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(PackageRuleReducer, initialState);

  return (
    <PackageRuleContext.Provider value={{ state, dispatch }}>
      {children}
    </PackageRuleContext.Provider>
  );
}

export default Provider;

'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import { ContextAccountType } from './type';

const AccountContext = createContext<ContextAccountType>({
  state: initialState,
  dispatch: () => null
});

export default AccountContext;

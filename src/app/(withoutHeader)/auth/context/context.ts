'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import { IContextAuth } from './type';

const AuthContext = createContext<IContextAuth>({
  state: initialState,
  dispatch: () => null,
});

export default AuthContext;

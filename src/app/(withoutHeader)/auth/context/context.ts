'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import type { AuthenticateContext } from './types';

const AuthContext = createContext<AuthenticateContext>({
  state: initialState,
  dispatch: () => null,
});

export default AuthContext;

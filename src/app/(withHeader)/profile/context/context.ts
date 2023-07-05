'use client';

import { createContext } from 'react';

import { initialState } from './reducer';
import { ContextProfileType } from './type';

const ProfileContext = createContext<ContextProfileType>({
  state: initialState,
  dispatch: () => null
});

export default ProfileContext;

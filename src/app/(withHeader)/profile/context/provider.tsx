'use client';

import { useReducer, ReactNode } from 'react';

import SearchReducer, { initialState } from './reducer';
import { ProfileContext } from '.';

function ProfileProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(SearchReducer, initialState);

  return <ProfileContext.Provider value={{ state, dispatch }}>{children}</ProfileContext.Provider>;
}

export default ProfileProvider;

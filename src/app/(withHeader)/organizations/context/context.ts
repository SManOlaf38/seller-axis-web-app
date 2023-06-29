'use client'

import { createContext } from 'react';

import { initialState } from './reducer';
import { ContextOrganizationType } from './type';

const OrganizationContext = createContext<ContextOrganizationType>({
  state: initialState,
  dispatch: () => null
});

export default OrganizationContext;
import { Dispatch, ReactNode } from 'react';
import { AlertColors } from '../Alert.types';

export type AlertType = {
  isOpen: boolean;
  content: {
    color?: AlertColors;
    title: ReactNode;
    message: string;
  };
};

export type ContextType = {
  state: AlertType;
  dispatch: Dispatch<any>;
};
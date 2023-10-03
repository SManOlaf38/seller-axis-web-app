import { Dispatch, ReactNode } from 'react';
import { AlertColors, AlertPlacements } from '../Alert.types';

export type AlertType = {
  isOpen: boolean;
  content: {
    color?: AlertColors;
    title: string;
    message: string;
    customTimeHide?: number;
    placement?: AlertPlacements
    action?: ReactNode
  };
};

export type ContextType = {
  state: AlertType;
  dispatch: Dispatch<any>;
};

import { ReactNode } from 'react';

export type AlertColors = 'error' | 'warning' | 'success';

export type AlertVariants = 'contained';

export type AlertPlacements = {
  horizontal: 'center' | 'left' | 'right';
  vertical: 'bottom' | 'top';
};

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  color?: AlertColors;
  variant?: AlertVariants;
  icon?: JSX.Element | boolean;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  width?: string;
  open?: boolean;
  closeButton?: boolean;
  floating?: boolean;
  autoHideDuration?: number;
  placement?: AlertPlacements;
  zIndex?: React.CSSProperties['zIndex'] | null;
  className?: string;
  onClose?: () => void;
};

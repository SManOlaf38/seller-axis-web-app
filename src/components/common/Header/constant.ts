import Dashboard from 'public/Dashboard.svg';
import Product from 'public/Product.svg';
import PO from 'public/PO.svg';
import Marketplace from 'public/Marketplace.svg';
import Settings from 'public/Settings.svg';
import UserManager from 'public/UserManager.svg';
import Admin from 'public/Admin.svg';

export interface IMenuProp {
  name: string;
  Icon: React.ElementType;
  path: string;
}

export const headerData: IMenuProp[] = [
  {
    name: 'Dashboard',
    Icon: Dashboard,
    path: '/dashboard',
  },
  {
    name: 'Product',
    Icon: Product,
    path: '/products',
  },
  {
    name: 'PO',
    Icon: PO,
    path: '/po',
  },
  {
    name: 'Marketplace',
    Icon: Marketplace,
    path: '/marketplace',
  },
  {
    name: 'Settings',
    Icon: Settings,
    path: '/settings',
  },
  {
    name: 'User Manager',
    Icon: UserManager,
    path: '/user-manager',
  },
  {
    name: 'Admin',
    Icon: Admin,
    path: '/admin',
  },
];

export const tabletMain: IMenuProp[] = [
  {
    name: 'Dashboard',
    Icon: Dashboard,
    path: '/dashboard',
  },
  {
    name: 'Product',
    Icon: Product,
    path: '/product',
  },
  {
    name: 'PO',
    Icon: PO,
    path: '/po',
  },
];

export const tabletExtra: IMenuProp[] = [
  {
    name: 'Marketplace',
    Icon: Marketplace,
    path: '/marketplace',
  },
  {
    name: 'Settings',
    Icon: Settings,
    path: '/settings',
  },
  {
    name: 'User Manager',
    Icon: UserManager,
    path: '/user-manager',
  },
  {
    name: 'Admin',
    Icon: Admin,
    path: '/admin',
  },
];

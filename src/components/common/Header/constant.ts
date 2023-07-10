import Admin from 'public/Admin.svg';
import Dashboard from 'public/Dashboard.svg';
import Marketplace from 'public/Marketplace.svg';
import PO from 'public/PO.svg';
import Product from 'public/Product.svg';
import Settings from 'public/Settings.svg';
import UserManager from 'public/UserManager.svg';

export interface IMenuProp {
  name: string;
  Icon: React.ElementType;
  path: string;
  subMenu?: {
    name: string;
    path: string;
    Icon: React.ElementType;
  }[];
}

export const headerData: IMenuProp[] = [
  {
    name: 'Product',
    Icon: Product,
    path: '/products'
  },
  {
    name: 'Retailers',
    Icon: PO,
    path: '/retailers',
    subMenu: [
      {
        name: 'Product Alias',
        path: '/product-aliases',
        Icon: PO
      },
      {
        name: 'Retailer Inventory',
        path: '/inventory',
        Icon: PO
      }
    ]
  }
];

export const tabletMain: IMenuProp[] = [
  {
    name: 'Dashboard',
    Icon: Dashboard,
    path: '/dashboard'
  },
  {
    name: 'Product',
    Icon: Product,
    path: '/product'
  },
  {
    name: 'PO',
    Icon: PO,
    path: '/po'
  }
];

export const tabletExtra: IMenuProp[] = [
  {
    name: 'Marketplace',
    Icon: Marketplace,
    path: '/marketplace'
  },
  {
    name: 'Settings',
    Icon: Settings,
    path: '/settings'
  },
  {
    name: 'User Manager',
    Icon: UserManager,
    path: '/user-manager'
  },
  {
    name: 'Admin',
    Icon: Admin,
    path: '/admin'
  }
];

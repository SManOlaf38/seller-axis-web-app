import Admin from 'public/Admin.svg';
import Dashboard from 'public/Dashboard.svg';
import Marketplace from 'public/Marketplace.svg';
import PO from 'public/PO.svg';
import Product from 'public/Product.svg';
import Settings from 'public/Settings.svg';
import UserManager from 'public/UserManager.svg';

export type Submenu = {
  name: string;
  path: string;
  Icon: React.ElementType;
};
export interface Menu {
  name: string;
  Icon: React.ElementType;
  path: string;
  subMenu?: Submenu[];
}

export const headerData: Menu[] = [
  {
    name: 'Product',
    Icon: Product,
    path: '/products'
  },
  {
    name: 'Retailers',
    Icon: PO,
    path: '/',
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
      },
      {
        name: 'Retailer warehouse',
        path: '/retailer-warehouse',
        Icon: PO
      },
      {
        name: 'Retailer carrier',
        path: '/retailer-carriers',
        Icon: PO
      },
      {
        name: 'Retailers',
        path: '/retailers',
        Icon: PO
      }
    ]
  },
  {
    name: 'PO',
    Icon: Product,
    path: '/orders'
  },
  {
    name: 'SFTP',
    Icon: Product,
    path: '/sftp'
  }
];

export const tabletMain: Menu[] = [
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

export const tabletExtra: Menu[] = [
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

export const listMenuNavLef = [
  {
    name: 'Shipped',
    url: `/shipments/shipped`,
    disabled: true
  },
  {
    name: 'Fulfillments',
    url: `/shipments/fulfillments`,
    disabled: true
  },
  {
    name: 'Returns',
    url: `/shipments/returns`
  },
  {
    name: 'End of Day',
    url: `/shipments/end_of_day`,
    disabled: true
  },
  {
    name: 'Carrier Pickups',
    url: `/shipments/carrier_pickups`,
    disabled: true
  },
  {
    name: 'Batches',
    url: `/shipments/batches`,
    disabled: true
  }
];

export const headerTableReturns = [
  {
    id: 'order_id',
    label: 'Order ID'
  },
  {
    id: 'return_id',
    label: 'Return ID'
  },
  {
    id: 'created_date',
    label: 'Created Date'
  },
  {
    id: 'return_to',
    label: 'Return to'
  },
  {
    id: 'tracking_id',
    label: 'Tracking ID'
  },
  {
    id: 'service',
    label: 'Service'
  },
  {
    id: 'reimbursed',
    label: 'Reimbursed'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'dispute_at',
    label: 'Dispute at'
  }
];

export type shipmentReturns = {
  id: number;
  order_id: {
    po_number: number;
    id: number;
  };
  return_id: number;
  created_date: string;
  return_to: string;
  tracking_id: Tracking[];
  service: string;
  reimbursed: number;
  dispute: boolean;
  dispute_at: string;
};

export type Tracking = {
  number: string;
  tracking_url: string;
};

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
  id: number;
  name: string;
};

export const fakeData = [
  {
    id: 1,
    order_id: {
      po_number: 123,
      id: 123
    },
    return_id: 123,
    created_date: '2023-12-08T01:36:24.654444-05:00',
    return_to: 123,
    tracking_id: [
      {
        id: 1232134,
        name: 'nguyen'
      },
      {
        id: 223414,
        name: 'nguyen2'
      },
      {
        id: 12351231,
        name: 'nguye3'
      },
      {
        id: 21231235,
        name: 'nguyen4'
      },
      {
        id: 132135,
        name: 'nguye5'
      },
      {
        id: 312312342,
        name: 'nguyen6'
      }
    ],
    service: 'service',
    reimbursed: 123,
    dispute: true,
    dispute_at: '2023-12-08T01:36:24.654444-05:00'
  }
];

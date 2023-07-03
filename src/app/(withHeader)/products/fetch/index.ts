import fetchClient from '@/utils/fetchClient';

// Rest API

export const getProductService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  // return await httpFetchClient.get(
  //   `/product?search=${search}&page=${page}&page_size=10`,
  // );
  return [
    {
      id: 1,
      sku: 'IB-001',
      unit_of_measure: 'string',
      available: 'YES',
      upc: 'string',
      description: 'string',
      unit_cost: 100,
      qty_on_hand: 100,
      qty_reserve: 100,
      image: 'https://tracing-ninja.vercel.app/_next/image?url=https%3A%2F%2Fnyc3.digitaloceanspaces.com%2Fninja-cdn%2F1430782e-cecf-48e8-aeb8-b20cb8d16a1f&w=128&q=75',
      package_rule_id: 1,
      created_at: new Date(),
      update_at: new Date()
    },
    {
      id: 2,
      sku: 'IB-001',
      unit_of_measure: 'string',
      available: 'YES',
      upc: 'string',
      description: 'string',
      unit_cost: 100,
      qty_on_hand: 100,
      qty_reserve: 100,
      image: 'https://tracing-ninja.vercel.app/_next/image?url=https%3A%2F%2Fnyc3.digitaloceanspaces.com%2Fninja-cdn%2F1430782e-cecf-48e8-aeb8-b20cb8d16a1f&w=128&q=75',
      package_rule_id: 1,
      created_at: new Date(),
      update_at: new Date()
    },
    {
      id: 31,
      sku: 'IB-001',
      unit_of_measure: 'string',
      available: 'YES',
      upc: 'string',
      description: 'string',
      unit_cost: 100,
      qty_on_hand: 100,
      qty_reserve: 100,
      image: 'https://tracing-ninja.vercel.app/_next/image?url=https%3A%2F%2Fnyc3.digitaloceanspaces.com%2Fninja-cdn%2F1430782e-cecf-48e8-aeb8-b20cb8d16a1f&w=128&q=75',
      package_rule_id: 1,
      created_at: new Date(),
      update_at: new Date()
    },
    {
      id: 3,
      sku: 'IB-001',
      unit_of_measure: 'string',
      available: 'YES',
      upc: 'string',
      description: 'string',
      unit_cost: 100,
      qty_on_hand: 100,
      qty_reserve: 100,
      image: 'https://tracing-ninja.vercel.app/_next/image?url=https%3A%2F%2Fnyc3.digitaloceanspaces.com%2Fninja-cdn%2F1430782e-cecf-48e8-aeb8-b20cb8d16a1f&w=128&q=75',
      package_rule_id: 1,
      created_at: new Date(),
      update_at: new Date()
    },
    {
      id: 4,
      sku: 'IB-001',
      unit_of_measure: 'string',
      available: 'YES',
      upc: 'string',
      description: 'string',
      unit_cost: 100,
      qty_on_hand: 100,
      qty_reserve: 100,
      image: 'https://tracing-ninja.vercel.app/_next/image?url=https%3A%2F%2Fnyc3.digitaloceanspaces.com%2Fninja-cdn%2F1430782e-cecf-48e8-aeb8-b20cb8d16a1f&w=128&q=75',
      package_rule_id: 1,
      created_at: new Date(),
      update_at: new Date()
    },
    {
      id: 5,
      sku: 'IB-001',
      unit_of_measure: 'string',
      available: 'YES',
      upc: 'string',
      description: 'string',
      unit_cost: 100,
      qty_on_hand: 100,
      qty_reserve: 100,
      image: 'https://tracing-ninja.vercel.app/_next/image?url=https%3A%2F%2Fnyc3.digitaloceanspaces.com%2Fninja-cdn%2F1430782e-cecf-48e8-aeb8-b20cb8d16a1f&w=128&q=75',
      package_rule_id: 1,
      created_at: new Date(),
      update_at: new Date()
    }
  ];
};

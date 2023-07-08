'use client';

import { useRouter } from 'next/navigation';

import { SubBar } from '@/components/common/SubBar';
import useSearch from '@/hooks/useSearch';

export default function ProductAliasContainer() {
  const router = useRouter();

  const { search, handleSearch } = useSearch();

  return (
    <main className="flex h-full flex-col">
      <SubBar
        search={search}
        onSearch={handleSearch}
        title={'Product Alias'}
        onSubmit={() => router.push('/product-aliases/create')}
        addTitle="Add Product Alias"
      />
    </main>
  );
}

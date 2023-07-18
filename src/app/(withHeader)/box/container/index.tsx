'use client';

import { useRouter } from 'next/navigation';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';

export default function BoxContainer() {
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const router = useRouter();

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Box'}
          onSubmit={() => router.push('/box/create')}
          addTitle="Add Box"
        />
        <div className="h-full"></div>
      </div>
    </main>
  );
}

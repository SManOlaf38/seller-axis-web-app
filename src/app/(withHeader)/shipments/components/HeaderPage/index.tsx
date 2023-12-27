'use client';
import { SubBar } from '@/components/common/SubBar';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';

const HeaderPage = () => {
  const { setCurrentPage } = usePagination();
  const { search, handleSearch } = useSearch('returns');

  return (
    <div className="flex h-full flex-col gap-[18px]">
      <SubBar
        setCurrentPage={setCurrentPage}
        search={search}
        onSearch={handleSearch}
        title="Shipments / Returns"
        addTitle="Create Return"
      />
    </div>
  );
};

export default HeaderPage;

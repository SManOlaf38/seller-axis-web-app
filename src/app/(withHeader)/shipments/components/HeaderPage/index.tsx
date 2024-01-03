'use client';

import { SubBar } from '@/components/common/SubBar';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';
import useToggleModal from '@/hooks/useToggleModal';
import ModalCreateReturn from '../ModalCreateReturn';

const HeaderPage = () => {
  const { handleSearch, search } = useSearch('returns');
  const { openModal, handleToggleModal } = useToggleModal();
  const { setCurrentPage } = usePagination();

  return (
    <div className="flex h-full flex-col gap-[18px]">
      <SubBar
        setCurrentPage={setCurrentPage}
        search={search}
        onSearch={handleSearch}
        title="Shipments / Returns"
        addTitle="Create Return"
        onSubmit={handleToggleModal}
      />
      <ModalCreateReturn openModal={openModal} handleToggleModal={handleToggleModal} />
    </div>
  );
};

export default HeaderPage;

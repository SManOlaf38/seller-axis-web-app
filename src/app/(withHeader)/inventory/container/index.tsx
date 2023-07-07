'use client';

import { useCallback, useEffect, useState } from 'react';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import Table from '../components/TableInventory';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import { Dropdown } from '@/components/ui/Dropdown';
import { headerTable, tableData } from '../constants';

export default function InventoryContainer() {
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: tableData as []
  });
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const [changeQuantity, setChangeQuantity] = useState<any>({
    update_quantity: false,
    next_available_date: false
  });

  const handleCancel = () => setChangeQuantity(false);

  const handleSaveChanges = () => {};

  const handleDeleteItem = async (id: number) => {};

  const handleGetInventory = useCallback(async () => {}, []);

  useEffect(() => {
    handleGetInventory();
  }, [handleGetInventory]);

  return (
    <main className="flex h-full flex-col">
      <div className="flex h-full flex-col gap-[18px]">
        <SubBar
          search={search}
          onSearch={handleSearch}
          title={'Inventory'}
          changeQuantity={changeQuantity}
          handleCancel={handleCancel}
          handleSaveChanges={handleSaveChanges}
          addTitle="Add Inventory"
        />

        <div className="h-full">
          <Table
            columns={headerTable}
            isPagination
            isSelect={true}
            changeQuantity={changeQuantity}
            setChangeQuantity={setChangeQuantity}
            selectedItems={selectedItems}
            selectAllTable={onSelectAll}
            selectItemTable={onSelectItem}
            totalCount={10}
            siblingCount={1}
            onPageChange={onPageChange}
            currentPage={page}
            pageSize={rowsPerPage}
            rows={tableData}
            selectAction={
              <Dropdown
                className="left-0 w-[160px] dark:bg-gunmetal"
                mainMenu={
                  <Image src="/three-dot.svg" width={20} height={20} alt="Picture of the author" />
                }
              >
                <div className="rounded-lg ">
                  <Button>
                    <Image src="/delete.svg" width={13} height={13} alt="Picture of the author" />
                    Delete
                  </Button>
                </div>
              </Dropdown>
            }
          />
        </div>
      </div>
    </main>
  );
}

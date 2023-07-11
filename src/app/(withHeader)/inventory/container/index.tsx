'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import { SubBar } from '@/components/common/SubBar';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import useSelectTable from '@/hooks/useSelectTable';
import Table from '../components/TableInventory';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { headerTable, tableData } from '../constants';
import IconAction from 'public/three-dots.svg';
import { Inventory } from '../../interfaces';

export default function InventoryContainer() {
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: tableData as []
  });
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const [dataInventory, setDataInventory] = useState(tableData);
  const [changeQuantity, setChangeQuantity] = useState<any>({
    update_quantity: false,
    next_available_date: false
  });

  const isValueUseLiveQuantity = useMemo(() => {
    return dataInventory?.some((item) => item?.isUseLiveQty === true);
  }, [dataInventory]);

  const handleCancel = () => setChangeQuantity(false);

  const handleSaveChanges = () => {};

  const handleDeleteItem = async (id: number) => {};

  const handleItemLive = () => {
    setChangeQuantity(false);
    setDataInventory((prevData) => {
      return prevData?.map((item) => {
        if (selectedItems?.includes(item?.id)) {
          return {
            ...item,
            isUseLiveQty: true
          };
        }
        return item;
      });
    });
  };

  const handleNotItemLive = () => {
    setChangeQuantity(true);
    setDataInventory((prevData) => {
      return prevData?.map((item) => {
        if (selectedItems?.includes(item?.id)) {
          return {
            ...item,
            isUseLiveQty: false
          };
        }
        return item;
      });
    });
  };

  const handleToggleLiveQuantity = (indexItem: number) => {
    setDataInventory((prevTableData) => {
      const updatedData = prevTableData?.map((item, i) =>
        i === indexItem
          ? {
              ...item,
              isUseLiveQty: !item.isUseLiveQty
            }
          : item
      );
      return updatedData;
    });
  };

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
          changeQuantity={changeQuantity}
          handleCancel={handleCancel}
          handleSaveChanges={handleSaveChanges}
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
            dataInventory={dataInventory as Inventory[]}
            handleToggleLiveQuantity={handleToggleLiveQuantity}
            setDataInventory={setDataInventory}
            selectAction={
              <Dropdown className="left-0 w-[180px] dark:bg-gunmetal" mainMenu={<IconAction />}>
                <div className="rounded-lg ">
                  <Button className="w-full hover:bg-neutralLight ">
                    <span className="items-start text-lightPrimary  dark:text-santaGrey">
                      Delete
                    </span>
                  </Button>
                  <Button className="w-full hover:bg-neutralLight" onClick={handleItemLive}>
                    <span className="items-start text-lightPrimary  dark:text-santaGrey">
                      Use live inventory
                    </span>
                  </Button>
                  <Button
                    className={clsx('w-full', {
                      'hover:bg-neutralLight': isValueUseLiveQuantity
                    })}
                    onClick={handleNotItemLive}
                    disabled={!isValueUseLiveQuantity}
                  >
                    <span className="items-start text-lightPrimary dark:text-santaGrey">
                      Not use live inventory
                    </span>
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

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import IconAction from 'public/three-dots.svg';
import DeleteIcon from 'public/delete.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListProductSeries } from '../../interface';
import { ProductSeriesItemActionMenu } from '../ProductSeriesItemActionMenu';
import { ChangeEvent } from 'react';

type TableProductSeriesProps = {
  headerTable: {
    id: string;
    label: string;
  }[];
  selectedItems: number[];
  onSelectAll: () => void;
  onSelectItem: (id: number) => void;
  totalCount: number;
  onPageChange: (value: string | number) => void;
  page: number;
  rowsPerPage: number;
  loading: boolean;
  dataProduct: ListProductSeries;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => Promise<void>;
  onChangePerPage: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export const TableProductSeries = (props: TableProductSeriesProps) => {
  const router = useRouter();

  const {
    headerTable,
    selectedItems,
    onSelectAll,
    onSelectItem,
    totalCount,
    onPageChange,
    page,
    rowsPerPage,
    loading,
    dataProduct,
    onViewDetailItem,
    onDeleteItem,
    onChangePerPage
  } = props;

  const renderBodyTable = dataProduct.results?.map((row) => ({
    id: row.id || '',
    series: row.series || '',
    created_at: dayjs(row.created_at).format('MM/DD/YYYY') || '',
    action: (
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center"
      >
        <div className="absolute">
          <ProductSeriesItemActionMenu
            row={row}
            onViewDetailItem={onViewDetailItem}
            onDeleteItem={onDeleteItem}
          />
        </div>
      </div>
    )
  }));

  return (
    <Table
      onChangePerPage={onChangePerPage}
      columns={headerTable}
      loading={loading}
      rows={renderBodyTable}
      isPagination
      isSelect={true}
      selectedItems={selectedItems}
      selectAllTable={onSelectAll}
      selectItemTable={onSelectItem}
      totalCount={totalCount}
      siblingCount={1}
      onPageChange={onPageChange}
      currentPage={page + 1}
      pageSize={rowsPerPage}
      onClickItem={(id) => router.push(`/product-series/${id}`)}
      selectAction={
        <Dropdown className="left-0 w-[160px] dark:bg-gunmetal" mainMenu={<IconAction />}>
          <div className="rounded-lg ">
            <Button>
              <DeleteIcon />
              Delete
            </Button>
          </div>
        </Dropdown>
      }
    />
  );
};

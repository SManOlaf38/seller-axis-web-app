import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListProductSeries } from '../../interface';
import { ProductSeriesItemActionMenu } from '../ProductSeriesItemActionMenu';

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
    onDeleteItem
  } = props;

  const renderBodyTable = dataProduct.results?.map((row) => ({
    id: row.id || '',
    series: row.series || '',
    created_at: dayjs(row.created_at).format('YYYY-MM-DD') || '',
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
  );
};
import dayjs from 'dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import IconAction from 'public/three-dots.svg';
import DeleteIcon from 'public/delete.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListProductType } from '../../interface';
import { ProductItemActionMenu } from '../ProductItemActionMenu';

type TableProductProps = {
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
  dataProduct: ListProductType;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => Promise<void>;
};

export const TableProduct = (props: TableProductProps) => {
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
    image:
      (
        <Image
          src={row?.image || '/userAccount.svg'}
          width={20}
          height={20}
          alt="Picture of the author"
        />
      ) || '',
    sku: row.sku || '',
    unit_of_measure: row.unit_of_measure || '',
    product_series: row.product_series.series || '',
    available: row.available || '',
    upc: row.upc || '',
    unit_cost: row.unit_cost || '',
    weight_unit: row?.weight_unit || '',
    qty_on_hand: row.qty_on_hand || '',
    qty_pending: row.qty_pending || '',
    qty_reserve: row.qty_reserve || '',
    description: row.description || '',
    created_at: dayjs(row.created_at).format('YYYY-MM-DD') || '',
    action: (
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center"
      >
        <ProductItemActionMenu
          row={row}
          onViewDetailItem={onViewDetailItem}
          onDeleteItem={onDeleteItem}
        />
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
      currentPage={page}
      pageSize={rowsPerPage}
      onClickItem={(id) => router.push(`/products/${id}`)}
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

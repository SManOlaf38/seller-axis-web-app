import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

import IconAction from 'public/three-dots.svg';
import DeleteIcon from 'public/delete.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Table } from '@/components/ui/Table';
import type { ListProductAlias } from '../../interface';
import { ProductAliasItemActionMenu } from '../ProductAliasItemActionMenu';

type TableProductAliasProps = {
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
  dataProduct: ListProductAlias;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => Promise<void>;
};

export const TableProductAlias = (props: TableProductAliasProps) => {
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
    sku: row.sku || '',
    product: row.product?.sku || '',
    sku_quantity: row.sku_quantity || '',
    merchant_sku: row.merchant_sku || '',
    vendor_sku: row.vendor_sku || '',
    retailer: row.retailer?.name || '',
    upc: row.upc || '',
    created_at: dayjs(row.created_at).format('MM/DD/YYYY') || '',
    action: (
      <div
        onClick={(event) => event.stopPropagation()}
        className="flex items-center justify-center"
      >
        <div className="absolute">
          <ProductAliasItemActionMenu
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
      onClickItem={(id) => router.push(`/product-aliases/${id}`)}
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

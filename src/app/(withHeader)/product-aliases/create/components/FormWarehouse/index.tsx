import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import dayjs from 'dayjs';

import { DATA_AVAILABLE } from '@/app/(withHeader)/products/constants';
import { RetailerWarehouse } from '@/app/(withHeader)/retailer-warehouse/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import DeleteIcon from 'public/delete.svg';
import DetailIcon from 'public/detail.svg';
import IconAction from 'public/three-dots.svg';
import { Items } from '../../containers';

export const headerTableWarehouse = [
  {
    id: 'retailer_warehouse',
    label: 'Retailer warehouse'
  },
  {
    id: 'qty_on_hand',
    label: 'QTY on hand'
  },
  {
    id: 'next_available_qty',
    label: 'Next available QTY'
  },
  {
    id: 'next_available_date',
    label: 'Next available date'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

interface FormWarehouseProps {
  error: string;
  errors: FieldErrors<any>;
  control: Control<any, any>;

  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  dataRetailerWarehouse: RetailerWarehouse[];
  onGetRetailerWarehouse: () => Promise<void>;
  retailerArray: [Items];
  errorMessage: string;
  isLoadingProductWarehouse: boolean;
  handleUpdateProductWarehouse: (data: Items) => void;
  handleCancelUpdate: () => void;
  isUpdate: boolean;
  handleDeleteRetailerArray: (data: Items) => Promise<void>;
}

const FormWarehouse = ({
  errors,
  control,
  handleSearch,
  isEdit,
  dataRetailerWarehouse,
  onGetRetailerWarehouse,
  retailerArray,
  errorMessage,
  isLoadingProductWarehouse,
  handleUpdateProductWarehouse,
  handleCancelUpdate,
  isUpdate,
  handleDeleteRetailerArray
}: FormWarehouseProps) => {
  const renderBodyTable = retailerArray?.map((row: Items) => ({
    retailer_warehouse: row?.retailer_warehouse?.label || '-',
    qty_on_hand: row.qty_on_hand || '-',
    next_available_qty: row.next_available_qty || '-',
    next_available_date: dayjs(row.next_available_date).format('DD/MM/YYYY') || '-',
    status: row.status || '-',

    action: (
      <div className="flex items-center justify-center">
        <div className="absolute">
          <Dropdown mainMenu={<IconAction />} className="w-24">
            <div className="z-50 rounded-lg ">
              <Button type="button" onClick={() => handleUpdateProductWarehouse(row)}>
                <DetailIcon />
                Update
              </Button>
              <Button onClick={() => handleDeleteRetailerArray(row)} type="button">
                <DeleteIcon />
                Delete
              </Button>
            </div>
          </Dropdown>
        </div>
      </div>
    )
  }));

  return (
    <div className="grid w-full grid-cols-1 gap-4">
      {isEdit && (
        <div className="my-4 grid w-full grid-cols-1 gap-4">
          <Card>
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Controller
                  control={control}
                  name="retailer_warehouse"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        dataRetailerWarehouse.map((item: any) => ({
                          value: item.id,
                          label: item.name
                        })) || []
                      }
                      handleChangeText={handleSearch}
                      required
                      label="Retailer Warehouse"
                      name="retailer_warehouse"
                      placeholder="Select Retailer Warehouse"
                      onReload={onGetRetailerWarehouse}
                      pathRedirect="/retailer_warehouses/create"
                      error={errors.retailer_warehouse?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Status"
                      options={DATA_AVAILABLE}
                      name="status"
                      error={errors.status?.message?.toString()}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="qty_on_hand"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter QTY on hand"
                      label="QTY on hand"
                      required
                      type="number"
                      name="qty_on_hand"
                      error={errors.qty_on_hand?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="next_available_qty"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter next available qty"
                      label="Next available qty"
                      required
                      type="number"
                      name="next_available_qty"
                      error={errors.next_available_qty?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="next_available_date"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter next available date"
                      label="Next available date"
                      required
                      type="date"
                      name="next_available_date"
                      error={errors.next_available_date?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className="my-4 flex flex-col items-end">
              {isUpdate ? (
                <div className="flex items-center gap-4">
                  <Button onClick={handleCancelUpdate} className="bg-primary500" type="button">
                    Cancel
                  </Button>
                  <Button
                    isLoading={isLoadingProductWarehouse}
                    disabled={isLoadingProductWarehouse}
                    // onClick={handleUpdateRetailerArray}
                    className="bg-primary500"
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <Button
                  isLoading={isLoadingProductWarehouse}
                  disabled={isLoadingProductWarehouse}
                  // onClick={handleAddRetailerArray}
                  className="bg-primary500"
                >
                  Add
                </Button>
              )}

              {errorMessage && (
                <p className="mb-2 mt-1 block text-sm font-medium text-red">
                  {errorMessage as string}
                </p>
              )}
            </div>
          </Card>

          <Table
            columns={headerTableWarehouse}
            loading={false}
            rows={renderBodyTable}
            totalCount={0}
            siblingCount={1}
            onPageChange={() => {}}
            currentPage={10}
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
};

export default FormWarehouse;

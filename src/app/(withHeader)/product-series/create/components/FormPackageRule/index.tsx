import { ChangeEvent } from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import { Box } from '@/app/(withHeader)/box/interface';
import { DataPackageRule, Product } from '@/app/(withHeader)/products/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import DeleteIcon from 'public/delete.svg';
import DetailIcon from 'public/detail.svg';
import IconAction from 'public/three-dots.svg';

export const headerTablePackageRule = [
  {
    id: 'max_quantity',
    label: 'Max quantity'
  },
  {
    id: 'box',
    label: 'Box'
  },
  {
    id: 'product',
    label: 'Product'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

interface FormPackageRuleProps {
  error: string;
  errors: FieldErrors<any>;
  control: Control<any, any>;

  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  isEdit: boolean;
  dataBoxes: Box[];
  onGetBoxes: () => Promise<void>;
  packageRules: DataPackageRule[];
  errorMessage: string;
  isLoadingProductWarehouse: boolean;
  handleEditPackageRule: (data: DataPackageRule) => void;
  handleCancelUpdate: () => void;
  isUpdate: boolean;
  handleDeletePackageRule: (data: DataPackageRule) => Promise<void>;
  dataProduct: Product[];
}

const FormPackageRule = ({
  errors,
  control,
  handleSearch,
  isEdit,
  dataBoxes,
  onGetBoxes,
  packageRules,
  errorMessage,
  isLoadingProductWarehouse,
  handleEditPackageRule,
  handleCancelUpdate,
  isUpdate,
  handleDeletePackageRule,
  dataProduct
}: FormPackageRuleProps) => {
  const renderBodyTable = packageRules?.map((row: any) => ({
    max_quantity: row.max_quantity || '-',
    box: row?.box?.label || '-',
    product: row?.product?.label || '-',
    action: (
      <div className="flex items-center justify-center">
        <div className="absolute">
          <Dropdown mainMenu={<IconAction />} className="w-24">
            <div className="z-50 rounded-lg ">
              <Button type="button" onClick={() => handleEditPackageRule(row)}>
                <DetailIcon />
                Update
              </Button>
              <Button onClick={() => handleDeletePackageRule(row)} type="button">
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
                  name="box"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        dataBoxes?.map((item: Box) => ({
                          label: item?.name,
                          value: item?.id
                        })) || []
                      }
                      handleChangeText={handleSearch}
                      required
                      label="Boxes"
                      name="box"
                      placeholder="Select Boxes"
                      onReload={onGetBoxes}
                      pathRedirect="/box/create"
                      error={errors.box?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="max_quantity"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Enter Max quantity"
                      label="Max quantity"
                      required
                      type="number"
                      name="max_quantity"
                      error={errors.max_quantity?.message}
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
                    className="bg-primary500"
                  >
                    Update
                  </Button>
                </div>
              ) : (
                <Button
                  isLoading={isLoadingProductWarehouse}
                  disabled={isLoadingProductWarehouse}
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
            columns={headerTablePackageRule}
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

export default FormPackageRule;

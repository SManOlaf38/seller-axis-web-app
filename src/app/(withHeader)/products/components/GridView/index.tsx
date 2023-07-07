import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { Pagination } from '@/components/ui/Pagination';
import type { ListProductType, Product } from '../../interface';

interface GridViewProductProp {
  loading: boolean;
  currentPage: number;
  totalCount: number;
  dataProduct: ListProductType;
  onPageChange: (value: string | number) => void;
  onViewDetailItem: (id: number) => void;
  onDeleteItem: (id: number) => void;
}

const RenderItem = ({ title, value }: { title: string; value: string | number }) => {
  return (
    <div className="flex w-full gap-4">
      <div className="w-2/5">
        <h3 className="text-xs font-medium text-santaGrey">{title}:</h3>
      </div>
      <div className="w-3/5">
        <h3 className="whitespace-nowrap text-[14px] text-xs font-normal leading-4">{value}</h3>
      </div>
    </div>
  );
};

const RenderItemSkeleton = () => {
  return (
    <div className="relative flex w-full gap-2">
      <div className="w-2/5">
        <div className="my-1 h-2 w-full bg-gray-500 " />
      </div>
      <div className="w-3/5">
        <div className="my-1 h-2 w-full bg-gray-500 " />
      </div>
    </div>
  );
};

export const GridViewProduct = (props: GridViewProductProp) => {
  const {
    onViewDetailItem,
    onDeleteItem,
    onPageChange,
    currentPage,
    loading,
    dataProduct,
    totalCount
  } = props;

  return (
    <div className="flex h-full flex-col gap-4">
      {loading ? (
        <div className="grid grid-flow-row-dense grid-cols-4 gap-4">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <Card key={index} className="block h-full rounded-lg border border-iridium p-4">
                <div className="flex flex-col gap-2">
                  {Array(7)
                    .fill(0)
                    .map((_, index) => (
                      <RenderItemSkeleton key={index} />
                    ))}
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-flow-row-dense gap-4 max-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {dataProduct.results.map((row: Product) => (
              <div className="relative" key={row.id}>
                <Card className="block h-full p-4">
                  <div className="absolute right-2 top-2">
                    <Dropdown
                      mainMenu={
                        <Image
                          src="/three-dot.svg"
                          width={20}
                          height={20}
                          alt="Picture of the author"
                        />
                      }
                      className="w-[160px] dark:bg-gunmetal"
                    >
                      <div className="z-50 rounded-lg ">
                        <Button onClick={() =>  onViewDetailItem(row.id)}>
                          <Image
                            src="/detail.svg"
                            width={13}
                            height={13}
                            alt="Picture of the author"
                          />
                          Detail
                        </Button>
                        <Button onClick={() => onDeleteItem(row.id)}>
                          <Image
                            src="/delete.svg"
                            width={13}
                            height={13}
                            alt="Picture of the author"
                          />
                          Delete
                        </Button>
                      </div>
                    </Dropdown>
                  </div>
                  <div className="flex flex-col gap-2">
                    <RenderItem title={'SKU'} value={row.sku} />
                    <RenderItem title={'Unit of measure'} value={row.unit_of_measure} />
                    <RenderItem title={'Available'} value={row.available} />
                    <RenderItem title={'Description'} value={row.description} />
                    <RenderItem title={'Unit cost'} value={row.unit_cost} />
                    <RenderItem title={'On hand'} value={row.qty_on_hand} />
                    <RenderItem title={'Reserve'} value={row.qty_reserve} />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
      {dataProduct.results?.length === 0 && !loading && (
        <div className="flex items-center justify-center pt-20">No data</div>
      )}

      <div className="flex items-center justify-center">
        <div className="absolute bottom-10 items-center justify-center">
          {totalCount && (
            <Pagination
              onPageChange={onPageChange}
              totalCount={totalCount}
              siblingCount={1}
              currentPage={currentPage}
              pageSize={10}
              previousBtn={
                <Image
                  src="/previous-icon.svg"
                  width={20}
                  height={20}
                  alt="Picture of the author"
                />
              }
              nextBtn={
                <Image src="/next-icon.svg" width={20} height={20} alt="Picture of the author" />
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

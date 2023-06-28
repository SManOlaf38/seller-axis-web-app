import Image from 'next/image';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface IProp {
  title: string;
  addTitle: string;
  search: string;
  typeLayout?: boolean;
  onListLayout?: () => void;
  onGridLayout?: () => void;
  onChangeSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleModal: () => void;
  onSearchModal: () => void;
}

export const SubBar = ({
  search,
  title,
  typeLayout,
  addTitle,
  onListLayout,
  onGridLayout,
  onChangeSearch,
  onSearchModal,
  onHandleModal,
}: IProp) => {
  return (
    <div className="flex justify-between gap-2 w-full mb-6">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="flex gap-[8px]">
        <div className="max-sm:hidden md:block">
          <Input
            placeholder="Search..."
            className="h-full border-none py-3 pl-9 pr-3"
            value={search}
            onChange={onChangeSearch}
            startIcon={
              <Image
                src="/search.svg"
                width={20}
                height={20}
                alt="Picture of the author"
              />
            }
          />
        </div>
        <div className="max-sm:block sm:hidden">
          <Button
            className="bg-[#2F3033] px-3 py-3"
            onClick={onSearchModal}
          >
            <Image
              src="/search.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          </Button>
        </div>

        <Button
          className={'flex items-center bg-[#4480F7] py-2  max-sm:hidden'}
          onClick={onHandleModal}
        >
          <div className="flex items-center gap-[8px]">
            <Image
              src="/plus.svg"
              width={15}
              height={15}
              alt="Picture of the author"
            />
            {addTitle}
          </div>
        </Button>

        {
          onListLayout && <Button
            className={`px-3 py-3 ${!typeLayout && 'bg-[#2F3033]'}`}
            onClick={onListLayout}
          >
            <Image
              src="/list-icon.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          </Button>
        }

        {

          onGridLayout && <Button
            className={`px-3 py-3 ${typeLayout && 'bg-[#2F3033]'}`}
            onClick={onGridLayout}
          >
            <Image
              src="/grid-icon.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          </Button>
        }


      </div>
    </div>
  );
};

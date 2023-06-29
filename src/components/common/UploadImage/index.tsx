import clsx from 'clsx';
import Image from 'next/image';

import { Button } from '@/components/ui/Button';

interface IProp {
  label: string;
  name: string;
  image: string;
  onChangeImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: () => void;
}
export const UploadImageCom = ({
  label,
  name,
  image,
  onChangeImage,
  onDeleteImage,
}: IProp) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      <div className="flex w-full items-center justify-center">
        <label
          className={clsx(
            'flex w-full cursor-pointer flex-col items-center justify-center rounded-lg ',
            { 'cursor-pointer border border-dashed border-iridium': !image },
          )}
        >
          <div className={clsx({ hidden: !!image })}>
            <div className="flex flex-col items-center justify-center pb-6 pt-5 text-sm">
              <Image
                src="/upload.svg"
                width={20}
                height={20}
                alt="Picture of the author"
              />
              <p>
                Drop the file here or
                <span className="text-dodgerBlue">click</span> to upload
              </p>
              <p className="text-[#8A8C8E]">
                Only JPG and PNG files (3MB) are accepted.
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              name={name}
              onChange={onChangeImage}
            />
          </div>
          <div className={`${!!image ? 'relative' : 'hidden'} `}>
            <Image
              src={image}
              width={80}
              height={80}
              alt="Picture of the author"
            />
            <div className="opacity-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full">
              <div className="flex items-end justify-end">
                <Button onClick={onDeleteImage}>
                  <Image
                    src="/delete.svg"
                    width={20}
                    height={20}
                    alt="Picture of the author"
                  />
                </Button>
              </div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

import { maxSizeUploadAvatar } from '@/utils/constants';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

interface Props {
  onChange?: (fileImage?: File) => void;
  errorImage: string | undefined;
  setErrorImage: Dispatch<SetStateAction<string | undefined>>;
}

export default function InputFile({ onChange, errorImage, setErrorImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileFromLocal = event.target.files?.[0];
      fileInputRef.current?.setAttribute('value', '');
      if (
        fileFromLocal &&
        (fileFromLocal.size >= maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))
      ) {
        setErrorImage('Maximum file size 3 MB');
      } else {
        setErrorImage('');
        onChange && onChange(fileFromLocal);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onChange]
  );

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div>
      <input
        className="hidden"
        type="file"
        name="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={(event) => onFileChange(event)}
        onClick={(event) => {
          (event.target as any).value = null;
        }}
      />
      {errorImage && <p className="block text-sm font-medium text-red-800">{errorImage}</p>}
      <span onClick={() => handleUpload()} className="cursor-pointer text-sm text-dodgerBlue">
        Edit Avatar
      </span>
    </div>
  );
}

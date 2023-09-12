import { ChangeEvent } from 'react';
import IconUploadImage from 'public/upload.svg';

export default function FileUpload({
  accept,
  onChange
}: {
  accept: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex w-full items-center justify-center">
      <label className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-dodgeBlue">
        <div className="flex flex-col items-center justify-center py-4 text-sm">
          <IconUploadImage />
          <span className="text-dodgerBlue">Click the file here to upload</span>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => onChange(event)}
          multiple
        />
      </label>
    </div>
  );
}

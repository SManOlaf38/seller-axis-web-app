import { ChangeEvent, useState } from 'react';

import ImportIcon from 'public/import-icon.svg';
import DeleteIcon from 'public/delete.svg';
import DocIcon from 'public/doc-icon.svg';
import FileUpload from '../FileUpload';
import { Modal } from '@/components/ui/Modal';
import { readFileAsync } from '@/utils/utils';
import { Button } from '@/components/ui/Button';

export default function ModalImportFile({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File[]>([]);
  const [arrayFileCSV, setArrayFileCSV] = useState([]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event?.target?.files || []);
    if (selectedFiles && selectedFiles.length > 0) {
      const filePromises = selectedFiles?.map(async (file) => {
        const text = await readFileAsync(file);
        csvFileToArray(text as string);
        return file;
      });

      const updatedFiles = await Promise.all(filePromises);
      setFile([...file, ...updatedFiles]);
    }
  };

  const csvFileToArray = (text: string) => {};

  const handleDeleteFile = (index: number) => {
    const newFiles = [...file];
    newFiles.splice(index, 1);
    setFile(newFiles);
  };

  const handleCancel = () => {
    onClose();
    setFile([]);
  };

  const handleImportFile = () => {};

  return (
    <Modal open={open} onClose={onClose}>
      <div className="pb-4">
        <div className="flex items-center pb-2">
          <ImportIcon />
          <h3 className="ml-2 text-lg font-semibold">Import Products</h3>
        </div>
        <p className="text-sm font-normal text-santaGrey">
          Upload a XLSX to import Products Data to system
        </p>
      </div>
      <FileUpload onChange={handleFileChange} accept=".csv" />
      {file?.length > 0 && (
        <>
          {file?.map((item, index) => (
            <div
              key={index}
              className="my-4 flex items-center justify-between rounded-lg border border-transparent bg-neutralLight p-2 text-lightPrimary dark:bg-gunmetal dark:text-white"
            >
              <div className="flex items-center">
                <DocIcon />
                <p className="ml-2">{item?.name}</p>
              </div>
              <div className="cursor-pointer" onClick={() => handleDeleteFile(index)}>
                <DeleteIcon />
              </div>
            </div>
          ))}
          <div className="flex items-center justify-end">
            <Button
              onClick={handleCancel}
              color="dark:bg-gunmetal bg-buttonLight"
              className="mr-2 flex justify-center"
            >
              Cancel
            </Button>
            <Button className="flex justify-center bg-dodgerBlue" onClick={handleImportFile}>
              Import File
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}

import { useState } from 'react';

import { getPresignedUrl } from '@/utils/utils';

export default function useHandleImage() {
  const [image, setImage] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onDeleteImage = () => {
    setFile(null);
    setImage('');
    setFile(null);
  };

  const handleUploadImages = async (file: File | null) => {
    const data = await getPresignedUrl();

    if (data[0].url && file) {
      const formData = new FormData();
      formData.append('key', data[0].fields.key);
      formData.append('policy', data[0].fields['policy']);
      formData.append('x-amz-algorithm', data[0].fields['x-amz-algorithm']);
      formData.append('x-amz-credential', data[0].fields['x-amz-credential']);
      formData.append('x-amz-date', data[0].fields['x-amz-date']);
      formData.append('x-amz-security-token', data[0].fields['x-amz-security-token']);
      formData.append('x-amz-signature', data[0].fields['x-amz-signature']);
      formData.append('file', file);
      await fetch(data[0].url, {
        method: 'POST',
        body: formData
      });
      return `${data[0].url}/${data[0].fields.key}` || '';
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        setFile(file);
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.log('Error', error);
    }
  };

  const onChangeImage = (value: string) => {
    setImage(value);
  };

  return {
    file,
    image,
    onDeleteImage,
    handleImage,
    onChangeImage,
    handleUploadImages
  };
}

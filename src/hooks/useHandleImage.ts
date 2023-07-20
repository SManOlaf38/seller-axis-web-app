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

    if (data[0] && file) {
      const formData = new FormData();
      formData.append('image', file);
      await fetch(data[0].presigned_url, {
        method: 'PUT',
        body: file
      });
      return `${data[0].image_url}` || '';
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

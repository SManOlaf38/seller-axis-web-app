import { useState } from 'react';
import { getPresignedUrl } from '@/utils/utils';

export default function useHandleImage() {
  const [image, setImage] = useState('/userAccount.svg');
  const [file, setFile] = useState<File | null>(null);

  const onDeleteImage = () => {
    setFile(null);
    setImage('');
    setFile(null);
  };

  const handleUploadImages = async (file: File | null) => {
    const { url, media_id } = await getPresignedUrl();
    if (url.url && file) {
      const formData = new FormData();
      formData.append('acl', url.fields.acl);
      formData.append('key', url.fields.key);
      formData.append('policy', url.fields['policy']);
      formData.append('x-amz-algorithm', url.fields['x-amz-algorithm']);
      formData.append('x-amz-credential', url.fields['x-amz-credential']);
      formData.append('x-amz-date', url.fields['x-amz-date']);
      formData.append('x-amz-signature', url.fields['x-amz-signature']);
      formData.append('file', file);
      await fetch(url.url, {
        method: 'POST',
        body: formData,
      });
      return {
        media_id,
        url: `${url.url}/${url.fields.key}`,
      };
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
    handleUploadImages,
  };
}

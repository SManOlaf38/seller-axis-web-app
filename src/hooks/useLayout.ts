import { useState } from 'react';
import { LAYOUTS } from '@/constants';

export default function useLayout() {
  const [layout, setLayout] = useState(LAYOUTS.LIST);

  const handleChangeLayout = (layout: string) => {
    setLayout(layout);
  };

  return { layout, handleChangeLayout };
}

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useDebounce from './useDebounce';

const useSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchBy = searchParams.get('search');
  const params = new URLSearchParams(searchParams);

  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    params.set('search', e.target.value);
    router.push(`${pathname}?${params}`);
  };
  const debouncedSearchTerm = useDebounce(search, 500);

  useEffect(() => {
    searchBy && setSearch(searchBy);
  }, [searchBy]);

  return {
    search,
    debouncedSearchTerm,
    handleSearch,
    setSearch
  };
};

export default useSearch;
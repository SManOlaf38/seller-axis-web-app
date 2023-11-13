import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import useDebounce from './useDebounce';

const useSearch = (searchBarId: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchBy = searchParams.get(`search_${searchBarId}`);
  const params = new URLSearchParams(searchParams);

  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>, searchPage?: boolean) => {
    setSearch(e.target.value);
    if (searchPage) {
      params.set(`search_${searchBarId}`, e.target.value);
      router.push(`${pathname}?${params}`);
    }
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

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      // Prefetch search results
      await queryClient.prefetchQuery({
        queryKey: [`/api/search?q=${encodeURIComponent(searchQuery)}`],
      });
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
  };
};

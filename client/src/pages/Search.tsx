import { useLocation, Link } from 'wouter';
import { useSearch } from '@/hooks/useSearch';
import { useQuery } from '@tanstack/react-query';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchX } from 'lucide-react';

const Search = () => {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const queryParam = urlParams.get('q') || '';
  
  const { searchQuery, setSearchQuery, handleSearch } = useSearch();
  
  if (searchQuery !== queryParam) {
    setSearchQuery(queryParam);
  }
  
  const { data: searchResults, isLoading } = useQuery({
    queryKey: [`/api/search?q=${encodeURIComponent(queryParam)}`],
    enabled: !!queryParam,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-8 bg-[#141414]">
        <h1 className="text-2xl text-white mb-4">Search Results for "{queryParam}"</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array(12).fill(0).map((_, i) => (
            <Skeleton key={i} className="w-full h-[150px] rounded-sm" />
          ))}
        </div>
      </div>
    );
  }
  
  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-8 bg-[#141414] flex flex-col items-center justify-center">
        <SearchX className="h-24 w-24 text-[#E5E5E5] mb-4" />
        <h1 className="text-2xl text-white mb-2">No results found for "{queryParam}"</h1>
        <p className="text-[#E5E5E5] mb-6">Try adjusting your search or browse our categories</p>
        <Link href="/">
          <a className="btn-netflix">Browse Home</a>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 bg-[#141414]">
      <h1 className="text-2xl text-white mb-4">Search Results for "{queryParam}"</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {searchResults.map((movie) => (
          <div key={movie.id} className="w-full">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;

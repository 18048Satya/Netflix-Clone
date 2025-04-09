import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import FeaturedBanner from '@/components/FeaturedBanner';
import MovieCategoryRow from '@/components/MovieCategoryRow';
import { useLocation } from 'wouter';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = urlParams.get('category');
  
  const { data: featuredMovie, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/movies/featured'],
  });
  
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
  });
  
  const { data: myList, isLoading: myListLoading } = useQuery({
    queryKey: ['/api/my-list'],
  });
  
  const { data: continueWatching, isLoading: continueWatchingLoading } = useQuery({
    queryKey: ['/api/progress'],
  });

  if (featuredLoading || categoriesLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      {featuredMovie && <FeaturedBanner movie={featuredMovie} />}
      
      <main className="pt-8 pb-16">
        {/* Continue Watching */}
        {!continueWatchingLoading && continueWatching && continueWatching.length > 0 && (
          <MovieCategoryRow 
            title="Continue Watching" 
            movies={continueWatching}
          />
        )}
        
        {/* My List */}
        {!myListLoading && myList && myList.length > 0 && (
          <MovieCategoryRow 
            title="My List" 
            movies={myList}
          />
        )}
        
        {/* Categories */}
        {categories && categories
          .filter((category: any) => !categoryFilter || category.name.toLowerCase() === categoryFilter.toLowerCase())
          .map((category: any) => (
            <MovieCategoryRow 
              key={category.id} 
              title={category.name} 
              movies={category.movies}
            />
          ))}
      </main>
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Featured Banner Loading */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <Skeleton className="w-full h-full" />
      </div>
      
      <main className="pt-8 pb-16">
        {/* Row Loading */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-8 px-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="flex space-x-2 overflow-x-hidden">
              {[1, 2, 3, 4, 5, 6].map((j) => (
                <Skeleton key={j} className="flex-none w-[160px] md:w-[200px] h-[120px] md:h-[150px] rounded-sm" />
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;

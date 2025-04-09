import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import FeaturedBanner from '@/components/FeaturedBanner';
import MovieCategoryRow from '@/components/MovieCategoryRow';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryPageProps {
  categoryType: 'tv-shows' | 'movies' | 'new' | 'my-list';
}

const CategoryPage = ({ categoryType }: CategoryPageProps) => {
  const [pageTitle, setPageTitle] = useState('');
  
  useEffect(() => {
    // Set page title based on category
    switch (categoryType) {
      case 'tv-shows':
        setPageTitle('TV Shows');
        break;
      case 'movies':
        setPageTitle('Movies');
        break;
      case 'new':
        setPageTitle('New & Popular');
        break;
      case 'my-list':
        setPageTitle('My List');
        break;
      default:
        setPageTitle('Browse');
    }
  }, [categoryType]);

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

  if (featuredLoading || categoriesLoading || 
      (categoryType === 'my-list' && myListLoading)) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Only show featured banner on TV Shows and Movies pages */}
      {featuredMovie && ['tv-shows', 'movies'].includes(categoryType) && (
        <FeaturedBanner movie={featuredMovie} />
      )}
      
      <main className="pt-8 pb-16">
        {/* Page Title Section */}
        <div className="container mx-auto px-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{pageTitle}</h1>
        </div>

        {/* My List Category */}
        {categoryType === 'my-list' && !myListLoading && myList && (
          <div className="container mx-auto px-4">
            {myList.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {myList.map((movie: any) => (
                  <div key={movie.id} className="mb-6">
                    <img 
                      src={movie.thumbnailUrl} 
                      alt={movie.title} 
                      className="w-full rounded object-cover aspect-video hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="text-white text-sm mt-2">{movie.title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white text-lg">Your list is empty. Add titles to your list to watch them later.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Continue Watching - Only on normal and New pages */}
        {!continueWatchingLoading && 
         continueWatching && 
         continueWatching.length > 0 && 
         categoryType !== 'my-list' && (
          <MovieCategoryRow 
            title="Continue Watching" 
            movies={continueWatching}
          />
        )}
        
        {/* Filter categories based on categoryType */}
        {categories && categoryType !== 'my-list' && categories
          .filter((category: any) => {
            if (categoryType === 'tv-shows') {
              return category.name.toLowerCase().includes('tv') || 
                    category.name.toLowerCase().includes('series') ||
                    category.name.toLowerCase().includes('shows');
            } else if (categoryType === 'movies') {
              return !category.name.toLowerCase().includes('tv') && 
                    !category.name.toLowerCase().includes('series');
            } else if (categoryType === 'new') {
              return category.name.toLowerCase().includes('new') || 
                    category.name.toLowerCase().includes('popular') ||
                    category.name.toLowerCase().includes('trending');
            }
            return true;
          })
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
      <div className="relative w-full h-[60vh] md:h-[60vh]">
        <Skeleton className="w-full h-full" />
      </div>
      
      <main className="pt-8 pb-16">
        {/* Title Loading */}
        <div className="container mx-auto px-4 mb-8">
          <Skeleton className="h-10 w-48" />
        </div>

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

export default CategoryPage;
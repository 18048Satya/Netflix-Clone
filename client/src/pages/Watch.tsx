import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import VideoPlayer from '@/components/VideoPlayer';
import { Skeleton } from '@/components/ui/skeleton';

const Watch = () => {
  const [match, params] = useRoute('/watch/:id');
  const movieId = params?.id ? parseInt(params.id) : null;
  
  const { data: movie, isLoading } = useQuery({
    queryKey: [`/api/movies/${movieId}`],
    enabled: !!movieId,
  });
  
  if (isLoading || !movie) {
    return (
      <div className="fixed inset-0 bg-black z-[100]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <svg className="w-12 h-12 text-[#E50914]" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-[#E5E5E5]">Loading video...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return <VideoPlayer movie={movie} />;
};

export default Watch;

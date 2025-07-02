
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Star } from 'lucide-react';
import { categories } from '@/data/knowledgeData';

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: string;
  embedId: string;
  views: string;
  rating: number;
}

interface VideoCardProps {
  video: Video;
  onVideoSelect: (video: Video) => void;
}

const VideoCard = ({ video, onVideoSelect }: VideoCardProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all cursor-pointer">
      <CardHeader className="p-0">
        <div className="relative">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button
              onClick={() => onVideoSelect(video)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 rounded-full"
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
            {video.duration}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            {categories.find(c => c.id === video.category)?.name}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-400">{video.rating}</span>
          </div>
        </div>
        <h3 className="text-white font-semibold mb-2">{video.title}</h3>
        <p className="text-slate-300 text-sm mb-3">{video.description}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{video.views} views</span>
          <Button
            onClick={() => onVideoSelect(video)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Play className="w-3 h-3 mr-1" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;

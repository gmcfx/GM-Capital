import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star } from 'lucide-react';

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

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

const VideoModal = ({ video, onClose }: VideoModalProps) => {
  return (
    <Dialog open={!!video} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {video?.title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${video?.embedId}`}
              title={video?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
          <div className="mt-4">
            <p className="text-slate-300">{video?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
              <span>{video?.views} views</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                {video?.rating}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
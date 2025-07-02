
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Calendar, Clock, Star } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  author: string;
  publishDate: string;
  rating: number;
}

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleModal = ({ article, onClose }: ArticleModalProps) => {
  return (
    <Dialog open={!!article} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {article?.title}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {article?.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {article?.publishDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {article?.readTime} read
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              {article?.rating}
            </div>
          </div>
        </DialogHeader>
        <div 
          className="prose prose-invert max-w-none mt-4"
          dangerouslySetInnerHTML={{ __html: article?.content || '' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Star, Calendar } from 'lucide-react';
import { categories } from '@/data/knowledgeData';

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

interface ArticleCardProps {
  article: Article;
  onArticleSelect: (article: Article) => void;
}

const ArticleCard = ({ article, onArticleSelect }: ArticleCardProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-blue-400 border-blue-400 mb-2">
            {categories.find(c => c.id === article.category)?.name}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-slate-400">{article.rating}</span>
          </div>
        </div>
        <CardTitle className="text-white text-lg">{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 text-sm mb-4">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime}
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {article.author}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {article.publishDate}
          </div>
        </div>
        <Button 
          onClick={() => onArticleSelect(article)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Read Article
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;

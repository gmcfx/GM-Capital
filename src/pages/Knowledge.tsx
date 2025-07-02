import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { articles, videos } from '@/data/knowledgeData';
import KnowledgeHeader from '@/components/knowledge/KnowledgeHeader';
import KnowledgeSearch from '@/components/knowledge/KnowledgeSearch';
import ArticleCard from '@/components/knowledge/ArticleCard';
import VideoCard from '@/components/knowledge/VideoCard';
import ArticleModal from '@/components/knowledge/ArticleModal';
import VideoModal from '@/components/knowledge/VideoModal';

// Use the types from your data file instead of importing from components
type Article = typeof articles[0];
type Video = typeof videos[0];

const Knowledge = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-6 pt-16 sm:pt-0">
        <KnowledgeHeader />

        <KnowledgeSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Articles Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">{t('articles')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onArticleSelect={(article) => setSelectedArticle(article)}
              />
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">{t('videos')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onVideoSelect={(video) => setSelectedVideo(video)}
              />
            ))}
          </div>
        </div>

        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />

        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      </div>
    </div>
  );
};

export default Knowledge;
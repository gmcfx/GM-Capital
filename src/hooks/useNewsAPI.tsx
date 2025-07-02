
import { useState, useEffect } from 'react';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export const useNewsAPI = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFinancialNews = async () => {
    setLoading(true);
    try {
      // Using News API (you can replace with any free financial news API)
      const response = await fetch(
        'https://newsapi.org/v2/everything?q=forex+OR+cryptocurrency+OR+trading&sortBy=publishedAt&language=en&pageSize=10&apiKey=demo' // Replace with actual API key
      );
      
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      } else {
        // Fallback to mock data if API fails
        setArticles([
          {
            title: 'Federal Reserve Announces Interest Rate Decision',
            description: 'The Federal Reserve maintains current interest rates amid economic uncertainty',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: { name: 'Financial Times' }
          },
          {
            title: 'Bitcoin Reaches New Monthly High',
            description: 'Bitcoin surges past $45,000 as institutional adoption continues',
            url: '#',
            publishedAt: new Date(Date.now() - 30 * 60000).toISOString(),
            source: { name: 'CoinDesk' }
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      // Fallback data
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialNews();
    // Refresh news every 15 minutes
    const interval = setInterval(fetchFinancialNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { articles, loading, refreshNews: fetchFinancialNews };
};

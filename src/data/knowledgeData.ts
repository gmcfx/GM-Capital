
import { 
  BookOpen, 
  TrendingUp,
  BarChart3,
  Shield,
  DollarSign
} from 'lucide-react';

export const categories = [
  { id: 'all', name: 'All Content', icon: BookOpen },
  { id: 'basics', name: 'Trading Basics', icon: TrendingUp },
  { id: 'analysis', name: 'Market Analysis', icon: BarChart3 },
  { id: 'risk', name: 'Risk Management', icon: Shield },
  { id: 'strategies', name: 'Trading Strategies', icon: DollarSign },
];

export const articles = [
  {
    id: 1,
    title: 'Introduction to Forex Trading',
    excerpt: 'Learn the fundamentals of foreign exchange trading and how currency markets work.',
    content: `
      <h2>What is Forex Trading?</h2>
      <p>Forex trading involves the simultaneous buying and selling of currencies from different countries. The forex market is the largest financial market in the world, with over $6 trillion traded daily.</p>
      
      <h3>Key Concepts:</h3>
      <ul>
        <li><strong>Currency Pairs:</strong> Currencies are traded in pairs (e.g., EUR/USD, GBP/JPY)</li>
        <li><strong>Base Currency:</strong> The first currency in the pair</li>
        <li><strong>Quote Currency:</strong> The second currency in the pair</li>
        <li><strong>Spread:</strong> The difference between bid and ask prices</li>
      </ul>
      
      <h3>Major Currency Pairs:</h3>
      <p>The most traded currency pairs include:</p>
      <ul>
        <li>EUR/USD (Euro/US Dollar)</li>
        <li>GBP/USD (British Pound/US Dollar)</li>
        <li>USD/JPY (US Dollar/Japanese Yen)</li>
        <li>USD/CHF (US Dollar/Swiss Franc)</li>
      </ul>
      
      <h3>Getting Started:</h3>
      <p>Before you start trading, it's important to:</p>
      <ol>
        <li>Understand the risks involved</li>
        <li>Practice with a demo account</li>
        <li>Learn technical and fundamental analysis</li>
        <li>Develop a trading strategy</li>
        <li>Manage your risk properly</li>
      </ol>
    `,
    category: 'basics',
    readTime: '5 min',
    author: 'Trading Expert',
    publishDate: '2024-01-15',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Technical Analysis Fundamentals',
    excerpt: 'Master the art of reading charts and using technical indicators to make informed trading decisions.',
    content: `
      <h2>Understanding Technical Analysis</h2>
      <p>Technical analysis is the study of price movements and trading volume to predict future market behavior. It's based on the premise that historical price data can help identify patterns and trends.</p>
      
      <h3>Key Principles:</h3>
      <ul>
        <li><strong>Price reflects everything:</strong> All market information is already reflected in the price</li>
        <li><strong>Prices move in trends:</strong> Markets tend to move in identifiable directions</li>
        <li><strong>History repeats:</strong> Market patterns tend to repeat over time</li>
      </ul>
      
      <h3>Essential Chart Types:</h3>
      <ol>
        <li><strong>Line Charts:</strong> Simple representation of closing prices</li>
        <li><strong>Bar Charts:</strong> Show open, high, low, and close prices</li>
        <li><strong>Candlestick Charts:</strong> Visual representation of price action</li>
      </ol>
      
      <h3>Popular Technical Indicators:</h3>
      <ul>
        <li><strong>Moving Averages:</strong> Smooth out price data to identify trends</li>
        <li><strong>RSI (Relative Strength Index):</strong> Measures overbought/oversold conditions</li>
        <li><strong>MACD:</strong> Shows relationship between two moving averages</li>
        <li><strong>Bollinger Bands:</strong> Indicate volatility and potential reversal points</li>
      </ul>
      
      <h3>Support and Resistance:</h3>
      <p>Support levels are price points where buying pressure typically emerges, while resistance levels are where selling pressure increases. Understanding these levels is crucial for entry and exit timing.</p>
    `,
    category: 'analysis',
    readTime: '8 min',
    author: 'Market Analyst',
    publishDate: '2024-01-20',
    rating: 4.9
  },
  {
    id: 3,
    title: 'Risk Management Strategies',
    excerpt: 'Protect your capital with proven risk management techniques and position sizing strategies.',
    content: `
      <h2>The Importance of Risk Management</h2>
      <p>Risk management is arguably the most important aspect of successful trading. It's not about avoiding risk entirely, but about managing it effectively to protect and grow your capital over time.</p>
      
      <h3>Key Risk Management Rules:</h3>
      <ul>
        <li><strong>Never risk more than you can afford to lose</strong></li>
        <li><strong>Use stop-loss orders consistently</strong></li>
        <li><strong>Diversify your trades</strong></li>
        <li><strong>Keep emotions in check</strong></li>
      </ul>
      
      <h3>Position Sizing:</h3>
      <p>Position sizing determines how much capital you allocate to each trade. Common methods include:</p>
      <ul>
        <li><strong>Fixed Percentage:</strong> Risk a fixed percentage of your account (e.g., 2%)</li>
        <li><strong>Fixed Dollar Amount:</strong> Risk a fixed dollar amount per trade</li>
        <li><strong>Volatility-Based:</strong> Adjust position size based on market volatility</li>
      </ul>
      
      <h3>Stop-Loss Strategies:</h3>
      <ol>
        <li><strong>Fixed Stop-Loss:</strong> Set at a predetermined distance from entry</li>
        <li><strong>Trailing Stop:</strong> Moves with favorable price action</li>
        <li><strong>Technical Stop:</strong> Based on support/resistance levels</li>
      </ol>
      
      <h3>Risk-Reward Ratio:</h3>
      <p>Always consider your potential profit versus potential loss before entering a trade. A minimum 1:2 risk-reward ratio is generally recommended, meaning you should aim to make at least $2 for every $1 you risk.</p>
      
      <h3>Emotional Discipline:</h3>
      <p>Successful risk management also involves controlling emotions like fear and greed. Stick to your trading plan and don't let emotions drive your decisions.</p>
    `,
    category: 'risk',
    readTime: '7 min',
    author: 'Risk Management Specialist',
    publishDate: '2024-01-25',
    rating: 4.7
  }
];

export const videos = [
  {
    id: 1,
    title: 'Forex Trading for Beginners - Complete Guide',
    description: 'A comprehensive introduction to forex trading covering currency pairs, pips, spreads, and basic trading concepts.',
    thumbnail: 'https://img.youtube.com/vi/7mNnQCpO4H8/maxresdefault.jpg',
    duration: '15:30',
    category: 'basics',
    embedId: '7mNnQCpO4H8',
    views: '125K',
    rating: 4.8
  },
  {
    id: 2,
    title: 'Cryptocurrency Trading Basics - How to Trade Bitcoin',
    description: 'Learn the fundamentals of cryptocurrency trading, including Bitcoin analysis, altcoins, and crypto market dynamics.',
    thumbnail: 'https://img.youtube.com/vi/pEBJyOFHCCY/maxresdefault.jpg',
    duration: '12:45',
    category: 'basics',
    embedId: 'pEBJyOFHCCY',
    views: '89K',
    rating: 4.6
  },
  {
    id: 3,
    title: 'Technical Analysis - Support and Resistance Trading',
    description: 'Master support and resistance levels in forex and crypto trading to identify key entry and exit points.',
    thumbnail: 'https://img.youtube.com/vi/9Lp0sPhilCk/maxresdefault.jpg',
    duration: '18:20',
    category: 'analysis',
    embedId: '9Lp0sPhilCk',
    views: '67K',
    rating: 4.9
  },
  {
    id: 4,
    title: 'Risk Management in Forex Trading',
    description: 'Essential risk management strategies including position sizing, stop losses, and money management rules.',
    thumbnail: 'https://img.youtube.com/vi/TkPSFCfxEpk/maxresdefault.jpg',
    duration: '14:15',
    category: 'risk',
    embedId: 'TkPSFCfxEpk',
    views: '78K',
    rating: 4.7
  },
  {
    id: 5,
    title: 'Scalping Strategy for Day Trading',
    description: 'Learn effective scalping techniques for quick profits in forex and cryptocurrency markets.',
    thumbnail: 'https://img.youtube.com/vi/gGur-72KLIo/maxresdefault.jpg',
    duration: '22:30',
    category: 'strategies',
    embedId: 'gGur-72KLIo',
    views: '156K',
    rating: 4.5
  },
  {
    id: 6,
    title: 'Moving Averages Trading Strategy',
    description: 'How to use moving averages effectively in forex and crypto trading for trend identification and signals.',
    thumbnail: 'https://img.youtube.com/vi/7nQJL_T9H3M/maxresdefault.jpg',
    duration: '16:40',
    category: 'strategies',
    embedId: '7nQJL_T9H3M',
    views: '92K',
    rating: 4.6
  }
];

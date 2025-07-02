import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  symbol: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  symbol = 'EURUSD'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      console.log('TradingViewChart mounting for symbol:', symbol);
      
      // Clear any existing content
      containerRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: `FX:${symbol}`,
        interval: '5',
        timezone: 'Etc/UTC',
        theme: 'dark',
        style: '1',
        locale: 'en',
        toolbar_bg: '#1e293b',
        enable_publishing: false,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        container_id: 'tradingview_chart',
        studies: [
          'MASimple@tv-basicstudies',
          'RSI@tv-basicstudies'
        ],
        show_popup_button: true,
        popup_width: '1000',
        popup_height: '750',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        gridColor: 'rgba(42, 46, 57, 0.5)',
        overrides: {
          'paneProperties.background': '#1e293b',
          'paneProperties.backgroundType': 'solid',
          'scalesProperties.textColor': '#94a3b8',
          'scalesProperties.lineColor': '#475569',
        }
      });
      
      script.onload = () => {
        console.log('TradingView script loaded successfully');
      };
      
      script.onerror = (error) => {
        console.error('Failed to load TradingView script:', error);
      };
      
      containerRef.current.appendChild(script);
    }
  }, [symbol]);

  return (
    <div className="w-full h-96 bg-slate-800 rounded-lg overflow-hidden">
      <div 
        ref={containerRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default TradingViewChart;
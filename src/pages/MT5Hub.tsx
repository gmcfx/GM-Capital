import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Globe, 
  Shield, 
  Zap, 
  BarChart3,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const MT5Hub = () => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    server: '',
    login: '',
    balance: '$0.00',
    equity: '$0.00',
    margin: '$0.00',
    freeMargin: '$0.00',
    marginLevel: '0.00%'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const platforms = [
    {
      name: 'MT5 Desktop',
      icon: Monitor,
      description: 'Full-featured desktop application for Windows and Mac',
      features: ['Advanced charting', 'Expert Advisors', 'Custom indicators', 'Market depth'],
      downloadUrl: '#',
      version: '5.0.3850'
    },
    {
      name: 'MT5 Mobile',
      icon: Smartphone,
      description: 'Trade on the go with our mobile app',
      features: ['Real-time quotes', 'One-click trading', 'Push notifications', 'Chart analysis'],
      downloadUrl: '#',
      version: '5.0.3840'
    },
    {
      name: 'MT5 WebTrader',
      icon: Globe,
      description: 'Browser-based trading platform',
      features: ['No download required', 'Cross-platform', 'Real-time trading', 'Technical analysis'],
      downloadUrl: '#',
      version: '5.0.3835'
    }
  ];

  // Firestore integration
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const mt5Ref = doc(db, 'users', user.uid, 'mt5', 'connection');
    const unsubscribe = onSnapshot(mt5Ref, (docSnapshot) => {
      try {
        const data = docSnapshot.data();
        if (data) {
          setIsConnected(data.connectionStatus || false);
          setAccountInfo({
            server: data.accountInfo?.server || '',
            login: data.accountInfo?.login || '',
            balance: data.accountInfo?.balance || '$0.00',
            equity: data.accountInfo?.equity || '$0.00',
            margin: data.accountInfo?.margin || '$0.00',
            freeMargin: data.accountInfo?.freeMargin || '$0.00',
            marginLevel: data.accountInfo?.marginLevel || '0.00%'
          });
          setError('');
        }
      } catch (err) {
        setError('Failed to load account data');
        console.error("Error loading data: ", err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError('Failed to load account data');
      console.error("Snapshot error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleConnectionToggle = async () => {
    if (!user) return;

    const newStatus = !isConnected;
    try {
      const mt5Ref = doc(db, 'users', user.uid, 'mt5', 'connection');
      await updateDoc(mt5Ref, {
        connectionStatus: newStatus
      });
    } catch (err) {
      setError('Failed to update connection status');
      console.error("Error updating connection status: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              MT5 Trading Hub
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Access MetaTrader 5 platforms and manage your trading environment
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Connection Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-200">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-white font-medium">
                  {isConnected ? 'Connected to MT5 Server' : 'Disconnected'}
                </span>
              </div>
              <Button
                onClick={handleConnectionToggle}
                disabled={!user || loading}
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                className={isConnected ? "" : "bg-green-600 hover:bg-green-700"}
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : isConnected ? (
                  <Pause className="w-4 h-4 mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {loading ? 'Syncing...' : isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
            
            {isConnected && !loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Server</div>
                  <div className="text-white font-semibold">{accountInfo.server || 'N/A'}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Login</div>
                  <div className="text-white font-semibold">{accountInfo.login || 'N/A'}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Balance</div>
                  <div className="text-green-400 font-semibold">{accountInfo.balance}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Equity</div>
                  <div className="text-blue-400 font-semibold">{accountInfo.equity}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Margin</div>
                  <div className="text-yellow-400 font-semibold">{accountInfo.margin}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Free Margin</div>
                  <div className="text-purple-400 font-semibold">{accountInfo.freeMargin}</div>
                </div>
                <div className="p-3 bg-slate-700/50 rounded">
                  <div className="text-sm text-slate-400">Margin Level</div>
                  <div className="text-red-400 font-semibold">{accountInfo.marginLevel}</div>
                </div>
              </div>
            )}

            {!user && (
              <div className="mt-4 text-center py-4 bg-slate-700/30 rounded">
                <p className="text-slate-300">
                  Please sign in to manage your MT5 connection
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Downloads */}
        <div className="grid gap-6">
          <h2 className="text-xl font-bold text-white px-2">Download MT5 Platforms</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-blue-500 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <platform.icon className="w-6 h-6 text-blue-400" />
                    {platform.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 text-sm mb-4">{platform.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {platform.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-slate-400 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="text-slate-400 border-slate-600">
                      v{platform.version}
                    </Badge>
                    <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                      Latest version
                    </span>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Quick Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 h-auto py-4 flex-col gap-2">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span>Trading Signals</span>
              </Button>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 h-auto py-4 flex-col gap-2">
                <BarChart3 className="w-6 h-6 text-green-400" />
                <span>Expert Advisors</span>
              </Button>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 h-auto py-4 flex-col gap-2">
                <RefreshCw className="w-6 h-6 text-blue-400" />
                <span>Market News</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MT5Hub;
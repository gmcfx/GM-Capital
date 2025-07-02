import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CryptoWalletCard, { type CryptoWallet } from './CryptoWalletCard';
import ForexPositionCard, { type ForexPosition } from './ForexPositionCard';

interface PortfolioTabsProps {
  cryptoWallets: CryptoWallet[];
  forexPositions: ForexPosition[];
}

const PortfolioTabs = ({ cryptoWallets, forexPositions }: PortfolioTabsProps) => {
  return (
    <Tabs defaultValue="crypto" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2 bg-slate-800">
        <TabsTrigger value="crypto" className="text-white data-[state=active]:bg-slate-600 text-xs sm:text-sm">
          Crypto Wallets
        </TabsTrigger>
        <TabsTrigger value="forex" className="text-white data-[state=active]:bg-slate-600 text-xs sm:text-sm">
          Forex Positions
        </TabsTrigger>
      </TabsList>

      <TabsContent value="crypto" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {cryptoWallets.map((wallet) => (
            <CryptoWalletCard key={wallet.id} wallet={wallet} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="forex" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {forexPositions.map((position) => (
            <ForexPositionCard key={position.id} position={position} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PortfolioTabs;
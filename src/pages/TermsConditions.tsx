import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 lg:p-6 lg:ml-64">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/settings">
            <Button variant="outline" size="sm" className="border-slate-600 text-white hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Terms & Conditions
            </h1>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">GM Capital Fx Trading Platform Terms of Service</CardTitle>
            <p className="text-slate-400 text-sm">Last updated: January 1, 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the GM Capital Fx trading platform, you accept and agree to be bound by the terms and provision of this agreement. 
                These terms apply to all users of the platform, including browsers, vendors, customers, merchants, and contributors of content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. Trading Services</h2>
              <p>
                GM Capital Fx provides online trading services for foreign exchange (Forex), cryptocurrencies, and other financial instruments. 
                Our platform offers both demo and real trading accounts with access to MetaTrader 5 (MT5) integration.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Real-time market data and charting tools</li>
                <li>Multi-asset portfolio management</li>
                <li>Advanced order execution capabilities</li>
                <li>Risk management tools and alerts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Account Registration</h2>
              <p>
                To use our trading services, you must register for an account and complete our verification process:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Provide accurate and complete registration information</li>
                <li>Complete KYC (Know Your Customer) verification</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized account use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Risk Disclosure</h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 font-medium mb-2">High Risk Investment Warning</p>
                <p>
                  Trading in foreign exchange and derivatives carries a high level of risk and may not be suitable for all investors. 
                  The high degree of leverage can work against you as well as for you. Before deciding to trade, you should carefully 
                  consider your investment objectives, level of experience, and risk appetite.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Deposits and Withdrawals</h2>
              <p>
                Financial transactions on the platform are subject to the following terms:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Minimum deposit requirements vary by account type</li>
                <li>Withdrawals are processed within 1-3 business days</li>
                <li>Identity verification required for all transactions</li>
                <li>Anti-money laundering compliance mandatory</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Platform Usage</h2>
              <p>You agree to use the platform only for lawful purposes and in accordance with these terms:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>No market manipulation or fraudulent activities</li>
                <li>Compliance with all applicable laws and regulations</li>
                <li>Respect for intellectual property rights</li>
                <li>No attempt to compromise platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
              <p>
                GM Capital Fx shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages 
                resulting from your use of the platform, including but not limited to trading losses, data loss, or service interruptions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
              <p>
                We reserve the right to terminate or suspend your account at any time for violations of these terms or suspicious activity. 
                You may also terminate your account by following the account closure process in your settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable financial regulations and international trading standards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact Information</h2>
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="list-none mt-2 space-y-1">
                <li>Email: legal@gmcapitalfx.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Trading Street, Finance City, FC 12345</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsConditions;
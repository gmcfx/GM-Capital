import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            <Shield className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
          </div>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">GM Capital Fx Privacy Policy</CardTitle>
            <p className="text-slate-400 text-sm">Last updated: January 1, 2024</p>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us, such as when you:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Create or modify your account</li>
                <li>Make deposits or withdrawals</li>
                <li>Contact customer support</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              
              <h3 className="text-lg font-medium text-white mt-4 mb-2">Personal Information:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Name, email address, phone number</li>
                <li>Date of birth and government-issued ID</li>
                <li>Financial information and trading history</li>
                <li>Device information and IP addresses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Provide, maintain, and improve our trading services</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and comply with regulatory requirements</li>
                <li>Send you technical notices and security alerts</li>
                <li>Respond to your comments and questions</li>
                <li>Prevent fraud and enhance platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">3. Information Sharing</h2>
              <p className="mb-3">We may share your information in the following circumstances:</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-white">Regulatory Compliance:</h4>
                  <p>With financial regulators and law enforcement when required by law</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white">Service Providers:</h4>
                  <p>With third-party vendors who perform services on our behalf</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-white">Business Transfers:</h4>
                  <p>In connection with mergers, acquisitions, or asset sales</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 font-medium mb-2">Security Measures</p>
                <p className="mb-3">We implement industry-standard security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>256-bit SSL encryption for all data transmission</li>
                  <li>Multi-factor authentication options</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Segregated client funds and cold storage for crypto assets</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights and Choices</h2>
              <p className="mb-3">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">6. Cookies and Tracking</h2>
              <p className="mb-3">We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Remember your preferences and login information</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and advertisements</li>
                <li>Enhance security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
                Trading records are typically retained for 7 years as required by financial regulations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. 
                We ensure appropriate safeguards are in place to protect your information during such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">9. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect 
                personal information from children under 18.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">10. Contact Us</h2>
              <p className="mb-3">
                If you have any questions about this Privacy Policy, please contact our Data Protection Officer:
              </p>
              <ul className="list-none space-y-1">
                <li>Email: privacy@gmcapitalfx.com</li>
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

export default PrivacyPolicy;
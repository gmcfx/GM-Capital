import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Bell, Palette, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useSettings } from '@/contexts/SettingsContext';

const Settings = () => {
  // Provide default values in case context is not available
  const { language = 'en', setLanguage = () => {} } = useLanguage() || {};
  const { currency = 'USD', setCurrency = () => {} } = useCurrency() || {};
  const { settings = { accountType: 'real' }, updateSettings = () => {} } = useSettings() || {};
  
  const [notifications, setNotifications] = useState({
    trading: true,
    news: false,
    promotions: true,
    security: true
  });

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'en' | 'es' | 'fr' | 'de');
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency as 'USD' | 'EUR' | 'GBP' | 'JPY');
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 pt-4 sm:pt-6"> {/* Reduced top padding */}
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <SettingsIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              Settings
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Customize your trading experience and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-slate-800 border-slate-700"> {/* Responsive tabs */}
            <TabsTrigger value="general" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
              <SettingsIcon className="w-4 h-4 mr-2" />
              <span className="sr-only sm:not-sr-only">General</span> {/* Accessible on mobile */}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
              <Bell className="w-4 h-4 mr-2" />
              <span className="sr-only sm:not-sr-only">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
              <Palette className="w-4 h-4 mr-2" />
              <span className="sr-only sm:not-sr-only">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white py-2">
              <Shield className="w-4 h-4 mr-2" />
              <span className="sr-only sm:not-sr-only">Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="en" className="text-white">English</SelectItem>
                        <SelectItem value="es" className="text-white">Español</SelectItem>
                        <SelectItem value="fr" className="text-white">Français</SelectItem>
                        <SelectItem value="de" className="text-white">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Currency</Label>
                    <Select value={currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="USD" className="text-white">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR" className="text-white">EUR - Euro</SelectItem>
                        <SelectItem value="GBP" className="text-white">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY" className="text-white">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Demo Mode</Label>
                      <p className="text-sm text-slate-400">Trade with virtual funds</p>
                    </div>
                    <Switch 
                      checked={settings.accountType === 'demo'} 
                      onCheckedChange={(checked) => updateSettings({ accountType: checked ? 'demo' : 'real' })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Auto-save Charts</Label>
                      <p className="text-sm text-slate-400">Automatically save chart configurations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300 capitalize">{key} Notifications</Label>
                      <p className="text-sm text-slate-400">
                        {key === 'trading' && 'Order updates, position changes'}
                        {key === 'news' && 'Market news and analysis'}
                        {key === 'promotions' && 'Special offers and updates'}
                        {key === 'security' && 'Login alerts and security updates'}
                      </p>
                    </div>
                    <Switch 
                      checked={value} 
                      onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Theme</Label>
                  <Select defaultValue="dark">
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="dark" className="text-white">Dark Mode</SelectItem>
                      <SelectItem value="light" className="text-white">Light Mode</SelectItem>
                      <SelectItem value="auto" className="text-white">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Compact Layout</Label>
                      <p className="text-sm text-slate-400">Use smaller spacing and components</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-300">Show Animations</Label>
                      <p className="text-sm text-slate-400">Enable smooth transitions and effects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-400">Add extra security to your account</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Session Timeout</Label>
                    <p className="text-sm text-slate-400">Auto-logout after inactivity</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="15" className="text-white">15 min</SelectItem>
                      <SelectItem value="30" className="text-white">30 min</SelectItem>
                      <SelectItem value="60" className="text-white">1 hour</SelectItem>
                      <SelectItem value="never" className="text-white">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-300">Login Notifications</Label>
                    <p className="text-sm text-slate-400">Get notified of new logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 pt-6">
          <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700">
            Reset to Defaults
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
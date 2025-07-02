import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Smartphone, Eye, AlertTriangle, CheckCircle, Key, Settings } from 'lucide-react';

const Security = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);

  const securityScore = 75;

  const securityFeatures = [
    {
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      icon: Smartphone,
      status: twoFactorEnabled ? 'enabled' : 'disabled',
      action: () => setTwoFactorEnabled(!twoFactorEnabled)
    },
    {
      title: 'Login Notifications',
      description: 'Get notified when someone logs into your account',
      icon: AlertTriangle,
      status: loginNotifications ? 'enabled' : 'disabled',
      action: () => setLoginNotifications(!loginNotifications)
    },
    {
      title: 'Session Management',
      description: 'Monitor and control active sessions',
      icon: Eye,
      status: 'active',
      action: () => {}
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Login',
      location: 'New York, USA',
      device: 'Chrome on Windows',
      timestamp: '2024-01-15 10:30 AM',
      status: 'success'
    },
    {
      id: 2,
      action: 'Password Change',
      location: 'New York, USA',
      device: 'Chrome on Windows',
      timestamp: '2024-01-14 3:45 PM',
      status: 'success'
    },
    {
      id: 3,
      action: 'Failed Login',
      location: 'Unknown',
      device: 'Unknown Browser',
      timestamp: '2024-01-13 11:20 PM',
      status: 'failed'
    }
  ];

  const handlePasswordChange = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      // Handle password change logic
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              Security Settings
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your account security and privacy settings
            </p>
          </div>
        </div>

        {/* Security Score */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-3xl font-bold text-green-400">{securityScore}%</div>
              <div className="flex-1">
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${securityScore}%` }}
                  ></div>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  Your account security is strong. Consider enabling all security features for maximum protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Password Change */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                onClick={handlePasswordChange}
                disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Key className="w-4 h-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Security Features */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-400" />
                Security Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <feature.icon className="w-5 h-5 text-blue-400" />
                    <div>
                      <h3 className="text-white font-medium">{feature.title}</h3>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`${
                        feature.status === 'enabled' || feature.status === 'active'
                          ? 'text-green-400 border-green-400'
                          : 'text-slate-400 border-slate-400'
                      }`}
                    >
                      {feature.status}
                    </Badge>
                    {feature.title !== 'Session Management' && (
                      <Switch
                        checked={feature.status === 'enabled'}
                        onCheckedChange={feature.action}
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Security Activity */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Security Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <div>
                      <div className="text-white font-medium">{activity.action}</div>
                      <div className="text-slate-400 text-sm">
                        {activity.device} • {activity.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-sm">
                    {activity.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
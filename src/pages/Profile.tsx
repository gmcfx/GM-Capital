// src/pages/Profile.tsx
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Settings, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useUser } from '@/contexts/UserContext';
import ProfileHeader from '@/components/profile/ProfileHeader';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import AccountStatistics from '@/components/profile/AccountStatistics';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define KYC status type
type KycStatus = "pending" | "verified" | "rejected" | "unverified";

const Profile = () => {
  useLanguage();
  const { settings, updateSettings, isDemoMode, getCurrentBalance, switchAccountType } = useSettings();
  const { user } = useUser();
  const { refreshAccountData } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: settings.phone,
    address: settings.address,
    dateOfBirth: settings.dateOfBirth
  });

  const handleEdit = () => {
    if (isEditing) {
      updateSettings(formData);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: settings.phone,
      address: settings.address,
      dateOfBirth: settings.dateOfBirth
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountSwitch = async () => {
    try {
      await switchAccountType();
      await refreshAccountData();
      
      toast({
        title: "Account Switched",
        description: `You're now using ${settings.accountType === 'demo' ? 'Demo' : 'Live'} Account`,
      });
    } catch (error) {
      toast({
        title: "Switch Failed",
        description: "Could not switch accounts",
        variant: "destructive",
      });
    }
  };

  // Ensure KYC status matches expected type
  const getKycStatus = (): KycStatus => {
    const validStatus: KycStatus[] = ["pending", "verified", "rejected", "unverified"];
    return validStatus.includes(settings.kycStatus as KycStatus) 
      ? settings.kycStatus as KycStatus 
      : "unverified";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-2 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pt-16 sm:pt-0">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 px-2">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent break-words">
              My Profile
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your personal information and account settings
            </p>
          </div>
        </div>

        <ProfileHeader 
          userName={user?.name || ''}
          email={user?.email || ''}
          accountNumber={settings.accountNumber}
          memberSince={settings.memberSince}
          kycStatus={getKycStatus()}
          isDemoMode={isDemoMode}
          isEditing={isEditing}
          onEdit={handleEdit}
          onCancel={handleCancel}
          firstName={user?.name?.split(' ')[0] || ''}
          lastName={user?.name?.split(' ')[1] || ''}
        />

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700 h-12">
            <TabsTrigger value="personal" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm sm:text-base">
              <Settings className="w-4 h-4 mr-2" />
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="statistics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-sm sm:text-base">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <PersonalInfoForm 
              data={formData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            <AccountStatistics 
              isDemoMode={isDemoMode}
              currentBalance={getCurrentBalance()}
              currentTrades={isDemoMode ? settings.demoTotalTrades : settings.realTotalTrades}
              currentWinRate={isDemoMode ? settings.demoWinRate : settings.realWinRate}
              accountType={settings.accountType}
              kycStatus={getKycStatus()}
              twoFactorEnabled={settings.twoFactorEnabled}
              onAccountSwitch={handleAccountSwitch}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit3, Camera, Save, X, Verified } from 'lucide-react';

interface ProfileHeaderProps {
  userName: string;
  email: string;
  accountNumber: string;
  memberSince: string;
  kycStatus: 'pending' | 'verified' | 'rejected' | 'unverified';
  isDemoMode: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  firstName: string;
  lastName: string;
  onUploadPhoto?: () => void;
}

const ProfileHeader = ({
  userName,
  email,
  accountNumber,
  memberSince,
  kycStatus,
  isDemoMode,
  isEditing,
  onEdit,
  onCancel,
  firstName,
  lastName,
  onUploadPhoto
}: ProfileHeaderProps) => {
  // Safely get initials with fallback
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || 'U';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || 'S';
    return `${firstInitial}${lastInitial}`;
  };

  // Get badge properties based on KYC status
  const getKycBadgeProps = () => {
    switch (kycStatus) {
      case 'verified':
        return { text: 'VERIFIED', className: 'text-green-400 border-green-400' };
      case 'pending':
        return { text: 'PENDING', className: 'text-yellow-400 border-yellow-400' };
      case 'rejected':
        return { text: 'REJECTED', className: 'text-red-400 border-red-400' };
      default:
        return { text: 'UNVERIFIED', className: 'text-gray-400 border-gray-400' };
    }
  };

  const kycBadge = getKycBadgeProps();

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <Avatar className="w-24 h-24 border-2 border-slate-600">
          <AvatarImage src="/placeholder-avatar.jpg" alt={userName} />
          <AvatarFallback className="bg-slate-700 text-2xl font-bold">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <Button
            size="sm"
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            onClick={onUploadPhoto}
            aria-label="Upload profile photo"
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 mb-2 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-bold text-white break-all">
            {userName}
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge 
              variant="outline" 
              className={`whitespace-nowrap ${
                isDemoMode 
                  ? 'text-yellow-400 border-yellow-400' 
                  : 'text-blue-400 border-blue-400'
              }`}
            >
              {isDemoMode ? 'DEMO ACCOUNT' : 'REAL ACCOUNT'}
            </Badge>
            <Badge 
              variant="outline" 
              className={`flex items-center whitespace-nowrap ${kycBadge.className}`}
            >
              <Verified className="w-3 h-3 mr-1" />
              {kycBadge.text}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-slate-400 break-all">{email}</p>
          <p className="text-slate-400 text-sm">
            Account: <span className="font-mono">{accountNumber}</span>
          </p>
          <p className="text-slate-400 text-sm">Member since {memberSince}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full sm:w-auto">
        <div className="flex justify-center sm:justify-start gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={onEdit}
                className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button 
                onClick={onCancel}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700 flex-1 sm:flex-none"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={onEdit}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700 w-full sm:w-auto"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
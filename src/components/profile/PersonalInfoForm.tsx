
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface PersonalInfoFormProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
  };
  isEditing: boolean;
  onInputChange: (field: string, value: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  data,
  isEditing,
  onInputChange
}) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5 text-blue-400" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-sm">First Name</label>
            <Input
              value={data.firstName}
              onChange={(e) => onInputChange('firstName', e.target.value)}
              disabled={!isEditing}
              className="bg-slate-700 border-slate-600 text-white disabled:opacity-70"
            />
          </div>
          <div>
            <label className="text-slate-400 text-sm">Last Name</label>
            <Input
              value={data.lastName}
              onChange={(e) => onInputChange('lastName', e.target.value)}
              disabled={!isEditing}
              className="bg-slate-700 border-slate-600 text-white disabled:opacity-70"
            />
          </div>
        </div>
        
        <div>
          <label className="text-slate-400 text-sm flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <Input
            value={data.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            disabled={!isEditing}
            className="bg-slate-700 border-slate-600 text-white disabled:opacity-70"
          />
        </div>
        
        <div>
          <label className="text-slate-400 text-sm flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <Input
            value={data.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            disabled={!isEditing}
            className="bg-slate-700 border-slate-600 text-white disabled:opacity-70"
          />
        </div>
        
        <div>
          <label className="text-slate-400 text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Address
          </label>
          <Input
            value={data.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            disabled={!isEditing}
            className="bg-slate-700 border-slate-600 text-white disabled:opacity-70"
          />
        </div>
        
        <div>
          <label className="text-slate-400 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date of Birth
          </label>
          <Input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
            disabled={!isEditing}
            className="bg-slate-700 border-slate-600 text-white disabled:opacity-70"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;

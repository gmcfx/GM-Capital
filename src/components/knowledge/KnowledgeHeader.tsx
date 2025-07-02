
import { BookOpen } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

const KnowledgeHeader = () => {
  const { getGreeting, getUserFullName } = useSettings();

  return (
    <div className="flex items-center gap-3 mb-6">
      <BookOpen className="w-8 h-8 text-blue-400" />
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          Knowledge Base
        </h1>
        <p className="text-slate-400 mt-1">{getGreeting()}, {getUserFullName()}! Expand your trading knowledge</p>
      </div>
    </div>
  );
};

export default KnowledgeHeader;


import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/knowledgeData';

interface KnowledgeSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const KnowledgeSearch = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory 
}: KnowledgeSearchProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Search articles and videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
            className={`whitespace-nowrap ${
              selectedCategory === category.id 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'border-slate-600 text-white hover:bg-slate-700'
            }`}
          >
            <category.icon className="w-4 h-4 mr-2" />
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default KnowledgeSearch;

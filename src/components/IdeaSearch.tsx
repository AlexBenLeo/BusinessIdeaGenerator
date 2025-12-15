import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';

interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  startupCost: string;
  difficulty: number;
  timeToMarket: string;
  potentialRevenue: string;
  keySteps: string[];
  marketInsight: string;
  riskLevel: string;
  uniqueValue?: string;
  targetAudience?: string;
}

interface IdeaSearchProps {
  ideas: BusinessIdea[];
  onFilteredIdeas: (ideas: BusinessIdea[]) => void;
}

export function IdeaSearch({ ideas, onFilteredIdeas }: IdeaSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = [...new Set(ideas.map(idea => idea.category))];
    return cats.sort();
  }, [ideas]);

  const riskLevels = useMemo(() => {
    const risks = [...new Set(ideas.map(idea => idea.riskLevel))];
    return risks.sort();
  }, [ideas]);

  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = ideas.filter(idea => {
      const matchesSearch = searchTerm === '' || 
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || idea.difficulty.toString() === selectedDifficulty;
      const matchesRisk = selectedRisk === 'all' || idea.riskLevel === selectedRisk;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesRisk;
    });

    // Sort the filtered results
    if (sortBy !== 'none') {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (sortBy) {
          case 'title':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'difficulty':
            aValue = a.difficulty;
            bValue = b.difficulty;
            break;
          case 'cost':
            aValue = parseInt(a.startupCost.replace(/[^0-9]/g, '')) || 0;
            bValue = parseInt(b.startupCost.replace(/[^0-9]/g, '')) || 0;
            break;
          case 'time':
            aValue = parseInt(a.timeToMarket.replace(/[^0-9]/g, '')) || 0;
            bValue = parseInt(b.timeToMarket.replace(/[^0-9]/g, '')) || 0;
            break;
          case 'revenue':
            aValue = parseInt(a.potentialRevenue.replace(/[^0-9]/g, '')) || 0;
            bValue = parseInt(b.potentialRevenue.replace(/[^0-9]/g, '')) || 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [ideas, searchTerm, selectedCategory, selectedDifficulty, selectedRisk, sortBy, sortOrder]);

  React.useEffect(() => {
    onFilteredIdeas(filteredAndSortedIdeas);
  }, [filteredAndSortedIdeas, onFilteredIdeas]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSelectedRisk('all');
    setSortBy('none');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || 
    selectedDifficulty !== 'all' || selectedRisk !== 'all' || sortBy !== 'none';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search business ideas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-100 text-blue-700 border-blue-300'
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-4 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="1">1 - Very Easy</option>
              <option value="2">2 - Easy</option>
              <option value="3">3 - Medium</option>
              <option value="4">4 - Hard</option>
              <option value="5">5 - Very Hard</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Risk Levels</option>
              {riskLevels.map(risk => (
                <option key={risk} value={risk}>{risk}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="none">No Sorting</option>
                <option value="title">Title</option>
                <option value="difficulty">Difficulty</option>
                <option value="cost">Startup Cost</option>
                <option value="time">Time to Market</option>
                <option value="revenue">Revenue Potential</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={sortBy === 'none'}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
        <span>
          Showing {filteredAndSortedIdeas.length} of {ideas.length} ideas
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600">
            Filters active
          </span>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { BookOpen, Download, ExternalLink, Clock, Star, Eye, Filter, Search } from 'lucide-react';
import { resourceService, Resource, ImplementationGuide } from '../services/resourceService';
import { userProfileService } from '../services/userProfileService';

interface ResourceLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  businessIdea?: any;
  userProfile?: any;
}

export function ResourceLibrary({ isOpen, onClose, businessIdea, userProfile }: ResourceLibraryProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [implementationGuide, setImplementationGuide] = useState<ImplementationGuide | null>(null);
  const [activeTab, setActiveTab] = useState<'recommended' | 'all' | 'guide'>('recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      const allResources = resourceService.getAllResources();
      setResources(allResources);
      
      if (businessIdea) {
        const guide = resourceService.getImplementationGuide(businessIdea.category);
        setImplementationGuide(guide);
      }
    }
  }, [isOpen, businessIdea]);

  const getFilteredResources = () => {
    let filtered = resources;

    if (activeTab === 'recommended' && businessIdea && userProfile) {
      filtered = resourceService.getRecommendedResources(userProfile, businessIdea);
    }

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(resource => resource.difficulty === selectedDifficulty);
    }

    return filtered;
  };

  const handleResourceClick = (resource: Resource) => {
    resourceService.trackResourceView(resource.id);
    userProfileService.trackResourceViewed(resource.id);
    
    // Update view count locally
    setResources(prev => prev.map(r => 
      r.id === resource.id ? { ...r, views: r.views + 1 } : r
    ));
  };

  const categories = [...new Set(resources.map(r => r.category))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Resource Library</h2>
                <p className="text-indigo-100">Guides, templates, and tools to help you succeed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'recommended', label: 'Recommended', count: businessIdea ? resourceService.getRecommendedResources(userProfile, businessIdea).length : 0 },
              { id: 'all', label: 'All Resources', count: resources.length },
              ...(implementationGuide ? [{ id: 'guide', label: 'Implementation Guide', count: 1 }] : [])
            ].map(({ id, label, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {label}
                {count > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Implementation Guide Tab */}
          {activeTab === 'guide' && implementationGuide && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{implementationGuide.title}</h3>
                <p className="text-gray-700 mb-4">{implementationGuide.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{implementationGuide.totalTime}</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{implementationGuide.difficulty}</div>
                    <div className="text-sm text-gray-600">Difficulty</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{implementationGuide.steps.length} Steps</div>
                    <div className="text-sm text-gray-600">Implementation</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Prerequisites:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {implementationGuide.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                {implementationGuide.steps.map((step, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-700 mb-3">{step.description}</p>
                        <div className="text-sm text-gray-600 mb-3">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Estimated time: {step.estimatedTime}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-12">
                      <h5 className="font-semibold text-gray-900 mb-2">Checklist:</h5>
                      <ul className="space-y-1 mb-4">
                        {step.checklist.map((item, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700">
                            <div className="w-4 h-4 border border-gray-300 rounded mr-3 mt-0.5 flex-shrink-0"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                      
                      {step.resources.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-2">Related Resources:</h5>
                          <div className="flex flex-wrap gap-2">
                            {step.resources.map((resourceId, i) => {
                              const resource = resources.find(r => r.id === resourceId);
                              return resource ? (
                                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {resource.title}
                                </span>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tabs */}
          {(activeTab === 'recommended' || activeTab === 'all') && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFilteredResources().map((resource) => (
                  <div 
                    key={resource.id} 
                    className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleResourceClick(resource)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          resource.type === 'guide' ? 'bg-blue-100 text-blue-600' :
                          resource.type === 'template' ? 'bg-green-100 text-green-600' :
                          resource.type === 'tool' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            resource.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                            resource.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {resource.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="w-4 h-4 mr-1" />
                        {resource.views.toLocaleString()}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{resource.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {resource.estimatedTime}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{resource.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-600">{resource.category}</span>
                      <div className="flex items-center space-x-2">
                        {resource.url && (
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        )}
                        {resource.type === 'template' && (
                          <Download className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {getFilteredResources().length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Resources Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { X, TrendingUp, DollarSign, Clock, Target, BarChart3, Users } from 'lucide-react';

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

interface IdeaComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  ideas: BusinessIdea[];
  selectedIdeas: string[];
  onToggleIdea: (ideaId: string) => void;
}

export function IdeaComparison({ isOpen, onClose, ideas, selectedIdeas, onToggleIdea }: IdeaComparisonProps) {
  const compareIdeas = ideas.filter(idea => selectedIdeas.includes(idea.id));

  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-600 bg-green-100';
    if (difficulty <= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk: string) => {
    if (risk.includes('Low')) return 'text-green-600 bg-green-100';
    if (risk.includes('Medium')) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Compare Business Ideas</h2>
                <p className="text-purple-100">Side-by-side comparison of your selected ideas</p>
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {compareIdeas.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Ideas Selected</h3>
              <p className="text-gray-500">Select 2-3 ideas to compare them side by side</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {compareIdeas.map((idea) => (
                <div key={idea.id} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {idea.category}
                    </span>
                    <button
                      onClick={() => onToggleIdea(idea.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3">{idea.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{idea.description}</p>

                  {/* Comparison Metrics */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Startup Cost</span>
                      <span className="text-sm font-semibold text-green-600">{idea.startupCost}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Difficulty</span>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${
                              i < idea.difficulty ? 'bg-yellow-400' : 'bg-gray-200'
                            }`}></div>
                          ))}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(idea.difficulty)}`}>
                          {idea.difficulty}/5
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Time to Market</span>
                      <span className="text-sm font-semibold text-blue-600">{idea.timeToMarket}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Revenue Potential</span>
                      <span className="text-sm font-semibold text-purple-600">{idea.potentialRevenue}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Risk Level</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(idea.riskLevel)}`}>
                        {idea.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Key Steps Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">First Steps:</h4>
                    <ul className="space-y-1">
                      {idea.keySteps.slice(0, 3).map((step, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start">
                          <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {compareIdeas.length > 1 && (
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Comparison Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Lowest Startup Cost</div>
                  <div className="font-semibold text-green-600">
                    {compareIdeas.reduce((prev, current) => 
                      parseInt(prev.startupCost.replace(/[^0-9]/g, '')) < parseInt(current.startupCost.replace(/[^0-9]/g, '')) ? prev : current
                    ).title}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Easiest to Start</div>
                  <div className="font-semibold text-blue-600">
                    {compareIdeas.reduce((prev, current) => prev.difficulty < current.difficulty ? prev : current).title}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Fastest to Market</div>
                  <div className="font-semibold text-purple-600">
                    {compareIdeas.reduce((prev, current) => 
                      parseInt(prev.timeToMarket.replace(/[^0-9]/g, '')) < parseInt(current.timeToMarket.replace(/[^0-9]/g, '')) ? prev : current
                    ).title}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
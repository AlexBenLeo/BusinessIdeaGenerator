import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, AlertTriangle, CheckCircle, BarChart3, Target } from 'lucide-react';
import { validationService, MarketValidation, CompetitorInfo, FinancialProjection } from '../services/validationService';

interface BusinessValidationProps {
  isOpen: boolean;
  onClose: () => void;
  businessIdea: any;
  userProfile: any;
}

export function BusinessValidation({ isOpen, onClose, businessIdea, userProfile }: BusinessValidationProps) {
  const [validation, setValidation] = useState<MarketValidation | null>(null);
  const [competitors, setCompetitors] = useState<CompetitorInfo[]>([]);
  const [financials, setFinancials] = useState<FinancialProjection | null>(null);
  const [activeTab, setActiveTab] = useState<'validation' | 'competitors' | 'financials'>('validation');

  useEffect(() => {
    if (isOpen && businessIdea) {
      const marketValidation = validationService.validateBusinessIdea(businessIdea, userProfile);
      const competitorData = validationService.getCompetitorAnalysis(businessIdea.category);
      const financialData = validationService.generateFinancialProjection(businessIdea, userProfile);
      
      setValidation(marketValidation);
      setCompetitors(competitorData);
      setFinancials(financialData);
    }
  }, [isOpen, businessIdea, userProfile]);

  if (!isOpen || !validation) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Business Validation Report</h2>
                <p className="text-purple-100">{businessIdea.title}</p>
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
              { id: 'validation', label: 'Market Validation', icon: TrendingUp },
              { id: 'competitors', label: 'Competitors', icon: Users },
              { id: 'financials', label: 'Financial Projections', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Market Validation Tab */}
          {activeTab === 'validation' && (
            <div className="space-y-6">
              {/* Success Probability */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Success Probability</h3>
                  <div className="text-3xl font-bold text-green-600">{validation.successProbability}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${validation.successProbability}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Based on market conditions, your profile, and business model analysis
                </p>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Market Size</h4>
                  </div>
                  <p className="text-gray-700">{validation.marketSize}</p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Users className="w-6 h-6 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Competition Level</h4>
                  </div>
                  <p className="text-gray-700">{validation.competitionLevel}</p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Market Trends</h4>
                  </div>
                  <p className="text-gray-700">{validation.trendAnalysis}</p>
                </div>

                <div className="bg-white border rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Target className="w-6 h-6 text-orange-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Scalability Score</h4>
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full mx-0.5 ${
                          i < validation.scalabilityScore ? 'bg-orange-400' : 'bg-gray-200'
                        }`}></div>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{validation.scalabilityScore}/10</span>
                  </div>
                </div>
              </div>

              {/* Opportunities and Barriers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <h4 className="font-semibold text-green-900">Opportunities</h4>
                  </div>
                  <ul className="space-y-2">
                    {validation.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start text-sm text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-900">Barriers & Risks</h4>
                  </div>
                  <ul className="space-y-2">
                    {[...validation.barriers, ...validation.riskFactors].map((risk, index) => (
                      <li key={index} className="flex items-start text-sm text-red-800">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Competitors Tab */}
          {activeTab === 'competitors' && (
            <div className="space-y-6">
              {competitors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Limited Competitor Data</h3>
                  <p className="text-gray-500">This could indicate a blue ocean opportunity or a niche market</p>
                </div>
              ) : (
                competitors.map((competitor, index) => (
                  <div key={index} className="bg-white border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{competitor.name}</h3>
                      <div className="text-sm text-gray-600">
                        Market Share: <span className="font-semibold">{competitor.marketShare}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{competitor.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Strengths</h4>
                        <ul className="text-sm space-y-1">
                          {competitor.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center text-green-600">
                              <CheckCircle className="w-3 h-3 mr-2" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-red-700 mb-2">Weaknesses</h4>
                        <ul className="text-sm space-y-1">
                          {competitor.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center text-red-600">
                              <AlertTriangle className="w-3 h-3 mr-2" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-2">Pricing</h4>
                        <p className="text-sm text-blue-600 font-medium">{competitor.pricing}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Financial Projections Tab */}
          {activeTab === 'financials' && financials && (
            <div className="space-y-6">
              {/* Investment Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Investment Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ${financials.initialInvestment.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Initial Investment</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${financials.monthlyExpenses.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Expenses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {financials.breakEvenPoint}
                    </div>
                    <div className="text-sm text-gray-600">Break-even Point</div>
                  </div>
                </div>
              </div>

              {/* Revenue Projections */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Revenue Projections</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">
                      ${financials.projectedRevenue.month6.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Month 6</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      ${financials.projectedRevenue.year1.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Year 1</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      ${financials.projectedRevenue.year2.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Year 2</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      ${financials.projectedRevenue.year3.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Year 3</div>
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Return on Investment (ROI)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{financials.roi.year1}</div>
                    <div className="text-sm text-gray-600">Year 1 ROI</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{financials.roi.year2}</div>
                    <div className="text-sm text-gray-600">Year 2 ROI</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{financials.roi.year3}</div>
                    <div className="text-sm text-gray-600">Year 3 ROI</div>
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
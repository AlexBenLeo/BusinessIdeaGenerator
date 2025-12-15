import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Eye, TrendingUp, Clock, Heart, Users, Monitor, Globe, Calendar, PieChart } from 'lucide-react';
import { trackingService, ClickStats, TrendData, UserDemographics } from '../services/trackingService';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsDashboard({ isOpen, onClose }: AnalyticsDashboardProps) {
  const [stats, setStats] = useState<ClickStats>({});
  const [favoriteStats, setFavoriteStats] = useState<any>({});
  const [trendData, setTrendData] = useState<TrendData>({ categories: {}, dailyTrends: {}, weeklyTrends: {}, monthlyTrends: {} });
  const [demographics, setDemographics] = useState<UserDemographics>({ deviceTypes: {}, locations: {}, browsers: {}, timeZones: {} });
  const [totalClicks, setTotalClicks] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'demographics'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (isOpen) {
      const clickStats = trackingService.getClickStats();
      const favStats = trackingService.getFavoriteStats();
      const trends = trackingService.getTrendData();
      const userDemo = trackingService.getUserDemographics();
      
      setStats(clickStats);
      setFavoriteStats(favStats);
      setTrendData(trends);
      setDemographics(userDemo);
      setTotalClicks(trackingService.getTotalClicks());
    }
  }, [isOpen]);

  const handleExportData = () => {
    const csvData = trackingService.exportClickData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business_idea_clicks_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const sortedStats = Object.entries(stats)
    .map(([id, stat]) => ({ id, ...stat }))
    .sort((a, b) => b.clicks - a.clicks);

  const sortedFavorites = Object.entries(favoriteStats)
    .map(([id, stat]) => ({ id, ...stat }))
    .sort((a, b) => b.favorites - a.favorites);

  const getRecentDailyTrends = () => {
    const sortedDays = Object.entries(trendData.dailyTrends)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, 7);
    return sortedDays;
  };

  const getEngagementRate = () => {
    const totalIdeas = Object.keys(stats).length;
    const totalFavorites = Object.values(favoriteStats).reduce((sum: number, stat: any) => sum + stat.favorites, 0);
    return totalClicks > 0 ? ((totalFavorites / totalClicks) * 100).toFixed(1) : '0';
  };

  const getTopCategories = () => {
    return Object.entries(trendData.categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
                <p className="text-blue-100">Comprehensive business idea engagement analytics</p>
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
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'trends', label: 'Trends', icon: TrendingUp },
              { id: 'demographics', label: 'Demographics', icon: Users }
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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{totalClicks}</div>
                      <div className="text-blue-700 text-sm">Total Clicks</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-green-900">{Object.keys(stats).length}</div>
                      <div className="text-green-700 text-sm">Ideas Clicked</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Heart className="w-8 h-8 text-red-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-red-900">
                        {Object.values(favoriteStats).reduce((sum: number, stat: any) => sum + stat.favorites, 0)}
                      </div>
                      <div className="text-red-700 text-sm">Total Favorites</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-purple-900">
                        {totalClicks > 0 ? (totalClicks / Object.keys(stats).length).toFixed(1) : '0'}
                      </div>
                      <div className="text-purple-700 text-sm">Avg Clicks/Idea</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <div className="text-2xl font-bold text-orange-900">{getEngagementRate()}%</div>
                      <div className="text-orange-700 text-sm">Engagement Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Categories Overview */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="bg-indigo-50 px-6 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                    Top Categories This Month
                  </h3>
                </div>
                <div className="p-6">
                  {getTopCategories().length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <PieChart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No category data available yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {getTopCategories().map(([category, count], index) => (
                        <div key={category} className="text-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                            index === 1 ? 'bg-gray-100 text-gray-600' :
                            index === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <span className="text-lg font-bold">{index + 1}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{category}</div>
                          <div className="text-xs text-gray-500">{count} clicks</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Export Button */}
              <div className="mb-6">
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Analytics Data (CSV)
                </button>
              </div>

              {/* Top Performing Ideas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Most Clicked Ideas */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="bg-blue-50 px-6 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-blue-600" />
                      Most Clicked Ideas
                    </h3>
                  </div>
                  
                  {sortedStats.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No click data available yet.</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {sortedStats.slice(0, 5).map((stat, index) => (
                        <div key={stat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {stat.title}
                              </div>
                              <div className="text-xs text-gray-500">{stat.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{stat.clicks} clicks</div>
                            <div className="text-xs text-gray-500">
                              {totalClicks > 0 ? ((stat.clicks / totalClicks) * 100).toFixed(1) : 0}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Most Favorited Ideas */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="bg-red-50 px-6 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-red-600" />
                      Most Favorited Ideas
                    </h3>
                  </div>
                  
                  {sortedFavorites.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No favorite data available yet.</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {sortedFavorites.slice(0, 5).map((stat, index) => (
                        <div key={stat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                              index === 0 ? 'bg-red-100 text-red-800' :
                              index === 1 ? 'bg-pink-100 text-pink-800' :
                              index === 2 ? 'bg-rose-100 text-rose-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                {stat.title}
                              </div>
                              <div className="text-xs text-gray-500">{stat.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900">{stat.favorites} ❤️</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <div className="space-y-8">
              {/* Time Range Selector */}
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-lg p-1">
                  {[
                    { value: '7d', label: 'Last 7 Days' },
                    { value: '30d', label: 'Last 30 Days' },
                    { value: '90d', label: 'Last 90 Days' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setTimeRange(value as any)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        timeRange === value
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Trends */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="bg-green-50 px-6 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-green-600" />
                    Popular Categories
                  </h3>
                </div>
                <div className="p-6">
                  {Object.keys(trendData.categories).length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No category data available yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(trendData.categories)
                        .sort(([,a], [,b]) => b - a)
                        .map(([category, count]) => (
                          <div key={category} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">{category}</span>
                            <div className="flex items-center">
                              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ 
                                    width: `${(count / Math.max(...Object.values(trendData.categories))) * 100}%` 
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Daily Trends */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="bg-blue-50 px-6 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Daily Activity (Last 7 Days)
                  </h3>
                </div>
                <div className="p-6">
                  {getRecentDailyTrends().length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No daily trend data available yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {getRecentDailyTrends().map(([date, clicks]) => (
                        <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ 
                                  width: `${(clicks / Math.max(...getRecentDailyTrends().map(([,c]) => c))) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-8">{clicks}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Engagement Insights */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="bg-purple-50 px-6 py-3 border-b">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    Engagement Insights
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{getEngagementRate()}%</div>
                      <div className="text-sm text-gray-600">Click-to-Favorite Rate</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {Object.values(favoriteStats).reduce((sum: number, stat: any) => sum + stat.favorites, 0)} favorites from {totalClicks} clicks
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Object.keys(stats).length > 0 ? (totalClicks / Object.keys(stats).length).toFixed(1) : '0'}
                      </div>
                      <div className="text-sm text-gray-600">Average Clicks per Idea</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Across {Object.keys(stats).length} unique ideas
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.keys(trendData.categories).length}
                      </div>
                      <div className="text-sm text-gray-600">Active Categories</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Categories with user engagement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Device Types */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="bg-purple-50 px-6 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Monitor className="w-5 h-5 mr-2 text-purple-600" />
                      Device Types
                    </h3>
                  </div>
                  <div className="p-6">
                    {Object.keys(demographics.deviceTypes).length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No device data available yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(demographics.deviceTypes)
                          .sort(([,a], [,b]) => b - a)
                          .map(([device, count]) => (
                            <div key={device} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{device}</span>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                  <div 
                                    className="bg-purple-500 h-2 rounded-full" 
                                    style={{ 
                                      width: `${(count / Math.max(...Object.values(demographics.deviceTypes))) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div className="bg-white rounded-lg border overflow-hidden">
                  <div className="bg-orange-50 px-6 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-orange-600" />
                      User Locations (Time Zones)
                    </h3>
                  </div>
                  <div className="p-6">
                    {Object.keys(demographics.timeZones).length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No location data available yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(demographics.timeZones)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 5)
                          .map(([timezone, count]) => (
                            <div key={timezone} className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700 truncate">{timezone}</span>
                              <div className="flex items-center">
                                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                  <div 
                                    className="bg-orange-500 h-2 rounded-full" 
                                    style={{ 
                                      width: `${(count / Math.max(...Object.values(demographics.timeZones))) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
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
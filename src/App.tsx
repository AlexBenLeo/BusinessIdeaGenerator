import React, { useState } from 'react';
import { Lightbulb, ArrowRight, Brain, TrendingUp, DollarSign, User, Target, Zap, RefreshCw, CheckCircle, BarChart3, ExternalLink, Heart, Share2, BookOpen, Save, History } from 'lucide-react';
import { claudeAIService, AIBusinessIdea } from './services/claudeAIService';
import { trackingService } from './services/trackingService';
import { userProfileService } from './services/userProfileService';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SavedSessions } from './components/SavedSessions';
import { BusinessValidation } from './components/BusinessValidation';
import { ResourceLibrary } from './components/ResourceLibrary';
import { IdeaComparison } from './components/IdeaComparison';
import { IdeaSearch } from './components/IdeaSearch';
import { GeneratingLoader, SkeletonCard, StepTransition } from './components/LoadingStates';
import { Toast, useToast } from './components/Toast';

interface UserInputs {
  interests: string[];
  skills: string[];
  budget: string;
  expertise: string;
  timeCommitment: string;
  riskTolerance: string;
}

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

const INTEREST_OPTIONS = [
  'Technology', 'Health & Wellness', 'Education', 'Food & Beverage', 'Fashion', 
  'Travel', 'Sports & Fitness', 'Art & Design', 'Music', 'Environmental',
  'Finance', 'Real Estate', 'Gaming', 'Social Media', 'E-commerce',
  'Agriculture', 'Automotive', 'Beauty & Cosmetics', 'Entertainment', 'Legal Services',
  'Manufacturing', 'Non-profit', 'Pet Care', 'Photography', 'Renewable Energy',
  'Retail', 'Security', 'Transportation', 'Virtual Reality', 'Artificial Intelligence',
  'Blockchain', 'Cybersecurity', 'Data Science', 'IoT', 'Mobile Apps',
  'Web Development', 'Cloud Computing', 'Machine Learning', 'Robotics', 'Space Technology'
];

const SKILL_OPTIONS = [
  'Programming', 'Marketing', 'Sales', 'Design', 'Writing', 'Management',
  'Customer Service', 'Finance', 'Teaching', 'Consulting', 'Photography',
  'Video Production', 'Data Analysis', 'Project Management', 'Public Speaking',
  'Social Media Management', 'SEO/SEM', 'Content Creation', 'Graphic Design', 'UX/UI Design',
  'Web Development', 'Mobile Development', 'Database Management', 'Network Administration', 'DevOps',
  'Quality Assurance', 'Business Analysis', 'Product Management', 'Human Resources', 'Accounting',
  'Legal Research', 'Translation', 'Event Planning', 'Research & Development', 'Supply Chain Management',
  'Operations Management', 'Strategic Planning', 'Risk Management', 'Compliance', 'Auditing',
  'Investment Analysis', 'Market Research', 'Brand Management', 'Public Relations', 'Copywriting',
  'Technical Writing', 'Training & Development', 'Recruitment', 'Negotiation', 'Leadership'
];

const EXPERTISE_OPTIONS = [
  'Complete beginner - New to business',
  'Some business knowledge - Basic understanding',
  'Experienced professional - Industry experience',
  'Management experience - Led teams/projects',
  'Serial entrepreneur - Multiple ventures',
  'Domain expert - Deep industry knowledge',
  'Technical specialist - Advanced technical skills',
  'Creative professional - Design/content expertise'
];

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<UserInputs>({
    interests: [],
    skills: [],
    budget: '',
    expertise: '',
    timeCommitment: '',
    riskTolerance: ''
  });
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSavedSessions, setShowSavedSessions] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [selectedIdeaForValidation, setSelectedIdeaForValidation] = useState<BusinessIdea | null>(null);
  const [userProfile, setUserProfile] = useState(userProfileService.getProfile());
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<BusinessIdea[]>([]);
  const { toast, showToast, hideToast } = useToast();

  const steps = [
    { title: 'Interests', icon: Target },
    { title: 'Skills', icon: User },
    { title: 'Budget', icon: DollarSign },
    { title: 'Experience', icon: TrendingUp },
    { title: 'Preferences', icon: Brain }
  ];

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const generateBusinessIdeas = async () => {
    setIsGenerating(true);
    setGenerationStatus('Initializing AI analysis...');
    
    try {
      // Add realistic status updates
      setTimeout(() => setGenerationStatus('Analyzing your profile...'), 1000);
      setTimeout(() => setGenerationStatus('Researching market opportunities...'), 2000);
      setTimeout(() => setGenerationStatus('Generating personalized ideas...'), 3000);
      setTimeout(() => setGenerationStatus('Finalizing recommendations...'), 4000);
      
      // Fallback to local generation
      const fallbackIdeas = generateFallbackIdeas(inputs);
      setBusinessIdeas(fallbackIdeas);
      setIsGenerating(false);
      setShowResults(true);
      showToast('Successfully generated 4 personalized business ideas!', 'success');
    } catch (error) {
      console.error('Error generating business ideas:', error);
      setGenerationStatus('Error occurred, using fallback ideas...');
      
      // Fallback to local generation if AI fails
      const fallbackIdeas = generateFallbackIdeas(inputs);
      setBusinessIdeas(fallbackIdeas);
      setIsGenerating(false);
      setShowResults(true);
      showToast('Ideas generated successfully with backup system', 'info');
    }
  };

  const generateFallbackIdeas = (inputs: UserInputs): BusinessIdea[] => {
    const templates = [
      {
        title: `${inputs.interests[0]} Consulting & Strategy`,
        description: `Provide specialized consulting services combining your ${inputs.skills.slice(0, 2).join(' and ')} expertise to help businesses in the ${inputs.interests[0]} sector optimize their operations and growth strategies.`,
        category: 'Consulting',
        startupCost: '$1,000 - $5,000',
        difficulty: 3,
        timeToMarket: '2-4 months',
        potentialRevenue: '$8K - $40K monthly',
        keySteps: ['Define service offering', 'Build portfolio', 'Network & market', 'Deliver results', 'Scale operations'],
        marketInsight: `${inputs.interests[0]} consulting market shows strong demand for specialized expertise`,
        riskLevel: 'Low-Medium'
      },
      {
        title: `Digital ${inputs.interests[0]} Platform`,
        description: `Create an innovative online platform that connects ${inputs.interests[0]} enthusiasts with resources, tools, and community features, monetized through subscriptions and strategic partnerships.`,
        category: 'Technology',
        startupCost: '$5,000 - $25,000',
        difficulty: 4,
        timeToMarket: '6-12 months',
        potentialRevenue: '$10K - $100K monthly',
        keySteps: ['Market research', 'Platform development', 'User acquisition', 'Monetization', 'Scale & optimize'],
        marketInsight: 'Digital platforms in specialized niches showing 20%+ annual growth',
        riskLevel: 'Medium-High'
      },
      {
        title: `${inputs.interests[0]} Education & Training`,
        description: `Develop comprehensive educational content and courses around ${inputs.interests[0]}, leveraging your ${inputs.skills[0]} skills to create valuable learning experiences for professionals and enthusiasts.`,
        category: 'Education',
        startupCost: '$2,000 - $10,000',
        difficulty: 3,
        timeToMarket: '3-6 months',
        potentialRevenue: '$5K - $50K monthly',
        keySteps: ['Curriculum development', 'Content creation', 'Platform setup', 'Marketing launch', 'Community building'],
        marketInsight: 'Online education market growing 15% annually with high retention rates',
        riskLevel: 'Low-Medium'
      },
      {
        title: `Automated ${inputs.interests[0]} Solutions`,
        description: `Build intelligent automated tools and services that solve common problems in the ${inputs.interests[0]} industry, creating scalable passive income through software-as-a-service model.`,
        category: 'Technology',
        startupCost: '$3,000 - $15,000',
        difficulty: 4,
        timeToMarket: '4-8 months',
        potentialRevenue: '$7K - $60K monthly',
        keySteps: ['Problem identification', 'Solution development', 'Beta testing', 'Launch & marketing', 'Scale automation'],
        marketInsight: 'Automation solutions seeing 25% annual growth as efficiency becomes crucial',
        riskLevel: 'Medium'
      }
    ];

    return templates.map((template, index) => ({
      ...template,
      id: Math.random().toString(36).substr(2, 9),
      uniqueValue: `Combines ${inputs.skills[0]} expertise with ${inputs.interests[0]} market knowledge`,
      targetAudience: generateTargetAudience(inputs.interests[0])
    }));
  };

  const generateTargetAudience = (interest: string): string => {
    const audienceMap: { [key: string]: string } = {
      'Technology': 'Tech professionals, startups, and digital innovators',
      'Health & Wellness': 'Health-conscious individuals and wellness professionals',
      'Education': 'Students, educators, and lifelong learners',
      'E-commerce': 'Online entrepreneurs and digital marketers',
      'Finance': 'Small businesses, investors, and financial professionals',
      'Real Estate': 'Property investors, agents, and homeowners',
      'Food & Beverage': 'Food enthusiasts, restaurants, and culinary professionals'
    };
    
    return audienceMap[interest] || 'Professionals and businesses in specialized markets';
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateBusinessIdeas();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGenerator = () => {
    setCurrentStep(0);
    setInputs({
      interests: [],
      skills: [],
      budget: '',
      expertise: '',
      timeCommitment: '',
      riskTolerance: ''
    });
    setBusinessIdeas([]);
    setShowResults(false);
    setGenerationStatus('');
    setShowAnalytics(false);
    setShowSavedSessions(false);
    setShowValidation(false);
    setShowResources(false);
    setShowComparison(false);
    setSelectedForComparison([]);
  };

  const handleIdeaClick = (idea: BusinessIdea) => {
    trackingService.trackIdeaClick(idea.id, idea.title, idea.category);
  };

  const handleFavoriteIdea = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile) {
      const profile = userProfileService.createProfile();
      setUserProfile(profile);
    }
    
    const profile = userProfileService.getProfile();
    const idea = businessIdeas.find(i => i.id === ideaId);
    
    if (profile?.favoriteIdeas.includes(ideaId)) {
      userProfileService.removeFavoriteIdea(ideaId);
      if (idea) {
        trackingService.trackFavoriteAction(ideaId, idea.title, idea.category, 'remove');
      }
    } else {
      userProfileService.addFavoriteIdea(ideaId);
      if (idea) {
        trackingService.trackFavoriteAction(ideaId, idea.title, idea.category, 'add');
      }
    }
    setUserProfile(userProfileService.getProfile());
  };

  const handleValidateIdea = (idea: BusinessIdea, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIdeaForValidation(idea);
    setShowValidation(true);
  };

  const handleToggleComparison = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForComparison(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : prev.length < 3 ? [...prev, ideaId] : prev
    );
  };

  const handleSaveSession = () => {
    const sessionId = userProfileService.saveSession(currentStep, inputs, businessIdeas);
    if (sessionId) {
      showToast('Session saved successfully!', 'success');
    } else {
      showToast('Failed to save session', 'error');
    }
  };

  const handleLoadSession = (session: any) => {
    setCurrentStep(session.currentStep);
    setInputs(session.inputs);
    if (session.generatedIdeas.length > 0) {
      setBusinessIdeas(session.generatedIdeas);
      setShowResults(true);
    }
  };

  if (isGenerating) {
    return <GeneratingLoader status={generationStatus} />;
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your AI-Generated Business Ideas</h1>
            <p className="text-xl text-gray-600 mb-8">Personalized recommendations based on your unique profile</p>
            <button
              onClick={resetGenerator}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-300"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate New Ideas
            </button>
            <button
              onClick={() => setShowAnalytics(true)}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 ml-4"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </button>
            <button
              onClick={() => setShowResources(true)}
              className="inline-flex items-center px-6 py-3 bg-green-100 text-green-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-green-200 hover:border-green-300 ml-4"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Resources
            </button>
            {selectedForComparison.length > 0 && (
              <button
                onClick={() => setShowComparison(true)}
                className="inline-flex items-center px-6 py-3 bg-purple-100 text-purple-700 font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-purple-200 hover:border-purple-300 ml-4"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Compare ({selectedForComparison.length})
              </button>
            )}
          </div>

          {/* Search and Filter */}
          <IdeaSearch 
            ideas={businessIdeas} 
            onFilteredIdeas={setFilteredIdeas}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(filteredIdeas.length > 0 ? filteredIdeas : businessIdeas).map((idea, index) => (
              <div 
                key={idea.id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleIdeaClick(idea)}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {idea.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => handleFavoriteIdea(idea.id, e)}
                        className={`p-2 rounded-full transition-colors ${
                          userProfile?.favoriteIdeas.includes(idea.id)
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleToggleComparison(idea.id, e)}
                        className={`p-2 rounded-full transition-colors ${
                          selectedForComparison.includes(idea.id)
                            ? 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={selectedForComparison.length >= 3 && !selectedForComparison.includes(idea.id) ? 'Maximum 3 ideas for comparison' : 'Add to comparison'}
                        disabled={selectedForComparison.length >= 3 && !selectedForComparison.includes(idea.id)}
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleValidateIdea(idea, e)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.share?.({
                            title: idea.title,
                            text: idea.description,
                            url: window.location.href
                          });
                        }}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end mb-4">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                      <span className="text-xs text-gray-500 mr-2">Difficulty:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full mx-0.5 ${
                            i < idea.difficulty ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{idea.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{idea.description}</p>
                  
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm text-blue-800">
                      {idea.marketInsight}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-green-700 mb-1">Startup Cost</div>
                      <div className="text-sm font-semibold text-green-800">{idea.startupCost}</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-blue-700 mb-1">Time to Market</div>
                      <div className="text-sm font-semibold text-blue-800">{idea.timeToMarket}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-purple-700 mb-1">Revenue Potential</div>
                      <div className="text-sm font-semibold text-purple-800">{idea.potentialRevenue}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-orange-700 mb-1">Risk Level</div>
                      <div className="text-sm font-semibold text-orange-800">{idea.riskLevel}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Implementation Steps:</h4>
                    <div className="space-y-2">
                      {idea.keySteps.slice(0, 4).map((step, i) => (
                        <div key={i} className="flex items-start text-sm text-gray-600">
                          <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5 flex-shrink-0">
                            {i + 1}
                          </div>
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {idea.uniqueValue && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Unique Value:</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{idea.uniqueValue}</p>
                    </div>
                  )}

                  {idea.targetAudience && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Target Audience:</h4>
                      <p className="text-sm text-gray-600">{idea.targetAudience}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 flex-1">
                      <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                        Market Insight
                      </h4>
                      <p className="text-sm text-gray-600">{idea.marketInsight}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {currentStep === 0 && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
                <Lightbulb className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                AI Business Idea Generator
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Get personalized business ideas powered by advanced AI. We'll analyze your interests, skills, and resources to suggest the perfect opportunities for you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <Brain className="w-8 h-8 text-blue-600 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">Advanced algorithms analyze market trends and your unique profile</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <Target className="w-8 h-8 text-purple-600 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Highly Personalized</h3>
                <p className="text-gray-600 text-sm">Tailored suggestions based on your specific background and goals</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <TrendingUp className="w-8 h-8 text-green-600 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 mb-2">Market-Validated</h3>
                <p className="text-gray-600 text-sm">Ideas validated against current market opportunities and trends</p>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {currentStep > 0 && (
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Progress Bar */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index + 1 === currentStep;
                  const isCompleted = index + 1 < currentStep;
                  
                  return (
                    <div key={index} className="flex items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {steps[currentStep - 1]?.title}
                </h2>
                <p className="text-gray-600">Step {currentStep} of {steps.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Step 1: Interests */}
              {currentStep === 1 && (
                <StepTransition>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">What are your main interests?</h3>
                  <p className="text-gray-600 mb-6">Select all areas that genuinely interest you. This helps us find business opportunities you'll be passionate about.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {INTEREST_OPTIONS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => setInputs({
                          ...inputs,
                          interests: toggleArrayItem(inputs.interests, interest)
                        })}
                        className={`p-3 rounded-lg border-2 text-left text-sm transition-all duration-300 hover:scale-105 ${
                          inputs.interests.includes(interest)
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">Selected: {inputs.interests.length} interests</p>
                </StepTransition>
              )}

              {/* Step 2: Skills */}
              {currentStep === 2 && (
                <StepTransition>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">What are your key skills?</h3>
                  <p className="text-gray-600 mb-6">Choose skills you're confident in or would like to leverage in a business.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto custom-scrollbar">
                    {SKILL_OPTIONS.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setInputs({
                          ...inputs,
                          skills: toggleArrayItem(inputs.skills, skill)
                        })}
                        className={`p-3 rounded-lg border-2 text-left text-sm transition-all duration-300 hover:scale-105 ${
                          inputs.skills.includes(skill)
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">Selected: {inputs.skills.length} skills</p>
                </StepTransition>
              )}

              {/* Step 3: Budget */}
              {currentStep === 3 && (
                <StepTransition>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">What's your startup budget?</h3>
                  <p className="text-gray-600 mb-6">This helps us suggest businesses that match your financial capacity.</p>
                  <div className="space-y-3">
                    {[
                      'Under $1,000',
                      '$1,000 - $5,000',
                      '$5,000 - $25,000',
                      '$25,000 - $100,000',
                      'Over $100,000'
                    ].map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setInputs({...inputs, budget})}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 hover:scale-105 ${
                          inputs.budget === budget
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </StepTransition>
              )}

              {/* Step 4: Experience */}
              {currentStep === 4 && (
                <StepTransition>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">What's your business experience level?</h3>
                  <p className="text-gray-600 mb-6">This helps us calibrate the complexity of suggested opportunities.</p>
                  <div className="space-y-3">
                    {EXPERTISE_OPTIONS.map((expertise) => (
                      <button
                        key={expertise}
                        onClick={() => setInputs({...inputs, expertise})}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 hover:scale-105 ${
                          inputs.expertise === expertise
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">{expertise.split(' - ')[0]}</div>
                        <div className="text-sm text-gray-500">{expertise.split(' - ')[1]}</div>
                      </button>
                    ))}
                  </div>
                </StepTransition>
              )}

              {/* Step 5: Preferences */}
              {currentStep === 5 && (
                <StepTransition>
                  <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Final preferences</h3>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        How much time can you dedicate weekly?
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Part-time (10-20 hours)',
                          'Full-time (40+ hours)',
                        ].map((time) => (
                          <button
                            key={time}
                            onClick={() => setInputs({...inputs, timeCommitment: time})}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover:scale-105 ${
                              inputs.timeCommitment === time
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Risk tolerance level?
                      </label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          'Conservative - Lower risk, steady returns',
                          'Moderate - Balanced risk and reward',
                          'Aggressive - Higher risk, higher potential'
                        ].map((risk) => (
                          <button
                            key={risk}
                            onClick={() => setInputs({...inputs, riskTolerance: risk})}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 hover:scale-105 ${
                              inputs.riskTolerance === risk
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {risk}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  </div>
                </StepTransition>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowSavedSessions(true)}
                    className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <History className="w-4 h-4 mr-2" />
                    Load Session
                  </button>
                  <button
                    onClick={handleSaveSession}
                    className="flex items-center px-4 py-2 text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                  </button>
                  <button
                    onClick={prevStep}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                    }`}
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                </div>
                
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && inputs.interests.length === 0) ||
                    (currentStep === 2 && inputs.skills.length === 0) ||
                    (currentStep === 3 && !inputs.budget) ||
                    (currentStep === 4 && !inputs.expertise) ||
                    (currentStep === 5 && (!inputs.timeCommitment || !inputs.riskTolerance))
                  }
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    (currentStep === 1 && inputs.interests.length === 0) ||
                    (currentStep === 2 && inputs.skills.length === 0) ||
                    (currentStep === 3 && !inputs.budget) ||
                    (currentStep === 4 && !inputs.expertise) ||
                    (currentStep === 5 && (!inputs.timeCommitment || !inputs.riskTolerance))
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {currentStep === 5 ? (
                    <>
                      <Brain className="w-5 h-5 mr-2 inline" />
                      Generate AI Ideas
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-5 h-5 ml-2 inline" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AnalyticsDashboard 
        isOpen={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
      />
      
      <SavedSessions
        isOpen={showSavedSessions}
        onClose={() => setShowSavedSessions(false)}
        onLoadSession={handleLoadSession}
      />
      
      <BusinessValidation
        isOpen={showValidation}
        onClose={() => setShowValidation(false)}
        businessIdea={selectedIdeaForValidation}
        userProfile={userProfile || inputs}
      />
      
      <ResourceLibrary
        isOpen={showResources}
        onClose={() => setShowResources(false)}
        businessIdea={selectedIdeaForValidation}
        userProfile={userProfile || inputs}
      />
      
      <IdeaComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        ideas={businessIdeas}
        selectedIdeas={selectedForComparison}
        onToggleIdea={(ideaId) => setSelectedForComparison(prev => prev.filter(id => id !== ideaId))}
      />
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

export default App;
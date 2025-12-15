interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'template' | 'tool' | 'course' | 'article' | 'video';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  url?: string;
  content?: string;
  tags: string[];
  rating: number;
  views: number;
}

interface ImplementationGuide {
  id: string;
  title: string;
  description: string;
  steps: {
    title: string;
    description: string;
    estimatedTime: string;
    resources: string[];
    checklist: string[];
  }[];
  totalTime: string;
  difficulty: string;
  prerequisites: string[];
}

class ResourceService {
  private resources: Resource[] = [
    {
      id: 'business-plan-template',
      title: 'Comprehensive Business Plan Template',
      description: 'A detailed template covering all aspects of business planning including market analysis, financial projections, and operational strategy.',
      type: 'template',
      category: 'Planning',
      difficulty: 'intermediate',
      estimatedTime: '2-4 hours',
      content: `# Business Plan Template

## Executive Summary
- Business concept and unique value proposition
- Target market and competitive advantage
- Financial highlights and funding requirements

## Market Analysis
- Industry overview and trends
- Target customer analysis
- Competitive landscape assessment

## Marketing Strategy
- Brand positioning and messaging
- Customer acquisition channels
- Pricing strategy and revenue model

## Operations Plan
- Business model and processes
- Technology and infrastructure needs
- Staffing and organizational structure

## Financial Projections
- Revenue forecasts (3-5 years)
- Expense budgets and cash flow
- Break-even analysis and ROI projections

## Risk Assessment
- Potential challenges and mitigation strategies
- Contingency planning
- Success metrics and KPIs`,
      tags: ['planning', 'strategy', 'template'],
      rating: 4.8,
      views: 15420
    },
    {
      id: 'market-research-guide',
      title: 'Complete Market Research Guide',
      description: 'Step-by-step guide to conducting thorough market research for your business idea validation.',
      type: 'guide',
      category: 'Research',
      difficulty: 'beginner',
      estimatedTime: '3-5 hours',
      content: `# Market Research Guide

## Primary Research Methods
### Surveys and Questionnaires
- Design effective survey questions
- Choose appropriate sample sizes
- Analyze and interpret results

### Interviews and Focus Groups
- Prepare interview scripts
- Conduct effective interviews
- Extract actionable insights

## Secondary Research Sources
### Industry Reports
- IBISWorld, Statista, McKinsey reports
- Government databases and statistics
- Trade association publications

### Competitive Analysis
- Direct and indirect competitor identification
- SWOT analysis framework
- Pricing and positioning analysis

## Market Sizing Techniques
### TAM, SAM, SOM Framework
- Total Addressable Market calculation
- Serviceable Addressable Market estimation
- Serviceable Obtainable Market projection

### Bottom-up vs Top-down Analysis
- Customer-based market sizing
- Industry-based market estimation
- Validation through multiple approaches`,
      tags: ['research', 'validation', 'analysis'],
      rating: 4.6,
      views: 12890
    },
    {
      id: 'mvp-development-guide',
      title: 'MVP Development Strategy',
      description: 'Learn how to build a Minimum Viable Product that validates your business concept with minimal resources.',
      type: 'guide',
      category: 'Development',
      difficulty: 'intermediate',
      estimatedTime: '4-6 hours',
      content: `# MVP Development Strategy

## Defining Your MVP
### Core Feature Identification
- Essential vs nice-to-have features
- User story mapping
- Feature prioritization frameworks

### Success Metrics Definition
- Key Performance Indicators (KPIs)
- User engagement metrics
- Business validation criteria

## Development Approaches
### No-Code/Low-Code Solutions
- Website builders (Webflow, Squarespace)
- App builders (Bubble, Adalo)
- Automation tools (Zapier, Airtable)

### Rapid Prototyping
- Wireframing and mockups
- Interactive prototypes
- User testing methodologies

## Launch and Iteration
### Beta Testing Strategy
- User recruitment and onboarding
- Feedback collection systems
- Iteration planning and execution

### Scaling Preparation
- Technical architecture planning
- Team building considerations
- Funding and growth strategies`,
      tags: ['mvp', 'development', 'validation'],
      rating: 4.7,
      views: 9650
    },
    {
      id: 'financial-modeling-template',
      title: 'Startup Financial Model Template',
      description: 'Excel template with pre-built formulas for revenue projections, expense tracking, and cash flow analysis.',
      type: 'template',
      category: 'Finance',
      difficulty: 'intermediate',
      estimatedTime: '2-3 hours',
      content: `# Financial Model Template

## Revenue Projections
### Subscription Business Model
- Monthly Recurring Revenue (MRR) calculations
- Customer acquisition and churn rates
- Lifetime Value (LTV) projections

### Transaction-Based Model
- Transaction volume forecasting
- Average transaction value trends
- Seasonal adjustment factors

## Expense Categories
### Fixed Costs
- Rent and utilities
- Software subscriptions
- Insurance and legal fees

### Variable Costs
- Cost of goods sold (COGS)
- Marketing and advertising
- Transaction processing fees

## Cash Flow Analysis
### Monthly Cash Flow Projections
- Operating cash flow calculations
- Investment cash flow tracking
- Financing cash flow management

### Scenario Planning
- Best case, worst case, realistic scenarios
- Sensitivity analysis for key variables
- Break-even analysis and runway calculations`,
      tags: ['finance', 'modeling', 'projections'],
      rating: 4.5,
      views: 8340
    },
    {
      id: 'customer-acquisition-playbook',
      title: 'Customer Acquisition Playbook',
      description: 'Comprehensive guide to acquiring your first 100 customers across different channels and industries.',
      type: 'guide',
      category: 'Marketing',
      difficulty: 'intermediate',
      estimatedTime: '3-4 hours',
      content: `# Customer Acquisition Playbook

## Channel Strategy
### Digital Marketing Channels
- Search Engine Optimization (SEO)
- Pay-Per-Click (PPC) advertising
- Social media marketing
- Content marketing and blogging

### Traditional Marketing Channels
- Networking and referrals
- Direct sales and cold outreach
- Trade shows and events
- Print and media advertising

## Customer Acquisition Cost (CAC) Optimization
### Channel Performance Tracking
- Cost per acquisition by channel
- Conversion rate optimization
- Attribution modeling

### Lifetime Value Optimization
- Customer retention strategies
- Upselling and cross-selling
- Referral program development

## Growth Hacking Techniques
### Viral Marketing Strategies
- Referral program design
- Social sharing optimization
- Community building tactics

### Partnership and Collaboration
- Strategic partnership identification
- Joint venture opportunities
- Influencer collaboration strategies`,
      tags: ['marketing', 'acquisition', 'growth'],
      rating: 4.9,
      views: 18750
    }
  ];

  private implementationGuides: ImplementationGuide[] = [
    {
      id: 'consulting-business-guide',
      title: 'Launch Your Consulting Business',
      description: 'Complete step-by-step guide to starting and scaling a successful consulting practice.',
      steps: [
        {
          title: 'Define Your Niche and Services',
          description: 'Identify your expertise area and create a focused service offering that addresses specific client pain points.',
          estimatedTime: '1-2 weeks',
          resources: ['market-research-guide', 'business-plan-template'],
          checklist: [
            'Identify your core expertise and experience',
            'Research market demand for your services',
            'Define 3-5 specific service offerings',
            'Create service descriptions and pricing',
            'Validate demand through customer interviews'
          ]
        },
        {
          title: 'Build Your Professional Brand',
          description: 'Establish credibility and visibility through professional branding, website, and thought leadership content.',
          estimatedTime: '2-3 weeks',
          resources: ['mvp-development-guide'],
          checklist: [
            'Design professional logo and brand identity',
            'Build a professional website with case studies',
            'Create LinkedIn profile and company page',
            'Develop content calendar for thought leadership',
            'Gather testimonials and recommendations'
          ]
        },
        {
          title: 'Network and Generate Leads',
          description: 'Build relationships and create a pipeline of potential clients through strategic networking and marketing.',
          estimatedTime: '4-6 weeks',
          resources: ['customer-acquisition-playbook'],
          checklist: [
            'Join relevant industry associations',
            'Attend networking events and conferences',
            'Reach out to former colleagues and contacts',
            'Create and share valuable content regularly',
            'Develop referral partner relationships'
          ]
        },
        {
          title: 'Deliver and Scale',
          description: 'Execute your first projects successfully and build systems for scaling your consulting practice.',
          estimatedTime: '3-6 months',
          resources: ['financial-modeling-template'],
          checklist: [
            'Complete first client projects successfully',
            'Document processes and methodologies',
            'Create case studies from successful projects',
            'Develop pricing strategy for different services',
            'Build team or partner network for scaling'
          ]
        }
      ],
      totalTime: '3-4 months',
      difficulty: 'Medium',
      prerequisites: ['Professional experience in chosen field', 'Basic business knowledge', 'Network of professional contacts']
    },
    {
      id: 'tech-platform-guide',
      title: 'Build a Technology Platform',
      description: 'Comprehensive guide to developing and launching a successful technology platform or SaaS product.',
      steps: [
        {
          title: 'Market Research and Validation',
          description: 'Thoroughly research your target market and validate the problem you\'re solving before building anything.',
          estimatedTime: '2-4 weeks',
          resources: ['market-research-guide'],
          checklist: [
            'Conduct customer interviews and surveys',
            'Analyze competitor solutions and gaps',
            'Define target customer personas',
            'Validate problem-solution fit',
            'Estimate market size and opportunity'
          ]
        },
        {
          title: 'MVP Development',
          description: 'Build a minimum viable product that demonstrates core value proposition with essential features only.',
          estimatedTime: '8-16 weeks',
          resources: ['mvp-development-guide'],
          checklist: [
            'Define core features and user flows',
            'Choose technology stack and architecture',
            'Design user interface and experience',
            'Develop and test core functionality',
            'Set up analytics and monitoring'
          ]
        },
        {
          title: 'Beta Launch and Feedback',
          description: 'Launch to a limited audience, gather feedback, and iterate based on real user behavior and needs.',
          estimatedTime: '4-8 weeks',
          resources: ['customer-acquisition-playbook'],
          checklist: [
            'Recruit beta users from target audience',
            'Set up feedback collection systems',
            'Monitor user behavior and engagement',
            'Iterate based on user feedback',
            'Prepare for broader market launch'
          ]
        },
        {
          title: 'Scale and Optimize',
          description: 'Expand your user base, optimize for growth, and build sustainable business operations.',
          estimatedTime: '6-12 months',
          resources: ['financial-modeling-template'],
          checklist: [
            'Implement customer acquisition strategies',
            'Optimize conversion and retention rates',
            'Scale technical infrastructure',
            'Build customer support systems',
            'Develop pricing and monetization strategy'
          ]
        }
      ],
      totalTime: '6-12 months',
      difficulty: 'High',
      prerequisites: ['Technical development skills or team', 'Understanding of target market', 'Sufficient funding for development']
    }
  ];

  getResourcesByCategory(category: string): Resource[] {
    return this.resources.filter(resource => 
      resource.category.toLowerCase() === category.toLowerCase() ||
      resource.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );
  }

  getResourcesByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): Resource[] {
    return this.resources.filter(resource => resource.difficulty === difficulty);
  }

  getRecommendedResources(userProfile: any, businessIdea: any): Resource[] {
    const recommendations: Resource[] = [];
    
    // Always recommend business plan template
    recommendations.push(this.resources.find(r => r.id === 'business-plan-template')!);
    
    // Recommend based on expertise level
    if (userProfile.expertise?.includes('beginner')) {
      recommendations.push(this.resources.find(r => r.id === 'market-research-guide')!);
    }
    
    // Recommend based on business category
    if (businessIdea.category === 'Technology') {
      recommendations.push(this.resources.find(r => r.id === 'mvp-development-guide')!);
    }
    
    // Always recommend customer acquisition
    recommendations.push(this.resources.find(r => r.id === 'customer-acquisition-playbook')!);
    
    return recommendations.filter(Boolean);
  }

  getImplementationGuide(businessCategory: string): ImplementationGuide | null {
    const categoryMap: { [key: string]: string } = {
      'Consulting': 'consulting-business-guide',
      'Technology': 'tech-platform-guide'
    };
    
    const guideId = categoryMap[businessCategory];
    return this.implementationGuides.find(guide => guide.id === guideId) || null;
  }

  getAllResources(): Resource[] {
    return this.resources;
  }

  getResourceById(id: string): Resource | null {
    return this.resources.find(resource => resource.id === id) || null;
  }

  trackResourceView(resourceId: string): void {
    const resource = this.resources.find(r => r.id === resourceId);
    if (resource) {
      resource.views += 1;
    }
  }
}

export const resourceService = new ResourceService();
export type { Resource, ImplementationGuide };
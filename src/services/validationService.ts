interface MarketValidation {
  marketSize: string;
  competitionLevel: string;
  trendAnalysis: string;
  barriers: string[];
  opportunities: string[];
  riskFactors: string[];
  successProbability: number;
  timeToBreakeven: string;
  scalabilityScore: number;
}

interface CompetitorInfo {
  name: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
  pricing: string;
}

interface FinancialProjection {
  initialInvestment: number;
  monthlyExpenses: number;
  projectedRevenue: {
    month6: number;
    year1: number;
    year2: number;
    year3: number;
  };
  breakEvenPoint: string;
  roi: {
    year1: string;
    year2: string;
    year3: string;
  };
}

class ValidationService {
  validateBusinessIdea(idea: any, userProfile: any): MarketValidation {
    // Simulate comprehensive market validation
    const validation: MarketValidation = {
      marketSize: this.calculateMarketSize(idea.category),
      competitionLevel: this.assessCompetition(idea.category),
      trendAnalysis: this.analyzeTrends(idea.category),
      barriers: this.identifyBarriers(idea.category, userProfile.budget),
      opportunities: this.findOpportunities(idea.category, userProfile.interests),
      riskFactors: this.assessRisks(idea.category, userProfile.expertise),
      successProbability: this.calculateSuccessProbability(idea, userProfile),
      timeToBreakeven: this.estimateBreakeven(idea.category, userProfile.budget),
      scalabilityScore: this.assessScalability(idea.category)
    };

    return validation;
  }

  private calculateMarketSize(category: string): string {
    const marketSizes: { [key: string]: string } = {
      'Technology': '$5.2 trillion global market, growing 8% annually',
      'Consulting': '$160 billion market, 7% annual growth',
      'Education': '$350 billion online education market, 15% growth',
      'Services': '$2.4 trillion business services market',
      'E-commerce': '$6.2 trillion global market, 12% growth'
    };
    
    return marketSizes[category] || '$50+ billion addressable market with steady growth';
  }

  private assessCompetition(category: string): string {
    const competition: { [key: string]: string } = {
      'Technology': 'High - Many established players, but room for innovation',
      'Consulting': 'Medium - Fragmented market with local opportunities',
      'Education': 'Medium-High - Growing market with differentiation opportunities',
      'Services': 'Medium - Local competition, relationship-based',
      'E-commerce': 'High - Dominated by major platforms, niche opportunities exist'
    };
    
    return competition[category] || 'Medium - Competitive but opportunities exist for differentiation';
  }

  private analyzeTrends(category: string): string {
    const trends: { [key: string]: string } = {
      'Technology': 'AI/ML adoption accelerating, remote work driving digital transformation',
      'Consulting': 'Digital transformation consulting in high demand, sustainability focus growing',
      'Education': 'Microlearning and skill-based education trending, corporate training expanding',
      'Services': 'Automation creating new service categories, personalization increasingly important',
      'E-commerce': 'Social commerce growing, sustainability and local sourcing trending'
    };
    
    return trends[category] || 'Market showing positive growth trends with digital adoption increasing';
  }

  private identifyBarriers(category: string, budget: string): string[] {
    const commonBarriers = ['Initial capital requirements', 'Customer acquisition costs', 'Regulatory compliance'];
    
    if (budget.includes('Under $1,000')) {
      return [...commonBarriers, 'Limited marketing budget', 'Bootstrap growth challenges'];
    }
    
    if (category === 'Technology') {
      return [...commonBarriers, 'Technical complexity', 'Development time', 'Talent acquisition'];
    }
    
    return commonBarriers;
  }

  private findOpportunities(category: string, interests: string[]): string[] {
    const baseOpportunities = ['Growing market demand', 'Digital transformation acceleration'];
    
    if (interests.includes('Artificial Intelligence')) {
      return [...baseOpportunities, 'AI integration opportunities', 'Automation potential'];
    }
    
    if (interests.includes('Environmental')) {
      return [...baseOpportunities, 'Sustainability focus', 'Green technology adoption'];
    }
    
    return [...baseOpportunities, 'Niche specialization potential', 'Partnership opportunities'];
  }

  private assessRisks(category: string, expertise: string): string[] {
    const baseRisks = ['Market competition', 'Economic downturns', 'Customer acquisition challenges'];
    
    if (expertise.includes('beginner')) {
      return [...baseRisks, 'Learning curve challenges', 'Operational inexperience'];
    }
    
    if (category === 'Technology') {
      return [...baseRisks, 'Technical obsolescence', 'Security vulnerabilities', 'Scalability challenges'];
    }
    
    return baseRisks;
  }

  private calculateSuccessProbability(idea: any, userProfile: any): number {
    let probability = 60; // Base probability
    
    // Adjust based on user expertise
    if (userProfile.expertise.includes('Serial entrepreneur')) probability += 15;
    if (userProfile.expertise.includes('Domain expert')) probability += 10;
    if (userProfile.expertise.includes('beginner')) probability -= 10;
    
    // Adjust based on idea difficulty vs user skills
    if (idea.difficulty <= 2 && userProfile.skills.length >= 3) probability += 10;
    if (idea.difficulty >= 4 && userProfile.skills.length < 2) probability -= 15;
    
    // Adjust based on budget alignment
    if (userProfile.budget.includes('Over $100,000') && idea.startupCost.includes('Under')) probability += 5;
    
    return Math.max(20, Math.min(85, probability));
  }

  private estimateBreakeven(category: string, budget: string): string {
    const breakeven: { [key: string]: string } = {
      'Consulting': '3-6 months',
      'Services': '4-8 months',
      'Technology': '8-18 months',
      'Education': '6-12 months',
      'E-commerce': '6-15 months'
    };
    
    let baseTime = breakeven[category] || '6-12 months';
    
    if (budget.includes('Under $1,000')) {
      baseTime = baseTime.replace(/(\d+)/g, (match) => String(parseInt(match) + 2));
    }
    
    return baseTime;
  }

  private assessScalability(category: string): number {
    const scalability: { [key: string]: number } = {
      'Technology': 9,
      'Education': 8,
      'Consulting': 6,
      'Services': 5,
      'E-commerce': 7
    };
    
    return scalability[category] || 6;
  }

  getCompetitorAnalysis(category: string): CompetitorInfo[] {
    // Simulated competitor data - in real app, this would come from market research APIs
    const competitors: { [key: string]: CompetitorInfo[] } = {
      'Technology': [
        {
          name: 'TechCorp Solutions',
          description: 'Enterprise software solutions',
          strengths: ['Established brand', 'Large client base', 'Comprehensive features'],
          weaknesses: ['High pricing', 'Complex setup', 'Poor customer service'],
          marketShare: '15%',
          pricing: '$500-2000/month'
        },
        {
          name: 'InnovateTech',
          description: 'Startup-focused tech solutions',
          strengths: ['Modern UI', 'Competitive pricing', 'Fast implementation'],
          weaknesses: ['Limited features', 'Small team', 'New to market'],
          marketShare: '3%',
          pricing: '$50-300/month'
        }
      ],
      'Consulting': [
        {
          name: 'Big Consulting Firm',
          description: 'Global management consulting',
          strengths: ['Brand recognition', 'Extensive resources', 'Proven methodologies'],
          weaknesses: ['Very expensive', 'Slow delivery', 'One-size-fits-all approach'],
          marketShare: '25%',
          pricing: '$200-500/hour'
        }
      ]
    };
    
    return competitors[category] || [];
  }

  generateFinancialProjection(idea: any, userInputs: any): FinancialProjection {
    // Extract numbers from startup cost string
    const costMatch = idea.startupCost.match(/\$?([\d,]+)/);
    const initialInvestment = costMatch ? parseInt(costMatch[1].replace(',', '')) : 5000;
    
    const monthlyExpenses = Math.round(initialInvestment * 0.15); // 15% of initial investment
    
    // Revenue projections based on category and user commitment
    const isFullTime = userInputs.timeCommitment?.includes('Full-time');
    const multiplier = isFullTime ? 1.5 : 1;
    
    const baseRevenue = {
      'Technology': 8000,
      'Consulting': 12000,
      'Education': 6000,
      'Services': 10000
    };
    
    const monthlyBase = (baseRevenue[idea.category as keyof typeof baseRevenue] || 8000) * multiplier;
    
    return {
      initialInvestment,
      monthlyExpenses,
      projectedRevenue: {
        month6: Math.round(monthlyBase * 0.3),
        year1: Math.round(monthlyBase * 0.7),
        year2: Math.round(monthlyBase * 1.2),
        year3: Math.round(monthlyBase * 1.8)
      },
      breakEvenPoint: `${Math.ceil(initialInvestment / (monthlyBase * 0.7 - monthlyExpenses))} months`,
      roi: {
        year1: `${Math.round(((monthlyBase * 0.7 * 12 - monthlyExpenses * 12 - initialInvestment) / initialInvestment) * 100)}%`,
        year2: `${Math.round(((monthlyBase * 1.2 * 12 - monthlyExpenses * 12) / initialInvestment) * 100)}%`,
        year3: `${Math.round(((monthlyBase * 1.8 * 12 - monthlyExpenses * 12) / initialInvestment) * 100)}%`
      }
    };
  }
}

export const validationService = new ValidationService();
export type { MarketValidation, CompetitorInfo, FinancialProjection };
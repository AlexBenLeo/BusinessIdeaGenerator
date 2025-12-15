interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface UserInputs {
  interests: string[];
  skills: string[];
  budget: string;
  expertise: string;
  timeCommitment: string;
  riskTolerance: string;
}

export interface AIBusinessIdea {
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
  uniqueValue: string;
  targetAudience: string;
}

class ClaudeAIService {
  private apiKey: string;
  private apiUrl: string = 'https://api.anthropic.com/v1/messages';
  private model: string = 'claude-3-sonnet-20240229';

  constructor() {
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';
    
    if (import.meta.env.VITE_CLAUDE_MODEL) {
      this.model = import.meta.env.VITE_CLAUDE_MODEL;
    }
  }

  private isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_claude_api_key_here';
  }

  private createPrompt(userInputs: UserInputs): string {
    return `You are an expert business consultant and entrepreneur with deep knowledge of market trends, business models, and startup strategies. Generate 4 unique, personalized business ideas based on the following user profile:

**User Profile:**
- Interests: ${userInputs.interests.join(', ')}
- Skills: ${userInputs.skills.join(', ')}
- Budget: ${userInputs.budget}
- Experience Level: ${userInputs.expertise}
- Time Commitment: ${userInputs.timeCommitment}
- Risk Tolerance: ${userInputs.riskTolerance}

**Requirements:**
1. Each idea should be realistic and actionable given the user's profile
2. Ideas should leverage the user's existing skills and interests
3. Consider the user's budget constraints and risk tolerance
4. Provide diverse business models (consulting, technology, services, products)
5. Include market validation and competitive analysis insights

**For each business idea, provide:**
- Title: Compelling, specific business name/concept
- Description: 2-3 sentences explaining the business concept and value proposition
- Category: Primary business category (Technology, Consulting, Education, Services, etc.)
- Startup Cost: Realistic range based on user's budget (e.g., "$2,000 - $8,000")
- Difficulty: Number from 1-5 (1=very easy, 5=very challenging)
- Time to Market: Realistic timeline (e.g., "3-6 months")
- Potential Revenue: Monthly revenue potential (e.g., "$5K - $25K monthly")
- Key Steps: 5 specific, actionable implementation steps
- Market Insight: Current market trends and opportunities (1-2 sentences)
- Risk Level: Low, Medium, or High based on market conditions
- Unique Value: What makes this opportunity special for this user
- Target Audience: Specific customer segments to focus on

**Format your response as a valid JSON array with 4 business idea objects. Each object should have all the fields listed above. Ensure the JSON is properly formatted and can be parsed.**

Example format:
[
  {
    "title": "AI-Powered Marketing Consultancy",
    "description": "Help small businesses leverage AI tools for marketing automation and customer insights...",
    "category": "Consulting",
    "startupCost": "$2,000 - $5,000",
    "difficulty": 3,
    "timeToMarket": "2-4 months",
    "potentialRevenue": "$8K - $30K monthly",
    "keySteps": ["Define service offerings", "Build AI tool stack", "Create case studies", "Launch marketing", "Scale operations"],
    "marketInsight": "AI marketing tools market growing 25% annually as SMBs seek competitive advantages",
    "riskLevel": "Medium",
    "uniqueValue": "Combines technical AI knowledge with marketing expertise for underserved SMB market",
    "targetAudience": "Small to medium businesses with 10-100 employees seeking marketing automation"
  }
]

Generate 4 unique, high-quality business ideas now:`;
  }

  async generateBusinessIdeas(userInputs: UserInputs): Promise<AIBusinessIdea[]> {
    // Check if Claude AI is configured
    if (!this.isConfigured()) {
      console.warn('Claude AI not configured, falling back to local generation');
      return this.generateFallbackIdeas(userInputs);
    }

    try {
      const prompt = this.createPrompt(userInputs);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 4000,
          temperature: 0.7,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Claude API Error:', response.status, errorText);
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data: ClaudeResponse = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from Claude API');
      }

      const responseText = data.content[0].text;
      
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Claude response');
      }

      const businessIdeas: AIBusinessIdea[] = JSON.parse(jsonMatch[0]);
      
      // Validate the response structure
      if (!Array.isArray(businessIdeas) || businessIdeas.length === 0) {
        throw new Error('Invalid business ideas format from Claude');
      }

      // Validate each idea has required fields
      const validatedIdeas = businessIdeas.map((idea: AIBusinessIdea) => ({
        title: idea.title || 'Untitled Business Idea',
        description: idea.description || 'No description provided',
        category: idea.category || 'General',
        startupCost: idea.startupCost || '$1,000 - $5,000',
        difficulty: typeof idea.difficulty === 'number' ? idea.difficulty : 3,
        timeToMarket: idea.timeToMarket || '3-6 months',
        potentialRevenue: idea.potentialRevenue || '$5K - $20K monthly',
        keySteps: Array.isArray(idea.keySteps) ? idea.keySteps : ['Research market', 'Develop product', 'Launch business', 'Scale operations', 'Optimize growth'],
        marketInsight: idea.marketInsight || 'Market showing positive growth trends',
        riskLevel: idea.riskLevel || 'Medium',
        uniqueValue: idea.uniqueValue || 'Leverages your unique skills and experience',
        targetAudience: idea.targetAudience || 'Target customers in your area of expertise'
      }));

      console.log('Successfully generated ideas with Claude AI');
      return validatedIdeas;

    } catch (error) {
      console.error('Error calling Claude API:', error);
      console.log('Falling back to local generation');
      return this.generateFallbackIdeas(userInputs);
    }
  }

  private generateFallbackIdeas(userInputs: UserInputs): AIBusinessIdea[] {
    // Enhanced fallback generation with better logic
    const ideas: AIBusinessIdea[] = [];
    
    const templates = [
      this.generateConsultingIdea,
      this.generateTechPlatformIdea,
      this.generateEducationIdea,
      this.generateServiceIdea
    ];
    
    templates.forEach((template, index) => {
      const idea = template(userInputs, index);
      ideas.push(idea);
    });
    
    return ideas;
  }

  private generateConsultingIdea(userInputs: UserInputs, index: number): AIBusinessIdea {
    const primaryInterest = userInputs.interests[0] || 'Business';
    const primarySkill = userInputs.skills[0] || 'Consulting';
    const secondarySkill = userInputs.skills[1] || 'Strategy';
    
    return {
      title: `${primaryInterest} ${primarySkill} Consultancy`,
      description: `Launch a specialized consulting firm that combines your expertise in ${primarySkill} and ${secondarySkill} to help businesses in the ${primaryInterest.toLowerCase()} sector optimize their operations, increase efficiency, and accelerate growth through data-driven strategies and proven methodologies.`,
      category: 'Consulting',
      startupCost: this.calculateStartupCost(userInputs.budget, 'low'),
      difficulty: this.calculateDifficulty(userInputs.expertise, 'medium'),
      timeToMarket: '2-4 months',
      potentialRevenue: this.calculateRevenue(userInputs.budget, userInputs.timeCommitment, 'consulting'),
      keySteps: [
        'Define your niche and service offerings',
        'Build a professional brand and online presence',
        'Network and establish industry connections',
        'Create case studies and testimonials',
        'Scale through referrals and partnerships'
      ],
      marketInsight: this.generateMarketInsight(primaryInterest, 'consulting'),
      riskLevel: this.assessRiskLevel(userInputs.riskTolerance, 'low'),
      uniqueValue: `Combines deep ${primarySkill} expertise with ${primaryInterest} industry knowledge to deliver specialized solutions that generic consultants cannot provide`,
      targetAudience: this.generateTargetAudience(primaryInterest, 'b2b')
    };
  }

  private generateTechPlatformIdea(userInputs: UserInputs, index: number): AIBusinessIdea {
    const primaryInterest = userInputs.interests[0] || 'Technology';
    const techSkill = userInputs.skills.find(skill => 
      ['Programming', 'Web Development', 'Mobile Development', 'Data Analysis', 'UX/UI Design'].includes(skill)
    ) || 'Technology';
    
    return {
      title: `${primaryInterest} Digital Marketplace`,
      description: `Create an innovative online platform that connects ${primaryInterest.toLowerCase()} professionals with clients, featuring advanced matching algorithms, integrated payment systems, and community-driven features. Monetize through transaction fees, premium memberships, and value-added services.`,
      category: 'Technology',
      startupCost: this.calculateStartupCost(userInputs.budget, 'medium'),
      difficulty: this.calculateDifficulty(userInputs.expertise, 'high'),
      timeToMarket: '6-12 months',
      potentialRevenue: this.calculateRevenue(userInputs.budget, userInputs.timeCommitment, 'platform'),
      keySteps: [
        'Conduct market research and validate demand',
        'Design user experience and technical architecture',
        'Develop MVP with core features',
        'Launch beta and gather user feedback',
        'Scale platform and add advanced features'
      ],
      marketInsight: this.generateMarketInsight(primaryInterest, 'technology'),
      riskLevel: this.assessRiskLevel(userInputs.riskTolerance, 'medium-high'),
      uniqueValue: `Leverages ${techSkill} expertise to create a specialized platform that addresses specific pain points in the ${primaryInterest} market`,
      targetAudience: this.generateTargetAudience(primaryInterest, 'b2b2c')
    };
  }

  private generateEducationIdea(userInputs: UserInputs, index: number): AIBusinessIdea {
    const primaryInterest = userInputs.interests[0] || 'Education';
    const teachingSkill = userInputs.skills.find(skill => 
      ['Teaching', 'Content Creation', 'Public Speaking', 'Writing'].includes(skill)
    ) || userInputs.skills[0] || 'Teaching';
    
    return {
      title: `${primaryInterest} Mastery Academy`,
      description: `Develop a comprehensive online education platform offering courses, workshops, and certification programs in ${primaryInterest.toLowerCase()}. Combine your ${teachingSkill.toLowerCase()} skills with cutting-edge learning technologies to create engaging, results-driven educational experiences for professionals and enthusiasts.`,
      category: 'Education',
      startupCost: this.calculateStartupCost(userInputs.budget, 'low-medium'),
      difficulty: this.calculateDifficulty(userInputs.expertise, 'medium'),
      timeToMarket: '3-6 months',
      potentialRevenue: this.calculateRevenue(userInputs.budget, userInputs.timeCommitment, 'education'),
      keySteps: [
        'Identify learning gaps and curriculum opportunities',
        'Create high-quality educational content',
        'Build learning platform and user experience',
        'Launch with pilot group and gather feedback',
        'Scale through marketing and partnerships'
      ],
      marketInsight: this.generateMarketInsight(primaryInterest, 'education'),
      riskLevel: this.assessRiskLevel(userInputs.riskTolerance, 'low-medium'),
      uniqueValue: `Combines ${teachingSkill} expertise with ${primaryInterest} knowledge to deliver practical, actionable learning experiences`,
      targetAudience: this.generateTargetAudience(primaryInterest, 'b2c')
    };
  }

  private generateServiceIdea(userInputs: UserInputs, index: number): AIBusinessIdea {
    const primaryInterest = userInputs.interests[0] || 'Business';
    const serviceSkill = userInputs.skills[0] || 'Service';
    const automationPotential = ['Technology', 'Finance', 'Marketing', 'Data Analysis'].includes(serviceSkill);
    
    const businessType = automationPotential ? 'Automated' : 'Premium';
    
    return {
      title: `${businessType} ${primaryInterest} Solutions`,
      description: `Build a ${automationPotential ? 'technology-driven' : 'high-touch'} service business that solves critical problems in the ${primaryInterest.toLowerCase()} industry. Leverage your ${serviceSkill.toLowerCase()} skills to create ${automationPotential ? 'scalable, automated solutions' : 'personalized, premium services'} that deliver measurable results for clients.`,
      category: automationPotential ? 'Technology' : 'Services',
      startupCost: this.calculateStartupCost(userInputs.budget, automationPotential ? 'medium' : 'low'),
      difficulty: this.calculateDifficulty(userInputs.expertise, automationPotential ? 'high' : 'medium'),
      timeToMarket: automationPotential ? '4-8 months' : '2-4 months',
      potentialRevenue: this.calculateRevenue(userInputs.budget, userInputs.timeCommitment, automationPotential ? 'saas' : 'service'),
      keySteps: [
        'Identify high-value problem to solve',
        `${automationPotential ? 'Develop automated solution' : 'Design service delivery process'}`,
        'Test with pilot customers',
        'Refine offering based on feedback',
        `${automationPotential ? 'Scale through automation' : 'Grow through referrals and team expansion'}`
      ],
      marketInsight: this.generateMarketInsight(primaryInterest, automationPotential ? 'automation' : 'services'),
      riskLevel: this.assessRiskLevel(userInputs.riskTolerance, automationPotential ? 'medium' : 'low'),
      uniqueValue: `Applies ${serviceSkill} expertise to deliver ${automationPotential ? 'scalable, efficient' : 'personalized, high-quality'} solutions in the ${primaryInterest} market`,
      targetAudience: this.generateTargetAudience(primaryInterest, 'b2b')
    };
  }

  // Helper methods (same as before but moved to this service)
  private calculateStartupCost(budget: string, complexity: string): string {
    const budgetRanges = {
      'Under $1,000': { low: '$200 - $800', 'low-medium': '$500 - $1,000', medium: '$800 - $1,200', high: '$1,000+' },
      '$1,000 - $5,000': { low: '$500 - $2,000', 'low-medium': '$1,000 - $3,000', medium: '$2,000 - $5,000', high: '$3,000 - $7,000' },
      '$5,000 - $25,000': { low: '$2,000 - $8,000', 'low-medium': '$5,000 - $12,000', medium: '$8,000 - $20,000', high: '$15,000 - $30,000' },
      '$25,000 - $100,000': { low: '$10,000 - $30,000', 'low-medium': '$20,000 - $50,000', medium: '$40,000 - $80,000', high: '$60,000 - $120,000' },
      'Over $100,000': { low: '$25,000 - $75,000', 'low-medium': '$50,000 - $100,000', medium: '$75,000 - $150,000', high: '$100,000 - $250,000' }
    };
    
    return budgetRanges[budget as keyof typeof budgetRanges]?.[complexity as keyof typeof budgetRanges['Under $1,000']] || '$2,000 - $10,000';
  }

  private calculateDifficulty(expertise: string, baseComplexity: string): number {
    const expertiseModifier = {
      'Complete beginner': -1,
      'Some business knowledge': 0,
      'Experienced professional': 0,
      'Management experience': 1,
      'Serial entrepreneur': 1,
      'Domain expert': 1,
      'Technical specialist': 1,
      'Creative professional': 0
    };
    
    const complexityBase = {
      'low': 2,
      'medium': 3,
      'high': 4,
      'medium-high': 4
    };
    
    const modifier = expertiseModifier[expertise as keyof typeof expertiseModifier] || 0;
    const base = complexityBase[baseComplexity as keyof typeof complexityBase] || 3;
    
    return Math.max(1, Math.min(5, base + modifier));
  }

  private calculateRevenue(budget: string, timeCommitment: string, businessType: string): string {
    const isFullTime = timeCommitment.includes('Full-time');
    const budgetLevel = this.getBudgetLevel(budget);
    
    const revenueMatrix = {
      consulting: {
        low: isFullTime ? '$3K - $15K monthly' : '$1K - $8K monthly',
        medium: isFullTime ? '$8K - $35K monthly' : '$3K - $18K monthly',
        high: isFullTime ? '$15K - $60K monthly' : '$6K - $30K monthly'
      },
      platform: {
        low: isFullTime ? '$2K - $20K monthly' : '$500 - $8K monthly',
        medium: isFullTime ? '$5K - $50K monthly' : '$2K - $25K monthly',
        high: isFullTime ? '$10K - $100K monthly' : '$4K - $50K monthly'
      },
      education: {
        low: isFullTime ? '$2K - $12K monthly' : '$800 - $5K monthly',
        medium: isFullTime ? '$5K - $30K monthly' : '$2K - $15K monthly',
        high: isFullTime ? '$10K - $60K monthly' : '$4K - $30K monthly'
      },
      service: {
        low: isFullTime ? '$4K - $20K monthly' : '$1.5K - $10K monthly',
        medium: isFullTime ? '$8K - $40K monthly' : '$3K - $20K monthly',
        high: isFullTime ? '$15K - $75K monthly' : '$6K - $35K monthly'
      },
      saas: {
        low: isFullTime ? '$1K - $15K monthly' : '$300 - $6K monthly',
        medium: isFullTime ? '$3K - $40K monthly' : '$1K - $20K monthly',
        high: isFullTime ? '$8K - $80K monthly' : '$3K - $40K monthly'
      }
    };
    
    return revenueMatrix[businessType as keyof typeof revenueMatrix]?.[budgetLevel] || '$3K - $20K monthly';
  }

  private getBudgetLevel(budget: string): 'low' | 'medium' | 'high' {
    if (budget.includes('Under $1,000') || budget.includes('$1,000 - $5,000')) return 'low';
    if (budget.includes('$5,000 - $25,000')) return 'medium';
    return 'high';
  }

  private generateMarketInsight(interest: string, businessType: string): string {
    const insights = {
      'Technology': {
        consulting: 'Tech consulting market growing 8% annually as businesses accelerate digital transformation',
        technology: 'B2B software platforms seeing 25% annual growth with increasing demand for specialized solutions',
        education: 'Tech education market valued at $85B with 15% annual growth driven by skill gaps',
        services: 'Technology services market expanding rapidly as companies outsource specialized functions',
        automation: 'Business automation market growing 12% annually as companies seek efficiency gains'
      },
      'Health & Wellness': {
        consulting: 'Wellness consulting growing 12% annually as corporate wellness programs expand',
        technology: 'Digital health platforms attracting $14B+ in annual investment',
        education: 'Health education market growing 9% annually with focus on preventive care',
        services: 'Wellness services market valued at $639B with strong consumer demand',
        automation: 'Health tech automation reducing costs by 20-30% while improving outcomes'
      },
      'Education': {
        consulting: 'EdTech consulting growing 18% annually as institutions modernize',
        technology: 'Online learning platforms market expected to reach $350B by 2025',
        education: 'Professional development market growing 13% annually',
        services: 'Educational services seeing increased demand for personalized learning',
        automation: 'AI in education market growing 45% annually with focus on personalization'
      },
      'Finance': {
        consulting: 'Financial consulting growing 7% annually driven by regulatory changes',
        technology: 'FinTech market attracting $100B+ in annual investment',
        education: 'Financial literacy education market expanding as awareness grows',
        services: 'Financial services digitization creating new opportunities',
        automation: 'Financial automation reducing processing costs by 40-60%'
      }
    };
    
    const interestInsights = insights[interest as keyof typeof insights];
    if (interestInsights) {
      return interestInsights[businessType as keyof typeof interestInsights] || 
             `${interest} market showing strong growth with emerging opportunities in ${businessType}`;
    }
    
    return `${interest} sector experiencing growth with increasing demand for specialized ${businessType} solutions`;
  }

  private assessRiskLevel(riskTolerance: string, businessRisk: string): string {
    const riskMap = {
      'Conservative': { low: 'Low', 'low-medium': 'Low', medium: 'Low-Medium', 'medium-high': 'Medium', high: 'Medium' },
      'Moderate': { low: 'Low', 'low-medium': 'Low-Medium', medium: 'Medium', 'medium-high': 'Medium-High', high: 'High' },
      'Aggressive': { low: 'Low-Medium', 'low-medium': 'Medium', medium: 'Medium-High', 'medium-high': 'High', high: 'High' }
    };
    
    const toleranceKey = Object.keys(riskMap).find(key => riskTolerance.includes(key)) || 'Moderate';
    return riskMap[toleranceKey as keyof typeof riskMap][businessRisk as keyof typeof riskMap['Conservative']] || 'Medium';
  }

  private generateTargetAudience(interest: string, businessModel: string): string {
    const audiences = {
      'Technology': {
        b2b: 'Tech companies, startups, and digital agencies seeking specialized expertise',
        b2c: 'Tech professionals, developers, and digital enthusiasts',
        b2b2c: 'Technology service providers and their end customers'
      },
      'Health & Wellness': {
        b2b: 'Healthcare providers, wellness companies, and corporate wellness programs',
        b2c: 'Health-conscious individuals, fitness enthusiasts, and wellness seekers',
        b2b2c: 'Healthcare organizations and their patients/members'
      },
      'Education': {
        b2b: 'Educational institutions, training companies, and corporate learning departments',
        b2c: 'Students, professionals, and lifelong learners seeking skill development',
        b2b2c: 'Educational organizations and their students/employees'
      },
      'Finance': {
        b2b: 'Financial institutions, accounting firms, and business owners',
        b2c: 'Individual investors, small business owners, and financial planning seekers',
        b2b2c: 'Financial service providers and their clients'
      }
    };
    
    const interestAudiences = audiences[interest as keyof typeof audiences];
    if (interestAudiences) {
      return interestAudiences[businessModel as keyof typeof interestAudiences] || 
             `Professionals and businesses in the ${interest.toLowerCase()} sector`;
    }
    
    return `${interest} professionals, businesses, and enthusiasts seeking specialized solutions`;
  }

  // Method to test API connection
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 10,
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ]
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Claude API connection test failed:', error);
      return false;
    }
  }
}

export const claudeAIService = new ClaudeAIService();
export { ClaudeAIService };
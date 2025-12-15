interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  createdAt: number;
  preferences: {
    interests: string[];
    skills: string[];
    budget: string;
    expertise: string;
    timeCommitment: string;
    riskTolerance: string;
  };
  favoriteIdeas: string[];
  completedIdeas: string[];
  feedback: { [ideaId: string]: number }; // 1-5 rating
  learningProgress: {
    viewedResources: string[];
    completedGuides: string[];
    skillsImproved: string[];
  };
}

interface SavedSession {
  id: string;
  timestamp: number;
  currentStep: number;
  inputs: any;
  generatedIdeas: any[];
}

class UserProfileService {
  private storageKey = 'user_profile';
  private sessionKey = 'saved_sessions';
  private currentProfile: UserProfile | null = null;

  constructor() {
    this.loadProfile();
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  createProfile(email?: string, name?: string): UserProfile {
    const profile: UserProfile = {
      id: this.generateUserId(),
      email,
      name,
      createdAt: Date.now(),
      preferences: {
        interests: [],
        skills: [],
        budget: '',
        expertise: '',
        timeCommitment: '',
        riskTolerance: ''
      },
      favoriteIdeas: [],
      completedIdeas: [],
      feedback: {},
      learningProgress: {
        viewedResources: [],
        completedGuides: [],
        skillsImproved: []
      }
    };

    this.currentProfile = profile;
    this.saveProfile();
    return profile;
  }

  loadProfile(): UserProfile | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.currentProfile = JSON.parse(stored);
        return this.currentProfile;
      }
    } catch (error) {
      console.warn('Failed to load user profile:', error);
    }
    return null;
  }

  saveProfile(): void {
    if (this.currentProfile) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.currentProfile));
      } catch (error) {
        console.warn('Failed to save user profile:', error);
      }
    }
  }

  updatePreferences(preferences: Partial<UserProfile['preferences']>): void {
    if (this.currentProfile) {
      this.currentProfile.preferences = { ...this.currentProfile.preferences, ...preferences };
      this.saveProfile();
    }
  }

  addFavoriteIdea(ideaId: string): void {
    if (this.currentProfile && !this.currentProfile.favoriteIdeas.includes(ideaId)) {
      this.currentProfile.favoriteIdeas.push(ideaId);
      this.saveProfile();
    }
  }

  removeFavoriteIdea(ideaId: string): void {
    if (this.currentProfile) {
      this.currentProfile.favoriteIdeas = this.currentProfile.favoriteIdeas.filter(id => id !== ideaId);
      this.saveProfile();
    }
  }

  markIdeaCompleted(ideaId: string): void {
    if (this.currentProfile && !this.currentProfile.completedIdeas.includes(ideaId)) {
      this.currentProfile.completedIdeas.push(ideaId);
      this.saveProfile();
    }
  }

  rateidea(ideaId: string, rating: number): void {
    if (this.currentProfile) {
      this.currentProfile.feedback[ideaId] = rating;
      this.saveProfile();
    }
  }

  trackResourceViewed(resourceId: string): void {
    if (this.currentProfile && !this.currentProfile.learningProgress.viewedResources.includes(resourceId)) {
      this.currentProfile.learningProgress.viewedResources.push(resourceId);
      this.saveProfile();
    }
  }

  saveSession(currentStep: number, inputs: any, generatedIdeas: any[]): string {
    const session: SavedSession = {
      id: `session_${Date.now()}`,
      timestamp: Date.now(),
      currentStep,
      inputs,
      generatedIdeas
    };

    try {
      const existingSessions = this.getSavedSessions();
      const updatedSessions = [session, ...existingSessions.slice(0, 4)]; // Keep only 5 most recent
      localStorage.setItem(this.sessionKey, JSON.stringify(updatedSessions));
      return session.id;
    } catch (error) {
      console.warn('Failed to save session:', error);
      return '';
    }
  }

  getSavedSessions(): SavedSession[] {
    try {
      const stored = localStorage.getItem(this.sessionKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load saved sessions:', error);
      return [];
    }
  }

  loadSession(sessionId: string): SavedSession | null {
    const sessions = this.getSavedSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  getProfile(): UserProfile | null {
    return this.currentProfile;
  }

  getPersonalizedRecommendations(): string[] {
    if (!this.currentProfile) return [];
    
    const { interests, skills, expertise } = this.currentProfile.preferences;
    const recommendations: string[] = [];

    // Based on interests and skills
    if (interests.includes('Technology') && skills.includes('Programming')) {
      recommendations.push('Consider SaaS products in your interest areas');
    }
    
    if (interests.includes('Education') && skills.includes('Teaching')) {
      recommendations.push('Online course creation could be highly profitable for you');
    }

    if (expertise.includes('Serial entrepreneur')) {
      recommendations.push('You might want to explore higher-risk, higher-reward opportunities');
    }

    return recommendations;
  }
}

export const userProfileService = new UserProfileService();
export type { UserProfile, SavedSession };
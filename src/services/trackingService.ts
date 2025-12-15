interface ClickEvent {
  ideaId: string;
  ideaTitle: string;
  ideaCategory: string;
  timestamp: number;
  userAgent: string;
  sessionId: string;
  userLocation?: string;
  deviceType: string;
}

interface ClickStats {
  [ideaId: string]: {
    title: string;
    category: string;
    clicks: number;
    lastClicked: number;
    dailyClicks: { [date: string]: number };
    weeklyClicks: { [week: string]: number };
    monthlyClicks: { [month: string]: number };
  };
}

interface FavoriteEvent {
  ideaId: string;
  ideaTitle: string;
  ideaCategory: string;
  timestamp: number;
  action: 'add' | 'remove';
  sessionId: string;
}

interface TrendData {
  categories: { [category: string]: number };
  dailyTrends: { [date: string]: number };
  weeklyTrends: { [week: string]: number };
  monthlyTrends: { [month: string]: number };
}

interface UserDemographics {
  deviceTypes: { [type: string]: number };
  locations: { [location: string]: number };
  browsers: { [browser: string]: number };
  timeZones: { [zone: string]: number };
}

class TrackingService {
  private sessionId: string;
  private storageKey = 'business_idea_clicks';
  private favoritesKey = 'business_idea_favorites';
  private userLocation: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.detectUserLocation();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async detectUserLocation(): Promise<void> {
    try {
      // Try to get timezone-based location
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      this.userLocation = timeZone;
    } catch (error) {
      console.warn('Could not detect user location:', error);
    }
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|phone/i.test(userAgent)) {
      return 'Mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  }

  private getBrowser(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  trackIdeaClick(ideaId: string, ideaTitle: string, ideaCategory: string): void {
    const clickEvent: ClickEvent = {
      ideaId,
      ideaTitle,
      ideaCategory,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId,
      userLocation: this.userLocation || undefined,
      deviceType: this.getDeviceType()
    };

    // Store in localStorage for persistence
    this.storeClickEvent(clickEvent);

    // Send to analytics (you can replace this with your preferred analytics service)
    this.sendToAnalytics(clickEvent);

    console.log('Idea clicked:', {
      idea: ideaTitle,
      id: ideaId,
      category: ideaCategory,
      session: this.sessionId
    });
  }

  trackFavoriteAction(ideaId: string, ideaTitle: string, ideaCategory: string, action: 'add' | 'remove'): void {
    const favoriteEvent: FavoriteEvent = {
      ideaId,
      ideaTitle,
      ideaCategory,
      timestamp: Date.now(),
      action,
      sessionId: this.sessionId
    };

    this.storeFavoriteEvent(favoriteEvent);
  }

  private storeClickEvent(event: ClickEvent): void {
    try {
      const existingData = localStorage.getItem(this.storageKey);
      const clicks: ClickEvent[] = existingData ? JSON.parse(existingData) : [];
      
      clicks.push(event);
      
      // Keep only last 1000 clicks to prevent storage bloat
      if (clicks.length > 1000) {
        clicks.splice(0, clicks.length - 1000);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(clicks));
    } catch (error) {
      console.warn('Failed to store click event:', error);
    }
  }

  private storeFavoriteEvent(event: FavoriteEvent): void {
    try {
      const existingData = localStorage.getItem(this.favoritesKey);
      const favorites: FavoriteEvent[] = existingData ? JSON.parse(existingData) : [];
      
      favorites.push(event);
      
      // Keep only last 500 favorite events
      if (favorites.length > 500) {
        favorites.splice(0, favorites.length - 500);
      }
      
      localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to store favorite event:', error);
    }
  }

  private sendToAnalytics(event: ClickEvent): void {
    // Example: Send to Google Analytics, Mixpanel, or your custom analytics endpoint
    // Replace this with your actual analytics implementation
    
    // For demonstration, we'll use a mock analytics call
    if (typeof gtag !== 'undefined') {
      // Google Analytics 4 event
      gtag('event', 'business_idea_click', {
        idea_id: event.ideaId,
        idea_title: event.ideaTitle,
        idea_category: event.ideaCategory,
        session_id: event.sessionId,
        device_type: event.deviceType
      });
    }

    // Example: Custom analytics endpoint
    // fetch('/api/analytics/track', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // }).catch(console.warn);
  }

  private formatDate(timestamp: number): string {
    return new Date(timestamp).toISOString().split('T')[0];
  }

  private formatWeek(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const week = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  private formatMonth(timestamp: number): string {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  getClickStats(): ClickStats {
    try {
      const existingData = localStorage.getItem(this.storageKey);
      const clicks: ClickEvent[] = existingData ? JSON.parse(existingData) : [];
      
      const stats: ClickStats = {};
      
      clicks.forEach(click => {
        if (!stats[click.ideaId]) {
          stats[click.ideaId] = {
            title: click.ideaTitle,
            category: click.ideaCategory || 'Unknown',
            clicks: 0,
            lastClicked: 0,
            dailyClicks: {},
            weeklyClicks: {},
            monthlyClicks: {}
          };
        }
        
        stats[click.ideaId].clicks++;
        stats[click.ideaId].lastClicked = Math.max(
          stats[click.ideaId].lastClicked,
          click.timestamp
        );

        // Track daily, weekly, monthly clicks
        const date = this.formatDate(click.timestamp);
        const week = this.formatWeek(click.timestamp);
        const month = this.formatMonth(click.timestamp);

        stats[click.ideaId].dailyClicks[date] = (stats[click.ideaId].dailyClicks[date] || 0) + 1;
        stats[click.ideaId].weeklyClicks[week] = (stats[click.ideaId].weeklyClicks[week] || 0) + 1;
        stats[click.ideaId].monthlyClicks[month] = (stats[click.ideaId].monthlyClicks[month] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.warn('Failed to get click stats:', error);
      return {};
    }
  }

  getFavoriteStats(): { [ideaId: string]: { title: string; category: string; favorites: number; lastFavorited: number } } {
    try {
      const existingData = localStorage.getItem(this.favoritesKey);
      const favorites: FavoriteEvent[] = existingData ? JSON.parse(existingData) : [];
      
      const stats: { [ideaId: string]: { title: string; category: string; favorites: number; lastFavorited: number } } = {};
      
      favorites.forEach(fav => {
        if (!stats[fav.ideaId]) {
          stats[fav.ideaId] = {
            title: fav.ideaTitle,
            category: fav.ideaCategory,
            favorites: 0,
            lastFavorited: 0
          };
        }
        
        if (fav.action === 'add') {
          stats[fav.ideaId].favorites++;
          stats[fav.ideaId].lastFavorited = Math.max(stats[fav.ideaId].lastFavorited, fav.timestamp);
        } else if (fav.action === 'remove') {
          stats[fav.ideaId].favorites = Math.max(0, stats[fav.ideaId].favorites - 1);
        }
      });
      
      return stats;
    } catch (error) {
      console.warn('Failed to get favorite stats:', error);
      return {};
    }
  }

  getTrendData(): TrendData {
    try {
      const existingData = localStorage.getItem(this.storageKey);
      const clicks: ClickEvent[] = existingData ? JSON.parse(existingData) : [];
      
      const trends: TrendData = {
        categories: {},
        dailyTrends: {},
        weeklyTrends: {},
        monthlyTrends: {}
      };
      
      clicks.forEach(click => {
        // Category trends
        const category = click.ideaCategory || 'Unknown';
        trends.categories[category] = (trends.categories[category] || 0) + 1;
        
        // Time-based trends
        const date = this.formatDate(click.timestamp);
        const week = this.formatWeek(click.timestamp);
        const month = this.formatMonth(click.timestamp);
        
        trends.dailyTrends[date] = (trends.dailyTrends[date] || 0) + 1;
        trends.weeklyTrends[week] = (trends.weeklyTrends[week] || 0) + 1;
        trends.monthlyTrends[month] = (trends.monthlyTrends[month] || 0) + 1;
      });
      
      return trends;
    } catch (error) {
      console.warn('Failed to get trend data:', error);
      return { categories: {}, dailyTrends: {}, weeklyTrends: {}, monthlyTrends: {} };
    }
  }

  getUserDemographics(): UserDemographics {
    try {
      const existingData = localStorage.getItem(this.storageKey);
      const clicks: ClickEvent[] = existingData ? JSON.parse(existingData) : [];
      
      const demographics: UserDemographics = {
        deviceTypes: {},
        locations: {},
        browsers: {},
        timeZones: {}
      };
      
      clicks.forEach(click => {
        // Device types
        const deviceType = click.deviceType || this.getDeviceType();
        demographics.deviceTypes[deviceType] = (demographics.deviceTypes[deviceType] || 0) + 1;
        
        // Locations (timezone-based)
        if (click.userLocation) {
          demographics.locations[click.userLocation] = (demographics.locations[click.userLocation] || 0) + 1;
        }
        
        // Browsers
        const browser = this.getBrowser();
        demographics.browsers[browser] = (demographics.browsers[browser] || 0) + 1;
        
        // Time zones
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        demographics.timeZones[timeZone] = (demographics.timeZones[timeZone] || 0) + 1;
      });
      
      return demographics;
    } catch (error) {
      console.warn('Failed to get user demographics:', error);
      return { deviceTypes: {}, locations: {}, browsers: {}, timeZones: {} };
    }
  }

  getTotalClicks(): number {
    const stats = this.getClickStats();
    return Object.values(stats).reduce((total, stat) => total + stat.clicks, 0);
  }

  getMostPopularIdeas(limit: number = 5): Array<{id: string, title: string, clicks: number}> {
    const stats = this.getClickStats();
    return Object.entries(stats)
      .map(([id, stat]) => ({ id, title: stat.title, clicks: stat.clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, limit);
  }

  getMostFavoritedIdeas(limit: number = 5): Array<{id: string, title: string, favorites: number}> {
    const stats = this.getFavoriteStats();
    return Object.entries(stats)
      .map(([id, stat]) => ({ id, title: stat.title, favorites: stat.favorites }))
      .sort((a, b) => b.favorites - a.favorites)
      .slice(0, limit);
  }

  exportClickData(): string {
    try {
      const existingData = localStorage.getItem(this.storageKey);
      const clicks: ClickEvent[] = existingData ? JSON.parse(existingData) : [];
      
      // Convert to CSV format
      const headers = ['Idea ID', 'Idea Title', 'Category', 'Timestamp', 'Date', 'Session ID', 'Device Type', 'Location'];
      const csvRows = [headers.join(',')];
      
      clicks.forEach(click => {
        const row = [
          click.ideaId,
          `"${click.ideaTitle.replace(/"/g, '""')}"`, // Escape quotes in CSV
          click.ideaCategory || 'Unknown',
          click.timestamp,
          new Date(click.timestamp).toISOString(),
          click.sessionId,
          click.deviceType || 'Unknown',
          click.userLocation || 'Unknown'
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    } catch (error) {
      console.warn('Failed to export click data:', error);
      return '';
    }
  }
}

export const trackingService = new TrackingService();
export type { ClickStats, TrendData, UserDemographics };
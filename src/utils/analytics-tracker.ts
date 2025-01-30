interface UserInteraction {
  category: string;
  action: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

interface UserDimensions {
  userType?: string;
  serviceCategory?: string;
  region?: string;
}

class AnalyticsTracker {
  private static instance: AnalyticsTracker;
  private dimensions: UserDimensions = {};
  private sessionStartTime: number;
  private maxScrollDepth: number = 0;
  private initialized: boolean = false;

  private constructor() {
    this.sessionStartTime = Date.now();
    if (typeof window !== 'undefined') {
      this.initializeTracking();
    }
  }

  public static getInstance(): AnalyticsTracker {
    if (!AnalyticsTracker.instance) {
      AnalyticsTracker.instance = new AnalyticsTracker();
    }
    return AnalyticsTracker.instance;
  }

  private initializeTracking(): void {
    if (this.initialized) return;
    
    // Track scroll depth
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Track time spent on page
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // Track form interactions
    document.addEventListener('submit', this.handleFormSubmit.bind(this));
    
    // Track outbound links
    document.addEventListener('click', this.handleLinkClick.bind(this));

    this.initialized = true;
  }

  private handleScroll(): void {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollPercent = Math.round((scrollTop + winHeight) / docHeight * 100);

    if (scrollPercent > this.maxScrollDepth) {
      this.maxScrollDepth = scrollPercent;
      this.trackEvent({
        category: 'Engagement',
        action: 'scroll_depth',
        label: `${this.maxScrollDepth}%`,
        value: this.maxScrollDepth
      });
    }
  }

  private handleBeforeUnload(): void {
    const timeSpent = Math.round((Date.now() - this.sessionStartTime) / 1000);
    this.trackEvent({
      category: 'Engagement',
      action: 'time_on_page',
      value: timeSpent,
      nonInteraction: true
    });
  }

  private handleFormSubmit(event: Event): void {
    const form = event.target as HTMLFormElement;
    this.trackEvent({
      category: 'Conversion',
      action: 'form_submission',
      label: form.id || form.action
    });
  }

  private handleLinkClick(event: MouseEvent): void {
    const target = event.target as HTMLAnchorElement;
    if (target.tagName === 'A' && target.href) {
      // Track outbound links
      if (target.hostname !== window.location.hostname) {
        this.trackEvent({
          category: 'Outbound Link',
          action: 'click',
          label: target.href
        });
      }
      
      // Track phone number clicks
      if (target.href.startsWith('tel:')) {
        this.trackEvent({
          category: 'Contact',
          action: 'phone_click',
          label: target.href.replace('tel:', '')
        });
      }
    }
  }

  public setDimensions(dimensions: UserDimensions): void {
    this.dimensions = { ...this.dimensions, ...dimensions };
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('set', 'user_properties', {
        user_type: dimensions.userType,
        service_category: dimensions.serviceCategory,
        region: dimensions.region
      });
    }
  }

  public trackEvent(interaction: UserInteraction): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', interaction.action, {
        event_category: interaction.category,
        event_label: interaction.label,
        value: interaction.value,
        non_interaction: interaction.nonInteraction,
        // Include custom dimensions
        ...(this.dimensions.userType && { dimension1: this.dimensions.userType }),
        ...(this.dimensions.serviceCategory && { dimension2: this.dimensions.serviceCategory }),
        ...(this.dimensions.region && { dimension3: this.dimensions.region })
      });
    }
  }

  public trackPageView(path: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  public trackSearch(query: string, resultsCount: number): void {
    this.trackEvent({
      category: 'Search',
      action: 'perform_search',
      label: query,
      value: resultsCount
    });
  }

  public trackError(error: Error, componentStack?: string): void {
    this.trackEvent({
      category: 'Error',
      action: 'javascript_error',
      label: error.message,
      nonInteraction: true
    });
  }

  public trackNavigation(from: string, to: string): void {
    this.trackEvent({
      category: 'Navigation',
      action: 'route_change',
      label: `${from} -> ${to}`
    });
  }
}

export const analyticsTracker = AnalyticsTracker.getInstance();

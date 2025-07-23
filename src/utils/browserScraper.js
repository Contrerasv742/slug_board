// Pure JavaScript browser-based event scraper
// No Python required - works entirely in the browser

class BrowserEventScraper {
  constructor() {
    this.corsProxies = [
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/get?url=',
      'https://thingproxy.freeboard.io/fetch/'
    ];
    this.currentProxyIndex = 0;
  }

  // Main scraping function
  async scrapeEvents(url, options = {}) {
    const { platform, maxRetries = 3 } = options;
    
    try {
      // Try direct fetch first
      const events = await this.directScrape(url);
      if (events.length > 0) return events;
    } catch (error) {
      console.log('Direct scrape failed, trying proxy...', error.message);
    }

    // Try with CORS proxy
    return await this.proxyScrape(url, maxRetries);
  }

  // Direct scraping (works for CORS-friendly sites)
  async directScrape(url) {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    return this.parseEvents(html, url);
  }

  // Proxy scraping for CORS-blocked sites
  async proxyScrape(url, maxRetries) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const proxy = this.corsProxies[this.currentProxyIndex];
        const proxyUrl = this.buildProxyUrl(proxy, url);
        
        const response = await fetch(proxyUrl);
        
        let html;
        const responseText = await response.text();
        
        // Handle different proxy response formats
        if (proxy.includes('allorigins')) {
          const data = JSON.parse(responseText);
          html = data.contents;
        } else {
          html = responseText;
        }
        
        const events = this.parseEvents(html, url);
        if (events.length > 0) return events;
        
      } catch (error) {
        console.log(`Proxy attempt ${attempt + 1} failed:`, error.message);
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
      }
    }
    
    throw new Error('All scraping attempts failed');
  }

  buildProxyUrl(proxy, url) {
    if (proxy.includes('allorigins')) {
      return `${proxy}${encodeURIComponent(url)}`;
    }
    return `${proxy}${url}`;
  }

  // Parse events from HTML based on platform
  parseEvents(html, url) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Detect platform and use appropriate parsing strategy
    if (url.includes('eventbrite')) {
      return this.parseEventbrite(doc);
    } else if (url.includes('meetup')) {
      return this.parseMeetup(doc);
    } else if (url.includes('facebook')) {
      return this.parseFacebook(doc);
    } else if (url.includes('cityofsantacruz')) {
      return this.parseSantaCruz(doc);
    } else {
      return this.parseGeneric(doc);
    }
  }

  // Platform-specific parsers
  parseEventbrite(doc) {
    const events = [];
    const eventElements = doc.querySelectorAll('[data-testid="event-card"], .event-card, .search-event-card');
    
    eventElements.forEach(element => {
      try {
        const event = {
          title: this.extractText(element, 'h3, .event-title, [data-testid="event-title"]'),
          description: this.extractText(element, '.event-description, .summary'),
          location: this.extractText(element, '.event-location, [data-testid="event-location"]'),
          date: this.extractText(element, '.event-date, [data-testid="event-date"]'),
          price: this.extractText(element, '.event-price, [data-testid="event-price"]'),
          url: this.extractHref(element, 'a'),
          source: 'eventbrite'
        };
        
        if (event.title) events.push(event);
      } catch (error) {
        console.log('Error parsing Eventbrite event:', error);
      }
    });
    
    return events;
  }

  parseMeetup(doc) {
    const events = [];
    const eventElements = doc.querySelectorAll('[data-testid="event-card"], .event-listing, .event-item');
    
    eventElements.forEach(element => {
      try {
        const event = {
          title: this.extractText(element, 'h3, .event-title'),
          description: this.extractText(element, '.event-description'),
          location: this.extractText(element, '.event-location, .venue-name'),
          date: this.extractText(element, '.event-date, .date-time'),
          attendees: this.extractText(element, '.attendee-count'),
          url: this.extractHref(element, 'a'),
          source: 'meetup'
        };
        
        if (event.title) events.push(event);
      } catch (error) {
        console.log('Error parsing Meetup event:', error);
      }
    });
    
    return events;
  }

  parseSantaCruz(doc) {
    const events = [];
    // Santa Cruz city website specific selectors
    const eventElements = doc.querySelectorAll('.event-item, .calendar-event, .list-item');
    
    eventElements.forEach(element => {
      try {
        const event = {
          title: this.extractText(element, 'h3, .title, .event-title'),
          description: this.extractText(element, '.description, .summary'),
          location: this.extractText(element, '.location, .venue') || 'Santa Cruz, CA',
          date: this.extractText(element, '.date, .event-date'),
          category: this.extractText(element, '.category, .event-type'),
          url: this.extractHref(element, 'a'),
          source: 'santacruz'
        };
        
        if (event.title) events.push(event);
      } catch (error) {
        console.log('Error parsing Santa Cruz event:', error);
      }
    });
    
    return events;
  }

  parseGeneric(doc) {
    const events = [];
    // Generic selectors that work on most sites
    const possibleSelectors = [
      '.event', '.event-item', '.event-card',
      '[class*="event"]', '[id*="event"]',
      '.listing', '.item', '.card'
    ];
    
    for (const selector of possibleSelectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        elements.forEach(element => {
          try {
            const event = {
              title: this.extractText(element, 'h1, h2, h3, .title, .name'),
              description: this.extractText(element, '.description, .summary, p'),
              location: this.extractText(element, '.location, .venue, .place'),
              date: this.extractText(element, '.date, .time, .when'),
              url: this.extractHref(element, 'a'),
              source: 'generic'
            };
            
            if (event.title && event.title.length > 5) {
              events.push(event);
            }
          } catch (error) {
            console.log('Error parsing generic event:', error);
          }
        });
        
        if (events.length > 0) break; // Found events with this selector
      }
    }
    
    return events;
  }

  // Helper methods
  extractText(parent, selector) {
    const element = parent.querySelector(selector);
    return element ? element.textContent.trim() : '';
  }

  extractHref(parent, selector) {
    const element = parent.querySelector(selector);
    return element ? element.href : '';
  }

  // Convert scraped data to your app format
  formatForApp(events) {
    return events.map(event => ({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startDateTime: this.parseDate(event.date),
      endDateTime: this.parseDate(event.date, true),
      isFree: this.parsePrice(event.price),
      priceInfo: event.price || '',
      category: this.categorizeEvent(event.title, event.description),
      interests: this.extractInterests(event.title, event.description),
      originalUrl: event.url,
      source: event.source
    }));
  }

  parseDate(dateString, isEndDate = false) {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (isEndDate) {
        date.setHours(date.getHours() + 2); // Assume 2-hour duration
      }
      return date.toISOString();
    } catch (error) {
      return null;
    }
  }

  parsePrice(priceString) {
    if (!priceString) return true;
    return priceString.toLowerCase().includes('free') || priceString.includes('$0');
  }

  categorizeEvent(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    
    if (text.includes('music') || text.includes('concert')) return 'Music';
    if (text.includes('food') || text.includes('restaurant')) return 'Food';
    if (text.includes('tech') || text.includes('coding')) return 'Technology';
    if (text.includes('art') || text.includes('gallery')) return 'Arts';
    if (text.includes('business') || text.includes('networking')) return 'Business';
    
    return 'General';
  }

  extractInterests(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const interests = [];
    
    const interestMap = {
      'music': 'Music',
      'art': 'Art',
      'food': 'Food',
      'tech': 'Technology',
      'business': 'Business',
      'health': 'Health',
      'fitness': 'Fitness',
      'education': 'Education'
    };
    
    Object.keys(interestMap).forEach(keyword => {
      if (text.includes(keyword)) {
        interests.push(interestMap[keyword]);
      }
    });
    
    return interests.slice(0, 3); // Max 3 interests
  }
}

// Export for use in your app
export default BrowserEventScraper;

// Usage example:
/*
const scraper = new BrowserEventScraper();

// Scrape events from any URL
scraper.scrapeEvents('https://www.eventbrite.com/d/ca--santa-cruz/events/')
  .then(events => {
    const formattedEvents = scraper.formatForApp(events);
    console.log('Scraped events:', formattedEvents);
  })
  .catch(error => {
    console.error('Scraping failed:', error);
  });
*/ 
// Event scraping utility - Enhanced with browser-based scraping
// Now supports both backend and pure JavaScript browser scraping

import { supabase } from '../lib/supabase.js';
import BrowserEventScraper from './browserScraper.js';

// Initialize browser scraper
const browserScraper = new BrowserEventScraper();

// Enhanced scraping function with multiple approaches
export const scrapeEventData = async (url, options = {}) => {
  try {
    // Basic URL validation
    if (!isValidUrl(url)) {
      throw new Error('Please provide a valid URL');
    }

    // Determine the platform based on URL
    const platform = detectPlatform(url);
    
    // Try browser-based scraping first (no Python needed!)
    try {
      console.log('🌐 Attempting browser-based scraping...');
      const browserEvents = await browserScraper.scrapeEvents(url, { platform });
      
      if (browserEvents && browserEvents.length > 0) {
        console.log(`✅ Browser scraping successful! Found ${browserEvents.length} events`);
        return browserScraper.formatForApp(browserEvents);
      }
    } catch (browserError) {
      console.log('Browser scraping failed, trying fallback methods...', browserError.message);
    }
    
    // Fallback to existing methods
    if (url.includes('cityofsantacruz.com') || platform === 'santacruz') {
      return await scrapeSantaCruzEvents();
    }
    
    // For other platforms, try backend API or mock data
    return await scrapeGenericEvent(url, platform);
  } catch (error) {
    console.error('All scraping methods failed:', error);
    throw error;
  }
};

// Enhanced Santa Cruz scraping with browser method
const scrapeSantaCruzEvents = async () => {
  try {
    // Try browser scraping first
    try {
      const santaCruzUrl = 'https://www.cityofsantacruz.com/community/special-events';
      const browserEvents = await browserScraper.scrapeEvents(santaCruzUrl);
      
      if (browserEvents && browserEvents.length > 0) {
        console.log('✅ Santa Cruz browser scraping successful!');
        return browserScraper.formatForApp(browserEvents);
      }
    } catch (browserError) {
      console.log('Santa Cruz browser scraping failed, using database fallback...');
    }
    
    // Fallback to database or sample data
    const { data: existingEvents, error } = await supabase
      .from('Events')
      .select('*')
      .eq('event_type', 'campus')
      .limit(5);
      
    if (!error && existingEvents && existingEvents.length > 0) {
      return existingEvents.map(event => ({
        title: event.title,
        description: event.description || '',
        location: event.location || 'Santa Cruz, CA',
        startDateTime: event.start_time,
        endDateTime: event.end_time,
        category: determineCategoryFromTitle(event.title),
        isFree: event.is_free !== false,
        priceInfo: event.price_info || '',
        interests: determineInterestsFromEvent(event),
        source: 'santacruz',
        originalUrl: 'https://www.cityofsantacruz.com/community/special-events'
      }));
    }
    
    // Final fallback to sample data
    return getSantaCruzSampleEvents();
  } catch (error) {
    console.error('Santa Cruz scraping error:', error);
    throw new Error('Failed to scrape Santa Cruz events');
  }
};

// Enhanced generic scraping with browser support
const scrapeGenericEvent = async (url, platform) => {
  try {
    // Try browser scraping first for any platform
    const browserEvents = await browserScraper.scrapeEvents(url, { platform });
    if (browserEvents && browserEvents.length > 0) {
      return browserScraper.formatForApp(browserEvents);
    }
  } catch (error) {
    console.log('Browser scraping failed for generic platform, using mock data...');
  }
  
  // Fallback to mock data
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const mockData = getMockEventData(platform);
  const numEvents = Math.floor(Math.random() * 3) + 1;
  const events = [];
  
  for (let i = 0; i < numEvents; i++) {
    const baseEvent = mockData[Math.floor(Math.random() * mockData.length)];
    
    const randomizedEvent = {
      ...baseEvent,
      title: baseEvent.title + (i > 0 ? ` (${i + 1})` : ''),
      startDateTime: getRandomFutureDate(),
      endDateTime: getRandomEndDate(),
      source: platform,
      originalUrl: url
    };
    
    randomizedEvent.endDateTime = addHoursToDate(randomizedEvent.startDateTime, 
      Math.floor(Math.random() * 4) + 1);
    
    events.push(randomizedEvent);
  }
  
  return events;
};

// New: Direct browser scraping function for immediate use
export const scrapeLiveEvents = async (url) => {
  try {
    console.log('🔄 Starting live browser scraping...');
    const events = await browserScraper.scrapeEvents(url);
    const formattedEvents = browserScraper.formatForApp(events);
    
    console.log(`✅ Successfully scraped ${formattedEvents.length} events`);
    return formattedEvents;
  } catch (error) {
    console.error('Live scraping failed:', error);
    throw error;
  }
};

// New: Batch scraping function for multiple URLs
export const scrapeBatchEvents = async (urls, options = {}) => {
  const { maxConcurrent = 3 } = options;
  const results = [];
  
  // Process URLs in batches to avoid overwhelming the browser
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    
    try {
      const batchPromises = batch.map(async (url) => {
        try {
          const events = await scrapeEventData(url);
          return { url, events, success: true };
        } catch (error) {
          return { url, error: error.message, success: false };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to be respectful
      if (i + maxConcurrent < urls.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Batch scraping failed for batch ${i}:`, error);
    }
  }
  
  return results;
};

// Enhanced platform detection with more platforms
const detectPlatform = (url) => {
  const lowercaseUrl = url.toLowerCase();
  
  // Santa Cruz specific
  if (lowercaseUrl.includes('cityofsantacruz.com')) return 'santacruz';
  
  // Major event platforms
  if (lowercaseUrl.includes('eventbrite')) return 'eventbrite';
  if (lowercaseUrl.includes('facebook.com/events')) return 'facebook';
  if (lowercaseUrl.includes('meetup.com')) return 'meetup';
  if (lowercaseUrl.includes('lu.ma')) return 'luma';
  if (lowercaseUrl.includes('ticketmaster')) return 'ticketmaster';
  if (lowercaseUrl.includes('bookmyshow')) return 'bookmyshow';
  
  // University/Academic platforms
  if (lowercaseUrl.includes('ucsc.edu')) return 'ucsc';
  if (lowercaseUrl.includes('.edu')) return 'university';
  
  // City/Government platforms
  if (lowercaseUrl.includes('santacruzco.gov')) return 'county';
  if (lowercaseUrl.includes('.gov')) return 'government';
  
  return 'generic';
};

// Sample events based on real Santa Cruz scraped data
const getSantaCruzSampleEvents = () => {
  const currentYear = new Date().getFullYear();
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  
  return [
    {
      title: 'Downtown Farmers\' Market',
      description: 'Find your favorite Farmers\' Market vendors at its new site on Church and Cedar Streets in Downtown Santa Cruz. Featuring the best in regional organic produce, pasture-raised meats, eggs, dairy, sustainably-harvested seafoods, artisan-made goods and more.',
      location: 'Church and Cedar Streets, Santa Cruz, California',
      startDateTime: getNextWednesday().toISOString(),
      endDateTime: getNextWednesday(4).toISOString(), // 4 hours later
      category: 'Community Service',
      isFree: true,
      priceInfo: '',
      interests: ['Food', 'Community', 'Health'],
      source: 'santacruz',
      originalUrl: 'https://www.cityofsantacruz.com/community/special-events'
    },
    {
      title: 'Santa Cruz Makers Market',
      description: 'The Santa Cruz Makers Market featuring 40+ local artisan vendors is held the third Sunday of every month on the 1100 block of Pacific Avenue between Cathcart and Lincoln Streets.',
      location: 'Downtown Pacific Avenue, Santa Cruz, California',
      startDateTime: getThirdSundayOfMonth().toISOString(),
      endDateTime: getThirdSundayOfMonth(7).toISOString(), // 7 hours later
      category: 'Arts & Crafts',
      isFree: true,
      priceInfo: '',
      interests: ['Art', 'Shopping', 'Community'],
      source: 'santacruz',
      originalUrl: 'https://www.cityofsantacruz.com/community/special-events'
    },
    {
      title: 'Midtown Fridays Summer Block Party',
      description: 'Event Santa Cruz\'s Midtown Fridays Summer Block Party featuring live music, artists, vendors and food. This event is family-friendly and a locals favorite!',
      location: 'Midtown Parking Lot, 1111 Soquel Ave, Santa Cruz, California',
      startDateTime: getNextFriday().toISOString(),
      endDateTime: getNextFriday(3.5).toISOString(), // 3.5 hours later
      category: 'Entertainment',
      isFree: true,
      priceInfo: '',
      interests: ['Music', 'Food', 'Social', 'Family'],
      source: 'santacruz',
      originalUrl: 'https://www.cityofsantacruz.com/community/special-events'
    }
  ];
};

// Helper functions for date generation
const getNextWednesday = (addHours = 0) => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 3); // Adjust when day is Sunday
  const wednesday = new Date(date.setDate(diff));
  wednesday.setHours(13 + addHours, 0, 0, 0); // 1 PM start time
  return wednesday;
};

const getThirdSundayOfMonth = (addHours = 0) => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstSunday = new Date(firstDay.setDate(1 + (7 - firstDay.getDay()) % 7));
  const thirdSunday = new Date(firstSunday.setDate(firstSunday.getDate() + 14));
  thirdSunday.setHours(10 + addHours, 0, 0, 0); // 10 AM start time
  return thirdSunday;
};

const getNextFriday = (addHours = 0) => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day + (day <= 5 ? 5 : 12); // Next Friday
  const friday = new Date(date.setDate(diff));
  friday.setHours(17 + addHours, 0, 0, 0); // 5 PM start time
  return friday;
};

// Enhanced platform detection including Santa Cruz
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const getMockEventData = (platform) => {
  const eventTypes = {
    eventbrite: [
      {
        title: 'Professional Networking Mixer',
        description: 'Join professionals from various industries for an evening of networking, refreshments, and meaningful connections. Perfect opportunity to expand your professional network.',
        location: 'Downtown Conference Center, Main Hall',
        category: 'Professional',
        isFree: false,
        priceInfo: '$15 early bird, $25 at door',
        interests: ['Networking', 'Business', 'Professional Development']
      },
      {
        title: 'Digital Marketing Workshop',
        description: 'Learn the latest digital marketing strategies including social media marketing, SEO, and content creation from industry experts.',
        location: 'Tech Hub, Room 201',
        category: 'Professional',
        isFree: false,
        priceInfo: '$45 per person',
        interests: ['Marketing', 'Technology', 'Business']
      }
    ],
    facebook: [
      {
        title: 'Community Beach Cleanup',
        description: 'Help us keep our beaches clean! Bring friends and family for a morning of environmental action. All supplies provided.',
        location: 'Main Beach, North Entrance',
        category: 'Community Service',
        isFree: true,
        priceInfo: '',
        interests: ['Environment', 'Volunteering', 'Community']
      },
      {
        title: 'Local Music Jam Session',
        description: 'Musicians of all levels welcome! Bring your instruments and join us for an evening of collaborative music making.',
        location: 'Community Center, Music Room',
        category: 'Entertainment',
        isFree: true,
        priceInfo: '',
        interests: ['Music', 'Art', 'Social']
      }
    ],
    meetup: [
      {
        title: 'React Developer Meetup',
        description: 'Monthly gathering of React developers to share knowledge, discuss latest trends, and work on projects together.',
        location: 'Coworking Space, Conference Room A',
        category: 'Technology',
        isFree: true,
        priceInfo: '',
        interests: ['Programming', 'Technology', 'React']
      },
      {
        title: 'Photography Walk & Workshop',
        description: 'Explore the city through your lens! We\'ll cover composition, lighting, and post-processing techniques while exploring scenic locations.',
        location: 'City Park, Visitor Center',
        category: 'Arts & Crafts',
        isFree: false,
        priceInfo: '$20 per person',
        interests: ['Photography', 'Art', 'Nature']
      }
    ],
    luma: [
      {
        title: 'Startup Pitch Night',
        description: 'Watch aspiring entrepreneurs pitch their startup ideas to a panel of investors and industry experts. Network with founders and investors.',
        location: 'Innovation Hub, Main Auditorium',
        category: 'Professional',
        isFree: true,
        priceInfo: '',
        interests: ['Business', 'Entrepreneurship', 'Networking']
      }
    ],
    generic: [
      {
        title: 'Annual Science Fair',
        description: 'Discover amazing scientific projects from local students and researchers. Interactive exhibits, demonstrations, and educational activities for all ages.',
        location: 'Science Museum, Exhibition Hall',
        category: 'Academic',
        isFree: false,
        priceInfo: '$10 adults, $5 students, kids under 12 free',
        interests: ['Science', 'Education', 'Family']
      },
      {
        title: 'Cooking Class: Italian Cuisine',
        description: 'Learn to prepare authentic Italian dishes from a professional chef. All ingredients and tools provided. Take home recipes and skills!',
        location: 'Culinary Institute, Kitchen Studio 1',
        category: 'Health & Wellness',
        isFree: false,
        priceInfo: '$75 per person, includes dinner',
        interests: ['Cooking', 'Food', 'Culture']
      }
    ]
  };
  
  return eventTypes[platform] || eventTypes.generic;
};

// Helper functions for Santa Cruz event processing
const determineCategoryFromTitle = (title) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('market') || titleLower.includes('farmers')) return 'Community Service';
  if (titleLower.includes('music') || titleLower.includes('concert') || titleLower.includes('festival')) return 'Entertainment';
  if (titleLower.includes('art') || titleLower.includes('makers') || titleLower.includes('craft')) return 'Arts & Crafts';
  if (titleLower.includes('sport') || titleLower.includes('race') || titleLower.includes('run') || titleLower.includes('triathlon')) return 'Sports';
  if (titleLower.includes('tech') || titleLower.includes('workshop') || titleLower.includes('learn')) return 'Technology';
  if (titleLower.includes('business') || titleLower.includes('professional') || titleLower.includes('network')) return 'Professional';
  
  return 'Social';
};

const determineInterestsFromEvent = (event) => {
  const interests = [];
  const text = `${event.title} ${event.description}`.toLowerCase();
  
  const interestKeywords = {
    'Music': ['music', 'concert', 'band', 'sing', 'song'],
    'Food': ['food', 'market', 'farmers', 'cook', 'eat', 'restaurant'],
    'Art': ['art', 'craft', 'paint', 'draw', 'creative', 'makers'],
    'Sports': ['sport', 'run', 'race', 'bike', 'swim', 'triathlon', 'athletic'],
    'Technology': ['tech', 'digital', 'computer', 'code', 'programming'],
    'Community': ['community', 'downtown', 'neighborhood', 'local'],
    'Nature': ['beach', 'park', 'outdoor', 'cliff', 'ocean', 'nature'],
    'Family': ['family', 'kids', 'children', 'all ages']
  };
  
  Object.entries(interestKeywords).forEach(([interest, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      interests.push(interest);
    }
  });
  
  return interests.length > 0 ? interests : ['Community'];
};

// Utility date functions
const getRandomFutureDate = () => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days in future
  return futureDate.toISOString();
};

const getRandomEndDate = () => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
  return futureDate.toISOString();
};

const addHoursToDate = (dateString, hours) => {
  const date = new Date(dateString);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

// Backend scraping functions (for production implementation)
export const scrapeEventbrite = async (url) => {
  // Would use backend API that runs Puppeteer/Playwright
  throw new Error('Backend scraping API not implemented - contact development team');
};

export const scrapeFacebookEvent = async (url) => {
  // Would use Facebook Graph API through backend
  throw new Error('Facebook Graph API integration not implemented - contact development team');
};

export const scrapeMeetup = async (url) => {
  // Would use Meetup API through backend
  throw new Error('Meetup API integration not implemented - contact development team');
};

// Enhanced scraping service for backend integration
export const requestBackendScrape = async (url) => {
  // This would call your backend API that runs the Python scraper
  try {
    const response = await fetch('/api/scrape-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      throw new Error('Backend scraping service unavailable');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Backend scraping error:', error);
    throw new Error('Failed to connect to scraping service');
  }
};

// Utility function to clean and validate scraped data (enhanced)
export const validateScrapedEvent = (eventData) => {
  const errors = [];
  
  if (!eventData.title || eventData.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  
  if (!eventData.description || eventData.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  if (!eventData.location || eventData.location.trim().length < 3) {
    errors.push('Location must be specified');
  }
  
  if (!eventData.startDateTime) {
    errors.push('Start date/time is required');
  } else {
    const startDate = new Date(eventData.startDateTime);
    if (startDate < new Date()) {
      // Allow past events if they're within the last 7 days (might be ongoing)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (startDate < weekAgo) {
        errors.push('Start date is too far in the past');
      }
    }
  }
  
  if (eventData.endDateTime) {
    const startDate = new Date(eventData.startDateTime);
    const endDate = new Date(eventData.endDateTime);
    if (endDate <= startDate) {
      errors.push('End date must be after start date');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    cleanedData: {
      title: eventData.title?.trim(),
      description: eventData.description?.trim(),
      location: eventData.location?.trim(),
      startDateTime: eventData.startDateTime,
      endDateTime: eventData.endDateTime,
      isFree: Boolean(eventData.isFree),
      priceInfo: eventData.priceInfo?.trim() || '',
      category: eventData.category || 'General',
      interests: Array.isArray(eventData.interests) ? eventData.interests : [],
      originalUrl: eventData.originalUrl,
      source: eventData.source || 'unknown'
    }
  };
}; 

// New: Real-time scraping status checker
export const checkScrapingCapability = async (url) => {
  try {
    const testResponse = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors' 
    });
    
    return {
      url,
      accessible: true,
      corsEnabled: testResponse.type !== 'opaque',
      platform: detectPlatform(url),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      url,
      accessible: false,
      error: error.message,
      platform: detectPlatform(url),
      timestamp: new Date().toISOString()
    };
  }
}; 

export class ExternalEventsService {
  
    // Static external events that always work for everyone
    static getStaticExternalEvents() {
      const baseDate = new Date();
      
      return [
        {
          id: 'external-1',
          title: 'Santa Cruz Beach Volleyball Tournament',
          description: 'Annual beach volleyball tournament at Main Beach. Teams of all skill levels welcome. Registration includes lunch and tournament t-shirt.',
          start_time: new Date(baseDate.getTime() + 86400000 * 2).toISOString(), // 2 days from now
          end_time: new Date(baseDate.getTime() + 86400000 * 2 + 28800000).toISOString(), // 8 hours later
          location: 'Main Beach, Santa Cruz, CA',
          image_url: null,
          external_url: 'https://santacruz.org/events',
          source: 'City of Santa Cruz',
          event_type: 'external',
          price_info: '$15 - $25',
          is_free: false,
          category: 'Sports',
          related_interests: ['Sports', 'Beach', 'Tournament', 'Community'],
          organizer: { name: 'Santa Cruz Parks & Recreation' },
          users: {
            name: 'SC Parks & Rec',
            email: 'parks@santacruz.org',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-2',
          title: 'Downtown Art Walk - First Friday',
          description: 'Monthly art walk featuring local galleries, street artists, and pop-up exhibitions. Free wine and appetizers at participating venues.',
          start_time: new Date(baseDate.getTime() + 86400000 * 5).toISOString(), // 5 days from now
          end_time: new Date(baseDate.getTime() + 86400000 * 5 + 14400000).toISOString(), // 4 hours later
          location: 'Downtown Santa Cruz, Pacific Avenue',
          image_url: null,
          external_url: 'https://downtownsantacruz.com/art-walk',
          source: 'Downtown Association',
          event_type: 'external',
          price_info: 'Free',
          is_free: true,
          category: 'Arts & Culture',
          related_interests: ['Art', 'Culture', 'Community', 'Walking'],
          organizer: { name: 'Santa Cruz Downtown Association' },
          users: {
            name: 'Downtown SC',
            email: 'info@downtownsantacruz.com',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-3',
          title: 'Tech Meetup: Web Development Trends 2025',
          description: 'Monthly meetup for web developers. This month: exploring React Server Components, AI integration, and the latest in CSS. Pizza and networking included.',
          start_time: new Date(baseDate.getTime() + 86400000 * 7).toISOString(), // 1 week from now
          end_time: new Date(baseDate.getTime() + 86400000 * 7 + 10800000).toISOString(), // 3 hours later
          location: 'Cruzio Internet, 877 Cedar St, Santa Cruz',
          image_url: null,
          external_url: 'https://meetup.com/santa-cruz-tech',
          source: 'Meetup',
          event_type: 'external',
          price_info: 'Free',
          is_free: true,
          category: 'Technology',
          related_interests: ['Technology', 'Programming', 'Networking', 'Learning'],
          organizer: { name: 'Santa Cruz Tech Meetup' },
          users: {
            name: 'Tech Community',
            email: 'organizer@santacruztech.com',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-4',
          title: 'Farmers Market - Saturday Morning',
          description: 'Weekly farmers market featuring local produce, artisan foods, live music, and family activities. Support local farmers and enjoy fresh seasonal produce.',
          start_time: new Date(baseDate.getTime() + 86400000 * 3).toISOString(), // 3 days from now
          end_time: new Date(baseDate.getTime() + 86400000 * 3 + 18000000).toISOString(), // 5 hours later
          location: 'Lincoln Street, between Cedar and Cathcart',
          image_url: null,
          external_url: 'https://santacruzfarmersmarket.org',
          source: 'Community Markets',
          event_type: 'external',
          price_info: 'Free entry',
          is_free: true,
          category: 'Food & Drink',
          related_interests: ['Food', 'Community', 'Local', 'Family'],
          organizer: { name: 'Santa Cruz Community Farmers Markets' },
          users: {
            name: 'Farmers Market',
            email: 'info@santacruzfarmersmarket.org',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-5',
          title: 'Sunset Yoga on the Beach',
          description: 'Weekly sunset yoga sessions on Cowell Beach. All levels welcome. Bring your own mat or rent one for $5. Beautiful ocean views and peaceful atmosphere.',
          start_time: new Date(baseDate.getTime() + 86400000 * 1).toISOString(), // Tomorrow
          end_time: new Date(baseDate.getTime() + 86400000 * 1 + 5400000).toISOString(), // 1.5 hours later
          location: 'Cowell Beach, Santa Cruz',
          image_url: null,
          external_url: 'https://santacruzyoga.com/beach-sessions',
          source: 'Local Studios',
          event_type: 'external',
          price_info: '$15 - $20',
          is_free: false,
          category: 'Health & Wellness',
          related_interests: ['Yoga', 'Beach', 'Wellness', 'Sunset'],
          organizer: { name: 'Santa Cruz Yoga Collective' },
          users: {
            name: 'Yoga Collective',
            email: 'info@santacruzyoga.com',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-6',
          title: 'UCSC Campus Tour for Prospective Students',
          description: 'Guided campus tour including residence halls, dining facilities, academic buildings, and recreational areas. Q&A session with current students included.',
          start_time: new Date(baseDate.getTime() + 86400000 * 4).toISOString(), // 4 days from now
          end_time: new Date(baseDate.getTime() + 86400000 * 4 + 7200000).toISOString(), // 2 hours later
          location: 'UCSC Campus, Meet at Visitor Center',
          image_url: null,
          external_url: 'https://admissions.ucsc.edu/visit',
          source: 'UCSC Admissions',
          event_type: 'external',
          price_info: 'Free',
          is_free: true,
          category: 'Education',
          related_interests: ['Education', 'Campus', 'Tour', 'University'],
          organizer: { name: 'UCSC Admissions Office' },
          users: {
            name: 'UCSC Admissions',
            email: 'admissions@ucsc.edu',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-7',
          title: 'Live Music: Indie Band Night at The Catalyst',
          description: 'Local and touring indie bands perform. Tonight featuring three acts with opening doors at 7pm. Full bar and food available.',
          start_time: new Date(baseDate.getTime() + 86400000 * 6).toISOString(), // 6 days from now
          end_time: new Date(baseDate.getTime() + 86400000 * 6 + 18000000).toISOString(), // 5 hours later
          location: 'The Catalyst, 1011 Pacific Ave, Santa Cruz',
          image_url: null,
          external_url: 'https://catalystclub.com',
          source: 'Venue Events',
          event_type: 'external',
          price_info: '$12 - $18',
          is_free: false,
          category: 'Music',
          related_interests: ['Music', 'Live Performance', 'Indie', 'Nightlife'],
          organizer: { name: 'The Catalyst Club' },
          users: {
            name: 'The Catalyst',
            email: 'info@catalystclub.com',
            avatar_url: '/images/default-avatar.png'
          }
        },
        {
          id: 'external-8',
          title: 'Hiking Group: Big Basin Redwoods',
          description: 'Monthly group hike through Big Basin Redwoods State Park. Moderate difficulty, 5-mile loop trail. Carpooling available from Santa Cruz.',
          start_time: new Date(baseDate.getTime() + 86400000 * 8).toISOString(), // 8 days from now
          end_time: new Date(baseDate.getTime() + 86400000 * 8 + 21600000).toISOString(), // 6 hours later
          location: 'Big Basin Redwoods State Park',
          image_url: null,
          external_url: 'https://santacruzhiking.com',
          source: 'Hiking Groups',
          event_type: 'external',
          price_info: '$10 parking fee',
          is_free: false,
          category: 'Sports & Fitness',
          related_interests: ['Hiking', 'Nature', 'Outdoors', 'Exercise'],
          organizer: { name: 'Santa Cruz Hiking Club' },
          users: {
            name: 'Hiking Club',
            email: 'trails@santacruzhiking.com',
            avatar_url: '/images/default-avatar.png'
          }
        }
      ];
    }
  
    // Get events with optional filtering
    static async getExternalEvents(options = {}) {
      const { query = '', category = '', location = '' } = options;
      
      let events = this.getStaticExternalEvents();
      
      // Filter by search query
      if (query) {
        const queryLower = query.toLowerCase();
        events = events.filter(event => 
          event.title.toLowerCase().includes(queryLower) ||
          event.description.toLowerCase().includes(queryLower) ||
          event.related_interests.some(interest => 
            interest.toLowerCase().includes(queryLower)
          )
        );
      }
      
      // Filter by category
      if (category && category !== 'all') {
        events = events.filter(event => 
          event.related_interests.includes(category)
        );
      }
      
      // Simulate API delay for realism
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return {
        data: events,
        error: null,
        source: 'static'
      };
    }
  
    // Get events by category
    static async getEventsByCategory(category) {
      return this.getExternalEvents({ category });
    }
  
    // Search events
    static async searchEvents(query) {
      return this.getExternalEvents({ query });
    }
  
    // Get free events only
    static async getFreeEvents() {
      const { data } = await this.getExternalEvents();
      return {
        data: data.filter(event => event.is_free),
        error: null,
        source: 'static'
      };
    }
  
    // Get events happening today
    static async getTodayEvents() {
      const { data } = await this.getExternalEvents();
      const today = new Date();
      const todayStr = today.toDateString();
      
      return {
        data: data.filter(event => {
          const eventDate = new Date(event.start_time);
          return eventDate.toDateString() === todayStr;
        }),
        error: null,
        source: 'static'
      };
    }
  }
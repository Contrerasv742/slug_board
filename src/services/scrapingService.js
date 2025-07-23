// Scraping service for backend integration
// This service handles communication with the Python scraper backend

import { supabase } from "../lib/supabase.js";

class ScrapingService {
  constructor() {
    this.baseUrl =
      process.env.REACT_APP_SCRAPING_API_URL || "http://localhost:8000";
  }

  /**
   * Trigger the Python scraper for Santa Cruz events
   * This would call the backend API that runs the scrape_santacruz_events.py script
   */
  async scrapeSantaCruzEvents() {
    try {
      const response = await fetch(`${this.baseUrl}/api/scrape/santacruz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://www.cityofsantacruz.com/community/special-events",
          save_to_db: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`Scraping API error: ${response.status}`);
      }

      const result = await response.json();
      return result.events || [];
    } catch (error) {
      console.error("Santa Cruz scraping error:", error);
      throw new Error("Failed to scrape Santa Cruz events");
    }
  }

  /**
   * Generic scraping service for other platforms
   */
  async scrapeGenericEvents(url) {
    try {
      const response = await fetch(`${this.baseUrl}/api/scrape/generic`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`Scraping API error: ${response.status}`);
      }

      const result = await response.json();
      return result.events || [];
    } catch (error) {
      console.error("Generic scraping error:", error);
      throw new Error("Failed to scrape events from provided URL");
    }
  }

  /**
   * Get scraped events from database
   */
  async getScrapedEvents(source = "campus", limit = 10) {
    try {
      const { data, error } = await supabase
        .from("Events")
        .select(
          `
          *,
          profiles:host_id (
            name,
            username,
            avatar_url
          )
        `,
        )
        .eq("event_type", source)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Database fetch error:", error);
      return [];
    }
  }

  /**
   * Save scraped event to database
   */
  async saveScrapedEvent(eventData, hostId = null) {
    try {
      const { data, error } = await supabase
        .from("Events")
        .insert([
          {
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            start_time: eventData.startDateTime,
            end_time: eventData.endDateTime,
            is_free: eventData.isFree,
            price_info: eventData.priceInfo || null,
            external_url: eventData.originalUrl || null,
            category: eventData.category || null,
            related_interests: eventData.interests || [],
            event_type: "campus",
            source: eventData.source || "scraped",
            host_id: hostId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            upvotes_count: 0,
            downvotes_count: 0,
            comments_count: 0,
            rsvp_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error("Database save error:", error);
      throw new Error("Failed to save event to database");
    }
  }

  /**
   * Batch save multiple scraped events
   */
  async batchSaveEvents(events, hostId = null) {
    const results = {
      successful: [],
      failed: [],
    };

    for (const event of events) {
      try {
        const saved = await this.saveScrapedEvent(event, hostId);
        results.successful.push(saved);
      } catch (error) {
        results.failed.push({
          event: event.title,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Check scraping service health
   */
  async checkServiceHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const scrapingService = new ScrapingService();
export default ScrapingService;

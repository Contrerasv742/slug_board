// Database helper functions to replace missing RPC functions
import { supabase } from "../lib/supabase.js";

// Increment a field in a table
export const incrementField = async (tableName, rowId, fieldName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ [fieldName]: supabase.sql`${fieldName} + 1` })
      .eq("event_id", rowId)
      .select(fieldName)
      .single();

    if (error) throw error;
    return data[fieldName];
  } catch (error) {
    console.error(`Error incrementing ${fieldName}:`, error);
    // Fallback: get current value and increment manually
    try {
      const { data: currentData, error: fetchError } = await supabase
        .from(tableName)
        .select(fieldName)
        .eq("event_id", rowId)
        .single();

      if (fetchError) throw fetchError;

      const newValue = (currentData[fieldName] || 0) + 1;
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [fieldName]: newValue })
        .eq("event_id", rowId);

      if (updateError) throw updateError;
      return newValue;
    } catch (fallbackError) {
      console.error("Fallback increment failed:", fallbackError);
      throw error;
    }
  }
};

// Decrement a field in a table
export const decrementField = async (tableName, rowId, fieldName) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update({ [fieldName]: supabase.sql`GREATEST(${fieldName} - 1, 0)` })
      .eq("event_id", rowId)
      .select(fieldName)
      .single();

    if (error) throw error;
    return data[fieldName];
  } catch (error) {
    console.error(`Error decrementing ${fieldName}:`, error);
    // Fallback: get current value and decrement manually
    try {
      const { data: currentData, error: fetchError } = await supabase
        .from(tableName)
        .select(fieldName)
        .eq("event_id", rowId)
        .single();

      if (fetchError) throw fetchError;

      const newValue = Math.max((currentData[fieldName] || 0) - 1, 0);
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ [fieldName]: newValue })
        .eq("event_id", rowId);

      if (updateError) throw updateError;
      return newValue;
    } catch (fallbackError) {
      console.error("Fallback decrement failed:", fallbackError);
      throw error;
    }
  }
};

// Check if database tables exist
export const checkDatabaseTables = async (client = supabase) => {
  const tables = [
    "Events",
    "EventUpvotes",
    "EventComments",
    "RSVPs",
    "Profiles",
  ];
  const results = {};

  for (const table of tables) {
    try {
      const { data, error } = await client.from(table).select("*").limit(1);

      results[table] = {
        exists: !error,
        error: error?.message || null,
      };
    } catch (error) {
      results[table] = {
        exists: false,
        error: error.message,
      };
    }
  }

  return results;
};

// Create sample event for testing
export const createSampleEvent = async (userId) => {
  try {
    const sampleEvent = {
      title: "Sample Event - Test",
      description:
        "This is a sample event for testing the application functionality.",
      location: "Santa Cruz, CA",
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      is_free: true,
      price_info: null,
      external_url: null,
      category: "General",
      related_interests: ["Technology", "Education"],
      event_type: "user_created",
      source: "manual",
      host_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes_count: 0,
      downvotes_count: 0,
      comments_count: 0,
      rsvp_count: 0,
    };

    const { data, error } = await supabase
      .from("Events")
      .insert([sampleEvent])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating sample event:", error);
    throw error;
  }
};

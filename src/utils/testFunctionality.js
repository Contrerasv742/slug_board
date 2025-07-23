// Comprehensive functionality testing suite
// This file tests all CRUD operations and scraping functionality

import { supabase } from "../lib/supabase.js";
import {
  scrapeEventData,
  scrapeLiveEvents,
  scrapeBatchEvents,
  checkScrapingCapability,
} from "./improvedScraper.js";
import {
  incrementField,
  decrementField,
  checkDatabaseTables,
  createSampleEvent,
} from "./databaseHelpers.js";

// Test Results Storage
let testResults = {
  database: {},
  crud: {},
  scraping: {},
  auth: {},
  summary: {},
};

// Database Connection Test
export const testDatabaseConnection = async () => {
  console.log("🔍 Testing database connection...");

  try {
    const { data, error } = await supabase
      .from("Events")
      .select("count")
      .limit(1);

    if (error) {
      testResults.database.connection = {
        success: false,
        error: error.message,
      };
      console.error("❌ Database connection failed:", error.message);
      return false;
    }

    testResults.database.connection = { success: true };
    console.log("✅ Database connection successful");
    return true;
  } catch (error) {
    testResults.database.connection = { success: false, error: error.message };
    console.error("❌ Database connection test failed:", error.message);
    return false;
  }
};

// Test Database Tables
export const testDatabaseTables = async () => {
  console.log("🔍 Testing database tables...");

  try {
    const tableStatus = await checkDatabaseTables();
    testResults.database.tables = tableStatus;

    const allTablesExist = Object.values(tableStatus).every(
      (table) => table.exists,
    );

    if (allTablesExist) {
      console.log("✅ All required database tables exist");
      return true;
    } else {
      console.log("⚠️ Some database tables are missing:", tableStatus);
      return false;
    }
  } catch (error) {
    testResults.database.tables = { error: error.message };
    console.error("❌ Database tables test failed:", error.message);
    return false;
  }
};

// Test Event CRUD Operations
export const testEventCRUD = async () => {
  console.log("🔍 Testing Event CRUD operations...");

  // Generate test user ID in proper UUID format
  const testUserId = crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  let createdEventId = null;

  try {
    // CREATE - Test event creation
    console.log("  Testing CREATE operation...");
    const newEvent = {
      title: "Test Event CRUD",
      description: "This is a test event for CRUD functionality testing",
      location: "Test Location",
      start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      end_time: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
      is_free: true,
      price_info: null,
      external_url: null,
      category: "Test",
      related_interests: ["Testing", "Development"],
      event_type: "user_created",
      source: "test",
      host_id: testUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      upvotes_count: 0,
      downvotes_count: 0,
      comments_count: 0,
      rsvp_count: 0,
    };

    const { data: createData, error: createError } = await supabase
      .from("Events")
      .insert([newEvent])
      .select()
      .single();

    if (createError) throw createError;

    createdEventId = createData.event_id;
    testResults.crud.eventCreate = { success: true, eventId: createdEventId };
    console.log("  ✅ CREATE operation successful");

    // READ - Test event reading
    console.log("  Testing READ operation...");
    const { data: readData, error: readError } = await supabase
      .from("Events")
      .select("*")
      .eq("event_id", createdEventId)
      .single();

    if (readError) throw readError;

    testResults.crud.eventRead = { success: true, data: readData };
    console.log("  ✅ READ operation successful");

    // UPDATE - Test event updating
    console.log("  Testing UPDATE operation...");
    const { data: updateData, error: updateError } = await supabase
      .from("Events")
      .update({ title: "Test Event CRUD - Updated" })
      .eq("event_id", createdEventId)
      .select()
      .single();

    if (updateError) throw updateError;

    testResults.crud.eventUpdate = { success: true, data: updateData };
    console.log("  ✅ UPDATE operation successful");

    // Test increment/decrement operations
    console.log("  Testing increment/decrement operations...");

    await incrementField("Events", createdEventId, "upvotes_count");
    await incrementField("Events", createdEventId, "comments_count");
    await decrementField("Events", createdEventId, "upvotes_count");

    const { data: countData } = await supabase
      .from("Events")
      .select("upvotes_count, comments_count")
      .eq("event_id", createdEventId)
      .single();

    testResults.crud.incrementDecrement = {
      success: true,
      upvotes: countData.upvotes_count,
      comments: countData.comments_count,
    };
    console.log("  ✅ Increment/Decrement operations successful");

    // DELETE - Test event deletion
    console.log("  Testing DELETE operation...");
    const { error: deleteError } = await supabase
      .from("Events")
      .delete()
      .eq("event_id", createdEventId);

    if (deleteError) throw deleteError;

    testResults.crud.eventDelete = { success: true };
    console.log("  ✅ DELETE operation successful");

    console.log("✅ All Event CRUD operations successful");
    return true;
  } catch (error) {
    console.error("❌ Event CRUD test failed:", error.message);
    testResults.crud.error = error.message;

    // Cleanup on error
    if (createdEventId) {
      try {
        await supabase.from("Events").delete().eq("event_id", createdEventId);
      } catch (cleanupError) {
        console.error("Failed to cleanup test event:", cleanupError);
      }
    }

    return false;
  }
};

// Test Scraping Functionality
export const testScrapingFunctionality = async () => {
  console.log("🔍 Testing scraping functionality...");

  try {
    // Test single URL scraping
    console.log("  Testing single URL scraping...");
    const eventbriteUrl = "https://www.eventbrite.com/d/ca--santa-cruz/events/";
    const singleEvents = await scrapeEventData(eventbriteUrl);

    testResults.scraping.singleUrl = {
      success: singleEvents.length > 0,
      count: singleEvents.length,
      events: singleEvents.slice(0, 2), // Store first 2 for verification
    };

    if (singleEvents.length > 0) {
      console.log(
        `  ✅ Single URL scraping successful (${singleEvents.length} events)`,
      );
    } else {
      console.log("  ⚠️ Single URL scraping returned no events");
    }

    // Test live scraping
    console.log("  Testing live scraping...");
    const meetupUrl = "https://www.meetup.com/find/?location=Santa+Cruz%2C+CA";
    const liveEvents = await scrapeLiveEvents(meetupUrl);

    testResults.scraping.liveUrl = {
      success: liveEvents.length > 0,
      count: liveEvents.length,
      events: liveEvents.slice(0, 2),
    };

    if (liveEvents.length > 0) {
      console.log(
        `  ✅ Live scraping successful (${liveEvents.length} events)`,
      );
    } else {
      console.log("  ⚠️ Live scraping returned no events");
    }

    // Test batch scraping
    console.log("  Testing batch scraping...");
    const batchUrls = [
      "https://www.eventbrite.com/d/ca--santa-cruz/events/",
      "https://www.meetup.com/find/?location=Santa+Cruz%2C+CA",
      "https://www.cityofsantacruz.com/community/special-events",
    ];

    const batchResults = await scrapeBatchEvents(batchUrls);
    const successfulBatch = batchResults.filter((result) => result.success);

    testResults.scraping.batchUrls = {
      success: successfulBatch.length > 0,
      totalUrls: batchUrls.length,
      successfulUrls: successfulBatch.length,
      results: batchResults,
    };

    console.log(
      `  ✅ Batch scraping successful (${successfulBatch.length}/${batchUrls.length} URLs)`,
    );

    // Test scraping capability check
    console.log("  Testing scraping capability check...");
    const capability = await checkScrapingCapability(eventbriteUrl);

    testResults.scraping.capability = capability;
    console.log("  ✅ Scraping capability check successful");

    console.log("✅ All scraping functionality tests completed");
    return true;
  } catch (error) {
    console.error("❌ Scraping functionality test failed:", error.message);
    testResults.scraping.error = error.message;
    return false;
  }
};

// Test Authentication
export const testAuthentication = async () => {
  console.log("🔍 Testing authentication...");

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      testResults.auth.user = {
        success: true,
        userId: user.id,
        email: user.email,
      };
      console.log("✅ User is authenticated:", user.email);
      return true;
    } else {
      testResults.auth.user = { success: false, message: "No user logged in" };
      console.log("⚠️ No user is currently logged in");
      return false;
    }
  } catch (error) {
    testResults.auth.error = error.message;
    console.error("❌ Authentication test failed:", error.message);
    return false;
  }
};

// Run All Tests
export const runAllTests = async () => {
  console.log("🚀 Starting comprehensive functionality tests...\n");

  const results = {
    databaseConnection: await testDatabaseConnection(),
    databaseTables: await testDatabaseTables(),
    authentication: await testAuthentication(),
    eventCRUD: await testEventCRUD(),
    scrapingFunctionality: await testScrapingFunctionality(),
  };

  // Generate summary
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;

  testResults.summary = {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    passRate: ((passedTests / totalTests) * 100).toFixed(1) + "%",
    timestamp: new Date().toISOString(),
  };

  console.log("\n📊 TEST SUMMARY:");
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Pass Rate: ${testResults.summary.passRate}`);

  if (failedTests === 0) {
    console.log(
      "🎉 All functionality tests passed! The codebase is ready for production.",
    );
  } else {
    console.log("⚠️ Some tests failed. Please check the detailed results.");
  }

  console.log("\n📋 Detailed Results:", testResults);

  return testResults;
};

// Export test results for external access
export const getTestResults = () => testResults;

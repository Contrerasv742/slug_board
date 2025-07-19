// Test utility for event creation with related_interests
// This can be used in the browser console to test database insertion

import { supabase } from '../supabaseClient';

// Test function that can be called from browser console
window.testEventCreation = async function() {
  console.log('🧪 Testing event creation with related_interests...');
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No user logged in. Please log in first.');
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    // Test event data - minimal user-created event
    const testEventData = {
      title: 'Test User Event - ' + new Date().toLocaleTimeString(),
      description: 'This is a minimal test event with only required fields: title, description, and interest tags.',
      related_interests: ['Photography', 'Music', 'Technology'],
      host_id: user.id
      // Note: No start_time, end_time, location, or college_tag - these should be nullable now
    };
    
    console.log('📤 Sending event data:', testEventData);
    
    // Insert directly via Supabase
    const { data, error } = await supabase
      .from('Events')
      .insert(testEventData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
      
      if (error.message?.includes('column "related_interests" does not exist')) {
        console.log('🚨 The related_interests column does not exist in the database!');
        console.log('Please run the SQL script to add it.');
      }
    } else {
      console.log('✅ Event created successfully!');
      console.log('📥 Response data:', data);
      console.log('🏷️ related_interests in response:', data.related_interests);
      
      // Query back to verify
      const { data: verifyData, error: verifyError } = await supabase
        .from('Events')
        .select('*')
        .eq('id', data.id)
        .single();
      
      if (verifyError) {
        console.error('❌ Error verifying event:', verifyError);
      } else {
        console.log('🔍 Verification query result:', verifyData);
        console.log('🔍 related_interests from verification:', verifyData.related_interests);
      }
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

// Test function using EventService
window.testEventService = async function() {
  console.log('🧪 Testing EventService.createEvent...');
  
  try {
    // Import EventService (this might not work in console, but worth trying)
    const { EventService } = await import('../services/eventService');
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No user logged in. Please log in first.');
      return;
    }
    
    // Test data that matches exactly what the create-post form sends
    const testEventData = {
      title: 'Form Test Event - ' + new Date().toLocaleTimeString(),
      description: 'Testing what the actual form sends to EventService',
      related_interests: ['Art', 'Sports', 'Music'],
      host_id: user.id
      // Mimicking the form: no optional fields included when empty
    };
    
    console.log('📤 Calling EventService.createEvent with:', testEventData);
    
    const result = await EventService.createEvent(testEventData);
    
    if (result.error) {
      console.error('❌ EventService error:', result.error);
    } else {
      console.log('✅ EventService success:', result.data);
      console.log('🏷️ related_interests:', result.data.related_interests);
    }
    
  } catch (error) {
    console.error('❌ Could not import EventService:', error);
    console.log('💡 Try running testEventCreation() instead');
  }
};

// Test function with explicit null values for optional fields
window.testEventWithNulls = async function() {
  console.log('🧪 Testing event creation with explicit null values...');
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('❌ No user logged in. Please log in first.');
      return;
    }
    
    // Test event data with explicit null values for optional fields
    const testEventData = {
      title: 'Null Test Event - ' + new Date().toLocaleTimeString(),
      description: 'Testing with explicit null values for optional fields.',
      related_interests: ['Photography', 'Music', 'Technology'],
      host_id: user.id,
      start_time: null,
      end_time: null,
      location: null,
      college_tag: null
    };
    
    console.log('📤 Sending event data with nulls:', testEventData);
    
    const { data, error } = await supabase
      .from('Events')
      .insert(testEventData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database error:', error);
    } else {
      console.log('✅ Event with nulls created successfully!');
      console.log('📥 Response data:', data);
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
};

console.log('🔧 Test functions loaded. Available commands:');
console.log('  - testEventCreation() - Test direct Supabase insertion (minimal fields)');
console.log('  - testEventService() - Test via EventService');
console.log('  - testEventWithNulls() - Test with explicit null values for optional fields'); 
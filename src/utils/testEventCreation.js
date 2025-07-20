// Test script to verify event creation and retrieval
// You can run this in the browser console to test the functionality

import { EventService } from '../services/eventService';
import { supabase } from '../supabaseClient';

export const testEventCreation = async () => {
  console.log('🧪 Testing Event Creation...');
  
  try {
    // Test 1: Get current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log('✅ Current user:', user?.email);
    
    if (!user) {
      console.log('❌ No user logged in. Please log in first.');
      return;
    }
    
    // Test 2: Create a test event
    const testEventData = {
      title: 'Test Event - ' + new Date().toLocaleTimeString(),
      description: 'This is a test event created to verify the database connection and event creation functionality.',
      host_id: user.id,
      event_type: 'community',
      related_interests: ['Technology', 'Testing', 'Development'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Creating test event with data:', testEventData);
    
    const { data: createdEvent, error: createError } = await EventService.createEvent(testEventData);
    
    if (createError) {
      console.error('❌ Error creating event:', createError);
      return;
    }
    
    console.log('✅ Event created successfully:', createdEvent);
    
    // Test 3: Retrieve all events
    console.log('📋 Retrieving all events...');
    const { data: allEvents, error: retrieveError } = await EventService.getAllEvents();
    
    if (retrieveError) {
      console.error('❌ Error retrieving events:', retrieveError);
      return;
    }
    
    console.log('✅ Retrieved events:', allEvents);
    console.log('📊 Total events in database:', allEvents?.length || 0);
    
    // Test 4: Find our test event
    const testEvent = allEvents?.find(event => event.id === createdEvent.id);
    if (testEvent) {
      console.log('✅ Test event found in retrieved events:', testEvent);
    } else {
      console.log('❌ Test event not found in retrieved events');
    }
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testEventCreation = testEventCreation;
} 
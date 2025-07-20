# Event Creation Setup Guide

This guide will help you set up the complete event creation functionality that connects to your database and displays events on the home page using the new EventCard components.

## 🚀 Quick Start

### 1. Database Setup

First, run the storage setup script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of SETUP_EVENT_IMAGES_STORAGE.sql
-- This creates the storage bucket for event images with proper RLS policies
```

### 2. Test the Setup

1. **Log into your application**
2. **Open browser console** (F12)
3. **Run the test function:**
   ```javascript
   // Import and run the test
   import('./src/utils/testEventCreation.js').then(module => {
     module.testEventCreation();
   });
   ```

### 3. Create Your First Event

1. **Navigate to `/create-post`**
2. **Fill out the form:**
   - Title: "My First Event"
   - Description: "This is my first community event!"
   - Select at least 3 interests
   - Optionally upload an image
3. **Click "Post Event"**
4. **Check the home page** - your event should appear in the "Community Events" section

## 📋 What's Been Updated

### ✅ Create Post Page (`src/pages/create-post.jsx`)
- **Connected to database** via EventService
- **Image upload** to Supabase storage
- **Form validation** with error handling
- **Loading states** and user feedback
- **Automatic redirect** to home page after creation

### ✅ EventCard Component (`src/components/ui/EventCard.jsx`)
- **Image display** for events with images
- **Two variants**: compact (community) and full (campus)
- **Responsive design** with hover effects
- **Interactive elements**: RSVP, comments, share

### ✅ Home Page (`src/pages/general/home.jsx`)
- **Refactored** to use EventCard components
- **Cleaner code** with less duplication
- **Same functionality** as before

### ✅ EventService (`src/services/eventService.js`)
- **Already has** createEvent method
- **Handles** user data fetching
- **Supports** all event types

## 🔧 Database Schema

Your Events table should have these columns:

```sql
CREATE TABLE Events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  host_id UUID REFERENCES auth.users(id),
  event_type TEXT DEFAULT 'community',
  related_interests TEXT[],
  image_url TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  location TEXT,
  college_tag TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎯 Event Types

- **Community Events** (`event_type: 'community'`)
  - Created by users
  - Display as compact cards
  - Purple theme
  - Show in "Community Events" section

- **Campus Events** (`event_type: 'campus'`)
  - Created by admins
  - Display as full cards
  - Orange theme
  - Show in "Campus Events" section

## 🖼️ Image Upload

Images are stored in Supabase storage:
- **Bucket**: `event-images`
- **Path**: `event-images/{random-filename}.{ext}`
- **Public access**: Yes
- **File size limit**: 5MB
- **Supported formats**: JPG, PNG, GIF, WebP

## 🧪 Testing

### Test Event Creation
```javascript
// In browser console
import('./src/utils/testEventCreation.js').then(module => {
  module.testEventCreation();
});
```

### Test Database Connection
```javascript
// Check if events are being fetched
import('./src/services/eventService.js').then(module => {
  module.EventService.getAllEvents().then(result => {
    console.log('Events:', result);
  });
});
```

## 🐛 Troubleshooting

### "No events showing on home page"
1. Check browser console for errors
2. Verify user is logged in
3. Run test function to check database connection
4. Check if events have `event_type` set correctly

### "Image upload failing"
1. Run the storage setup SQL script
2. Check Supabase storage bucket exists
3. Verify RLS policies are in place
4. Check file size (max 5MB)

### "Form validation errors"
1. Ensure title and description are filled
2. Select at least 3 interests
3. Check if user is authenticated

### "Database errors"
1. Check Supabase connection
2. Verify Events table exists with correct schema
3. Check RLS policies on Events table
4. Ensure user has proper permissions

## 📱 Usage Examples

### Create a Community Event
```javascript
const eventData = {
  title: "Photography Workshop",
  description: "Learn photography basics with hands-on practice",
  host_id: user.id,
  event_type: "community",
  related_interests: ["Photography", "Art", "Learning"],
  image_url: "https://...", // Optional
  created_at: new Date().toISOString()
};

const { data, error } = await EventService.createEvent(eventData);
```

### Display Events
```jsx
// Compact variant for community events
<EventCard
  event={eventData}
  variant="compact"
  onRSVP={handleRSVP}
  user={currentUser}
/>

// Full variant for campus events
<EventCard
  event={eventData}
  variant="full"
  onRSVP={handleRSVP}
  user={currentUser}
/>
```

## 🎉 Success!

Once everything is set up:
1. **Events created** via the form will appear on the home page
2. **Images will display** in the event cards
3. **Community events** show as compact purple cards
4. **Campus events** show as full orange cards
5. **All interactive features** (RSVP, comments, share) work

Your event creation system is now fully functional! 🚀 
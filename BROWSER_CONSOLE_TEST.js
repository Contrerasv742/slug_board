// BROWSER CONSOLE TEST FOR STORAGE UPLOAD
// Run this in your browser console (F12 > Console) while logged into the app
// This will help isolate whether the issue is storage policies or app code

// Test 1: Check authentication
console.log('=== STORAGE UPLOAD TEST ===');

// Get the supabase client from the global scope (should be available in React app)
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client found');
} else {
  console.log('❌ Supabase client not found - try running this from the app page');
}

async function testStorageUpload() {
  try {
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.log('❌ Auth error:', authError);
      return;
    }
    
    if (!user) {
      console.log('❌ No authenticated user found');
      return;
    }
    
    console.log('✅ User authenticated:', user.id);
    
    // Check if avatars bucket exists
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.log('❌ Error listing buckets:', bucketError);
      return;
    }
    
    const avatarsBucket = buckets.find(b => b.id === 'avatars');
    if (avatarsBucket) {
      console.log('✅ Avatars bucket exists:', avatarsBucket);
    } else {
      console.log('❌ Avatars bucket not found');
      console.log('Available buckets:', buckets.map(b => b.id));
      return;
    }
    
    // Create a small test file
    const testFileContent = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    const response = await fetch(testFileContent);
    const testFile = await response.blob();
    
    console.log('✅ Test file created, size:', testFile.size);
    
    // Test upload with current naming pattern
    const filePath1 = `${user.id}-test.png`;
    console.log('Testing upload with pattern:', filePath1);
    
    const { data: upload1, error: error1 } = await supabase.storage
      .from('avatars')
      .upload(filePath1, testFile);
    
    if (error1) {
      console.log('❌ Upload failed with current pattern:', error1);
      
      // Test upload with folder pattern
      const filePath2 = `${user.id}/test.png`;
      console.log('Testing upload with folder pattern:', filePath2);
      
      const { data: upload2, error: error2 } = await supabase.storage
        .from('avatars')
        .upload(filePath2, testFile);
      
      if (error2) {
        console.log('❌ Upload failed with folder pattern:', error2);
        
        // Test very simple pattern
        const filePath3 = `test_${Date.now()}.png`;
        console.log('Testing upload with simple pattern:', filePath3);
        
        const { data: upload3, error: error3 } = await supabase.storage
          .from('avatars')
          .upload(filePath3, testFile);
        
        if (error3) {
          console.log('❌ All upload patterns failed:', error3);
          console.log('🔧 RECOMMENDED ACTION: Run the permissive storage policies (Solution 3 in ALTERNATIVE_UPLOAD_APPROACH.md)');
        } else {
          console.log('✅ Simple pattern works:', upload3);
          console.log('🔧 RECOMMENDED ACTION: Update your upload code to use simple filenames');
        }
      } else {
        console.log('✅ Folder pattern works:', upload2);
        console.log('🔧 RECOMMENDED ACTION: Update your upload code to use folder structure');
      }
    } else {
      console.log('✅ Current pattern works:', upload1);
      console.log('🔧 Upload should be working - check for other issues in your app code');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error);
  }
}

// Helper function to test profile update
async function testProfileUpdate() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ No user authenticated for profile test');
      return;
    }
    
    console.log('Testing profile update...');
    
    const { data, error } = await supabase
      .from('Profiles')
      .update({ 
        updated_at: new Date().toISOString(),
        avatar_url: 'https://example.com/test.jpg'
      })
      .eq('id', user.id);
    
    if (error) {
      console.log('❌ Profile update failed:', error);
    } else {
      console.log('✅ Profile update successful:', data);
    }
    
  } catch (error) {
    console.log('❌ Profile test failed:', error);
  }
}

// Instructions
console.log('=== INSTRUCTIONS ===');
console.log('1. Make sure you are logged into the app');
console.log('2. Run: testStorageUpload()');
console.log('3. Run: testProfileUpdate()');
console.log('4. Check the console output for specific error messages');
console.log('');
console.log('Available test functions:');
console.log('- testStorageUpload() - Tests file upload to storage');
console.log('- testProfileUpdate() - Tests profile table update');

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('');
  console.log('🚀 Running automatic tests...');
  setTimeout(() => {
    testStorageUpload();
    setTimeout(() => {
      testProfileUpdate();
    }, 2000);
  }, 1000);
} 
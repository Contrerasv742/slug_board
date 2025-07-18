import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GoogleLoginTest = () => {
  const [testResult, setTestResult] = useState('');
  const { signInWithProvider, user, userData } = useAuth();

  const testGoogleLogin = async () => {
    setTestResult('Testing Google login...');
    try {
      const { data, error } = await signInWithProvider('google');
      if (error) {
        setTestResult(`Error: ${error.message}`);
      } else {
        setTestResult('Google login initiated successfully! Check the OAuth flow.');
      }
    } catch (error) {
      setTestResult(`Exception: ${error.message}`);
    }
  };

  const checkUserData = () => {
    if (user) {
      setTestResult(`User ID: ${user.id}\nEmail: ${user.email}\nProvider: ${user.app_metadata?.provider || 'unknown'}`);
    } else {
      setTestResult('No user logged in');
    }
  };

  return (
    <div className="p-4 bg-global-2 rounded-lg">
      <h3 className="text-global-1 font-bold mb-4">Google OAuth Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testGoogleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Google Login
        </button>
        
        <button
          onClick={checkUserData}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
        >
          Check User Data
        </button>
      </div>
      
      {testResult && (
        <div className="bg-global-3 p-3 rounded">
          <pre className="text-sm text-global-1 whitespace-pre-wrap">{testResult}</pre>
        </div>
      )}
      
      {user && (
        <div className="mt-4 p-3 bg-global-3 rounded">
          <h4 className="text-global-1 font-semibold mb-2">Current User:</h4>
          <p className="text-global-1 text-sm">ID: {user.id}</p>
          <p className="text-global-1 text-sm">Email: {user.email}</p>
          <p className="text-global-1 text-sm">Provider: {user.app_metadata?.provider || 'email'}</p>
          {userData && (
            <p className="text-global-1 text-sm">Stored Data: {JSON.stringify(userData, null, 2)}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GoogleLoginTest; 
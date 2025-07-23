import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase.js';
import { checkDatabaseTables, createSampleEvent } from '../../utils/databaseHelpers.js';

const DatabaseSetup = () => {
  const [tableStatus, setTableStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkTables();
  }, []);

  const checkTables = async () => {
    setLoading(true);
    try {
      const status = await checkDatabaseTables();
      setTableStatus(status);
      console.log('Database table status:', status);
    } catch (error) {
      console.error('Error checking tables:', error);
      setMessage('Error checking database tables');
    } finally {
      setLoading(false);
    }
  };

  const createSampleData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage('Please log in first');
        return;
      }

      // Create sample event
      const sampleEvent = await createSampleEvent(user.id);
      setMessage(`Sample event created successfully! Event ID: ${sampleEvent.event_id}`);
      
      // Refresh table status
      await checkTables();
    } catch (error) {
      console.error('Error creating sample data:', error);
      setMessage(`Error creating sample data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Events')
        .select('count')
        .limit(1);

      if (error) {
        setMessage(`Database connection failed: ${error.message}`);
      } else {
        setMessage('Database connection successful!');
      }
    } catch (error) {
      setMessage(`Database test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-global-2 rounded-[20px] max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Database Setup & Diagnostics</h2>
      
      <div className="space-y-4">
        {/* Database Connection Test */}
        <div className="bg-global-3 p-4 rounded-[15px]">
          <h3 className="text-lg font-semibold text-white mb-2">Database Connection</h3>
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-[10px] disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        {/* Table Status */}
        <div className="bg-global-3 p-4 rounded-[15px]">
          <h3 className="text-lg font-semibold text-white mb-2">Table Status</h3>
          <div className="space-y-2">
            {Object.entries(tableStatus).map(([tableName, status]) => (
              <div key={tableName} className="flex items-center justify-between">
                <span className="text-white">{tableName}:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  status.exists ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {status.exists ? '✅ Exists' : '❌ Missing'}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={checkTables}
            disabled={loading}
            className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-[10px] disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Refresh Status'}
          </button>
        </div>

        {/* Sample Data Creation */}
        <div className="bg-global-3 p-4 rounded-[15px]">
          <h3 className="text-lg font-semibold text-white mb-2">Sample Data</h3>
          <button
            onClick={createSampleData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-[10px] disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Sample Event'}
          </button>
        </div>

        {/* Messages */}
        {message && (
          <div className="bg-global-3 p-4 rounded-[15px]">
            <h3 className="text-lg font-semibold text-white mb-2">Status</h3>
            <p className="text-white">{message}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-global-3 p-4 rounded-[15px]">
          <h3 className="text-lg font-semibold text-white mb-2">Troubleshooting</h3>
          <div className="text-white text-sm space-y-2">
            <p>• If tables are missing, you may need to create them in your Supabase dashboard</p>
            <p>• Make sure your Supabase URL and API key are correct</p>
            <p>• Check that your database has the necessary permissions</p>
            <p>• The sample event will help test CRUD functionality</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetup; 
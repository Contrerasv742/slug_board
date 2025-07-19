"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runDatabaseSetup = exports.CREATE_EVENTS_TABLE_SQL = exports.CREATE_USERS_TABLE_SQL = exports.DatabaseSetup = void 0;

var _supabaseClient = require("../supabaseClient");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DatabaseSetup =
/*#__PURE__*/
function () {
  function DatabaseSetup() {
    _classCallCheck(this, DatabaseSetup);
  }

  _createClass(DatabaseSetup, null, [{
    key: "checkUsersTable",
    // Check if users table exists and has the correct structure
    value: function checkUsersTable() {
      var _ref, data, error;

      return regeneratorRuntime.async(function checkUsersTable$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('*').limit(1));

            case 3:
              _ref = _context.sent;
              data = _ref.data;
              error = _ref.error;

              if (!error) {
                _context.next = 9;
                break;
              }

              console.error('Users table check failed:', error);
              return _context.abrupt("return", {
                exists: false,
                error: error
              });

            case 9:
              console.log('Users table exists and is accessible');
              return _context.abrupt("return", {
                exists: true,
                error: null
              });

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](0);
              console.error('Exception checking users table:', _context.t0);
              return _context.abrupt("return", {
                exists: false,
                error: _context.t0
              });

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 13]]);
    } // Check if events table exists and has the correct structure

  }, {
    key: "checkEventsTable",
    value: function checkEventsTable() {
      var _ref2, data, error;

      return regeneratorRuntime.async(function checkEventsTable$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').select('*').limit(1));

            case 3:
              _ref2 = _context2.sent;
              data = _ref2.data;
              error = _ref2.error;

              if (!error) {
                _context2.next = 9;
                break;
              }

              console.error('Events table check failed:', error);
              return _context2.abrupt("return", {
                exists: false,
                error: error
              });

            case 9:
              console.log('Events table exists and is accessible');
              return _context2.abrupt("return", {
                exists: true,
                error: null
              });

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              console.error('Exception checking events table:', _context2.t0);
              return _context2.abrupt("return", {
                exists: false,
                error: _context2.t0
              });

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 13]]);
    } // Get the structure of the users table

  }, {
    key: "getUsersTableStructure",
    value: function getUsersTableStructure() {
      var _ref3, data, error;

      return regeneratorRuntime.async(function getUsersTableStructure$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('*').limit(0));

            case 3:
              _ref3 = _context3.sent;
              data = _ref3.data;
              error = _ref3.error;

              if (!error) {
                _context3.next = 9;
                break;
              }

              console.error('Error getting table structure:', error);
              return _context3.abrupt("return", {
                structure: null,
                error: error
              });

            case 9:
              // This will give us information about the table structure
              console.log('Users table structure check completed');
              return _context3.abrupt("return", {
                structure: 'accessible',
                error: null
              });

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](0);
              console.error('Exception getting table structure:', _context3.t0);
              return _context3.abrupt("return", {
                structure: null,
                error: _context3.t0
              });

            case 17:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 13]]);
    } // Create a test user record to verify the table works

  }, {
    key: "testUserCreation",
    value: function testUserCreation() {
      var testUserData, _ref4, data, error;

      return regeneratorRuntime.async(function testUserCreation$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              testUserData = {
                id: 'test-user-' + Date.now(),
                email: 'test@example.com',
                created_at: new Date().toISOString(),
                provider: 'test',
                last_sign_in: new Date().toISOString()
              };
              _context4.next = 4;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').insert(testUserData).select().single());

            case 4:
              _ref4 = _context4.sent;
              data = _ref4.data;
              error = _ref4.error;

              if (!error) {
                _context4.next = 10;
                break;
              }

              console.error('Test user creation failed:', error);
              return _context4.abrupt("return", {
                success: false,
                error: error
              });

            case 10:
              _context4.next = 12;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users')["delete"]().eq('id', testUserData.id));

            case 12:
              console.log('Test user creation successful');
              return _context4.abrupt("return", {
                success: true,
                error: null
              });

            case 16:
              _context4.prev = 16;
              _context4.t0 = _context4["catch"](0);
              console.error('Exception in test user creation:', _context4.t0);
              return _context4.abrupt("return", {
                success: false,
                error: _context4.t0
              });

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 16]]);
    }
  }]);

  return DatabaseSetup;
}(); // SQL script to create the users table if it doesn't exist


exports.DatabaseSetup = DatabaseSetup;
var CREATE_USERS_TABLE_SQL = "\n-- Create users table if it doesn't exist\nCREATE TABLE IF NOT EXISTS users (\n  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,\n  email TEXT UNIQUE NOT NULL,\n  full_name TEXT,\n  avatar_url TEXT,\n  provider TEXT DEFAULT 'email',\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  last_sign_in TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Enable Row Level Security\nALTER TABLE users ENABLE ROW LEVEL SECURITY;\n\n-- Create policy to allow users to read their own data\nCREATE POLICY \"Users can view own data\" ON users\n  FOR SELECT USING (auth.uid() = id);\n\n-- Create policy to allow users to update their own data\nCREATE POLICY \"Users can update own data\" ON users\n  FOR UPDATE USING (auth.uid() = id);\n\n-- Create policy to allow users to insert their own data\nCREATE POLICY \"Users can insert own data\" ON users\n  FOR INSERT WITH CHECK (auth.uid() = id);\n\n-- Create index on email for faster lookups\nCREATE INDEX IF NOT EXISTS users_email_idx ON users(email);\n\n-- Create index on provider for filtering\nCREATE INDEX IF NOT EXISTS users_provider_idx ON users(provider);\n"; // SQL script to create the events and RSVPs tables

exports.CREATE_USERS_TABLE_SQL = CREATE_USERS_TABLE_SQL;
var CREATE_EVENTS_TABLE_SQL = "\n-- Create events table if it doesn't exist\nCREATE TABLE IF NOT EXISTS events (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  title TEXT NOT NULL,\n  description TEXT,\n  event_date TIMESTAMP WITH TIME ZONE,\n  location TEXT,\n  category TEXT,\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Enable Row Level Security\nALTER TABLE events ENABLE ROW LEVEL SECURITY;\n\n-- Create policy to allow users to view all events\nCREATE POLICY \"Users can view all events\" ON events\n  FOR SELECT USING (true);\n\n-- Create policy to allow users to insert their own events\nCREATE POLICY \"Users can insert own events\" ON events\n  FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n-- Create policy to allow users to update their own events\nCREATE POLICY \"Users can update own events\" ON events\n  FOR UPDATE USING (auth.uid() = user_id);\n\n-- Create policy to allow users to delete their own events\nCREATE POLICY \"Users can delete own events\" ON events\n  FOR DELETE USING (auth.uid() = user_id);\n\n-- Create indexes for better performance\nCREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);\nCREATE INDEX IF NOT EXISTS events_event_date_idx ON events(event_date);\nCREATE INDEX IF NOT EXISTS events_category_idx ON events(category);\nCREATE INDEX IF NOT EXISTS events_created_at_idx ON events(created_at);\n\n-- Create RSVPs table for event attendance\nCREATE TABLE IF NOT EXISTS \"RSVPs\" (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  event_id UUID REFERENCES events(id) ON DELETE CASCADE,\n  status TEXT DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  UNIQUE(user_id, event_id)\n);\n\n-- Enable Row Level Security for RSVPs\nALTER TABLE \"RSVPs\" ENABLE ROW LEVEL SECURITY;\n\n-- Create policy to allow users to view RSVPs for events\nCREATE POLICY \"Users can view RSVPs\" ON \"RSVPs\"\n  FOR SELECT USING (true);\n\n-- Create policy to allow users to insert their own RSVPs\nCREATE POLICY \"Users can insert own RSVPs\" ON \"RSVPs\"\n  FOR INSERT WITH CHECK (auth.uid() = user_id);\n\n-- Create policy to allow users to update their own RSVPs\nCREATE POLICY \"Users can update own RSVPs\" ON \"RSVPs\"\n  FOR UPDATE USING (auth.uid() = user_id);\n\n-- Create policy to allow users to delete their own RSVPs\nCREATE POLICY \"Users can delete own RSVPs\" ON \"RSVPs\"\n  FOR DELETE USING (auth.uid() = user_id);\n\n-- Create indexes for RSVPs\nCREATE INDEX IF NOT EXISTS rsvps_user_id_idx ON \"RSVPs\"(user_id);\nCREATE INDEX IF NOT EXISTS rsvps_event_id_idx ON \"RSVPs\"(event_id);\nCREATE INDEX IF NOT EXISTS rsvps_status_idx ON \"RSVPs\"(status);\n"; // Function to run the database setup

exports.CREATE_EVENTS_TABLE_SQL = CREATE_EVENTS_TABLE_SQL;

var runDatabaseSetup = function runDatabaseSetup() {
  var usersTableCheck, eventsTableCheck, testCreation;
  return regeneratorRuntime.async(function runDatabaseSetup$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('Running database setup checks...'); // Check if users table exists

          _context5.next = 3;
          return regeneratorRuntime.awrap(DatabaseSetup.checkUsersTable());

        case 3:
          usersTableCheck = _context5.sent;

          if (usersTableCheck.exists) {
            _context5.next = 9;
            break;
          }

          console.error('Users table does not exist or is not accessible');
          console.log('Please run the following SQL in your Supabase SQL editor:');
          console.log(CREATE_USERS_TABLE_SQL);
          return _context5.abrupt("return", false);

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(DatabaseSetup.checkEventsTable());

        case 11:
          eventsTableCheck = _context5.sent;

          if (eventsTableCheck.exists) {
            _context5.next = 17;
            break;
          }

          console.error('Events table does not exist or is not accessible');
          console.log('Please run the following SQL in your Supabase SQL editor:');
          console.log(CREATE_EVENTS_TABLE_SQL);
          return _context5.abrupt("return", false);

        case 17:
          _context5.next = 19;
          return regeneratorRuntime.awrap(DatabaseSetup.testUserCreation());

        case 19:
          testCreation = _context5.sent;

          if (testCreation.success) {
            _context5.next = 23;
            break;
          }

          console.error('User creation test failed:', testCreation.error);
          return _context5.abrupt("return", false);

        case 23:
          console.log('Database setup checks passed!');
          return _context5.abrupt("return", true);

        case 25:
        case "end":
          return _context5.stop();
      }
    }
  });
};

exports.runDatabaseSetup = runDatabaseSetup;
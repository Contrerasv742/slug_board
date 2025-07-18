"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authStateListener = exports.AuthService = void 0;

var _supabaseClient = require("../supabaseClient");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AuthService =
/*#__PURE__*/
function () {
  function AuthService() {
    _classCallCheck(this, AuthService);
  }

  _createClass(AuthService, null, [{
    key: "signUp",
    // Sign up with email and password
    value: function signUp(email, password) {
      var userData,
          _ref,
          data,
          error,
          _args = arguments;

      return regeneratorRuntime.async(function signUp$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              userData = _args.length > 2 && _args[2] !== undefined ? _args[2] : {};
              _context.prev = 1;
              _context.next = 4;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                  emailRedirectTo: window.location.origin + '/home'
                }
              }));

            case 4:
              _ref = _context.sent;
              data = _ref.data;
              error = _ref.error;

              if (!error) {
                _context.next = 9;
                break;
              }

              throw error;

            case 9:
              if (!data.user) {
                _context.next = 12;
                break;
              }

              _context.next = 12;
              return regeneratorRuntime.awrap(this.storeUserData(data.user.id, _objectSpread({
                email: data.user.email,
                created_at: new Date().toISOString()
              }, userData)));

            case 12:
              return _context.abrupt("return", {
                data: data,
                error: null
              });

            case 15:
              _context.prev = 15;
              _context.t0 = _context["catch"](1);
              return _context.abrupt("return", {
                data: null,
                error: _context.t0
              });

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[1, 15]]);
    } // Sign in with email and password

  }, {
    key: "signIn",
    value: function signIn(email, password) {
      var _ref2, data, error;

      return regeneratorRuntime.async(function signIn$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.signInWithPassword({
                email: email,
                password: password
              }));

            case 3:
              _ref2 = _context2.sent;
              data = _ref2.data;
              error = _ref2.error;

              if (!error) {
                _context2.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context2.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context2.prev = 11;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", {
                data: null,
                error: _context2.t0
              });

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Sign out

  }, {
    key: "signOut",
    value: function signOut() {
      var _ref3, error;

      return regeneratorRuntime.async(function signOut$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.signOut());

            case 3:
              _ref3 = _context3.sent;
              error = _ref3.error;

              if (!error) {
                _context3.next = 7;
                break;
              }

              throw error;

            case 7:
              return _context3.abrupt("return", {
                error: null
              });

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", {
                error: _context3.t0
              });

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 10]]);
    } // Get current user

  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var _ref4, user, error;

      return regeneratorRuntime.async(function getCurrentUser$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.getUser());

            case 3:
              _ref4 = _context4.sent;
              user = _ref4.data.user;
              error = _ref4.error;

              if (!error) {
                _context4.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context4.abrupt("return", {
                user: user,
                error: null
              });

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", {
                user: null,
                error: _context4.t0
              });

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Get user session

  }, {
    key: "getSession",
    value: function getSession() {
      var _ref5, session, error;

      return regeneratorRuntime.async(function getSession$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.getSession());

            case 3:
              _ref5 = _context5.sent;
              session = _ref5.data.session;
              error = _ref5.error;

              if (!error) {
                _context5.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context5.abrupt("return", {
                session: session,
                error: null
              });

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](0);
              return _context5.abrupt("return", {
                session: null,
                error: _context5.t0
              });

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Store user data in users table

  }, {
    key: "storeUserData",
    value: function storeUserData(uid, userData) {
      var _ref6, data, error;

      return regeneratorRuntime.async(function storeUserData$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').upsert(_objectSpread({
                id: uid
              }, userData, {
                updated_at: new Date().toISOString()
              })));

            case 3:
              _ref6 = _context6.sent;
              data = _ref6.data;
              error = _ref6.error;

              if (!error) {
                _context6.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context6.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context6.prev = 11;
              _context6.t0 = _context6["catch"](0);
              return _context6.abrupt("return", {
                data: null,
                error: _context6.t0
              });

            case 14:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Get user data from users table

  }, {
    key: "getUserData",
    value: function getUserData(uid) {
      var _ref7, data, error;

      return regeneratorRuntime.async(function getUserData$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('*').eq('id', uid).single());

            case 3:
              _ref7 = _context7.sent;
              data = _ref7.data;
              error = _ref7.error;

              if (!error) {
                _context7.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context7.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context7.prev = 11;
              _context7.t0 = _context7["catch"](0);
              return _context7.abrupt("return", {
                data: null,
                error: _context7.t0
              });

            case 14:
            case "end":
              return _context7.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Update user data

  }, {
    key: "updateUserData",
    value: function updateUserData(uid, updates) {
      var _ref8, data, error;

      return regeneratorRuntime.async(function updateUserData$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').update(_objectSpread({}, updates, {
                updated_at: new Date().toISOString()
              })).eq('id', uid));

            case 3:
              _ref8 = _context8.sent;
              data = _ref8.data;
              error = _ref8.error;

              if (!error) {
                _context8.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context8.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context8.prev = 11;
              _context8.t0 = _context8["catch"](0);
              return _context8.abrupt("return", {
                data: null,
                error: _context8.t0
              });

            case 14:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Get events for a user

  }, {
    key: "getUserEvents",
    value: function getUserEvents(uid) {
      var _ref9, data, error;

      return regeneratorRuntime.async(function getUserEvents$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.prev = 0;
              _context9.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('events').select('*').eq('user_id', uid));

            case 3:
              _ref9 = _context9.sent;
              data = _ref9.data;
              error = _ref9.error;

              if (!error) {
                _context9.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context9.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context9.prev = 11;
              _context9.t0 = _context9["catch"](0);
              return _context9.abrupt("return", {
                data: null,
                error: _context9.t0
              });

            case 14:
            case "end":
              return _context9.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Get RSVPs for a user

  }, {
    key: "getUserRSVPs",
    value: function getUserRSVPs(uid) {
      var _ref10, data, error;

      return regeneratorRuntime.async(function getUserRSVPs$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              _context10.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('RSVPs').select("\n          *,\n          events (*)\n        ").eq('user_id', uid));

            case 3:
              _ref10 = _context10.sent;
              data = _ref10.data;
              error = _ref10.error;

              if (!error) {
                _context10.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context10.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context10.prev = 11;
              _context10.t0 = _context10["catch"](0);
              return _context10.abrupt("return", {
                data: null,
                error: _context10.t0
              });

            case 14:
            case "end":
              return _context10.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Create a new event

  }, {
    key: "createEvent",
    value: function createEvent(eventData) {
      var _ref11, data, error;

      return regeneratorRuntime.async(function createEvent$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              _context11.prev = 0;
              _context11.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('events').insert(eventData));

            case 3:
              _ref11 = _context11.sent;
              data = _ref11.data;
              error = _ref11.error;

              if (!error) {
                _context11.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context11.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context11.prev = 11;
              _context11.t0 = _context11["catch"](0);
              return _context11.abrupt("return", {
                data: null,
                error: _context11.t0
              });

            case 14:
            case "end":
              return _context11.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // RSVP to an event

  }, {
    key: "rsvpToEvent",
    value: function rsvpToEvent(userId, eventId) {
      var status,
          _ref12,
          data,
          error,
          _args12 = arguments;

      return regeneratorRuntime.async(function rsvpToEvent$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              status = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : 'going';
              _context12.prev = 1;
              _context12.next = 4;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('RSVPs').upsert({
                user_id: userId,
                event_id: eventId,
                status: status,
                created_at: new Date().toISOString()
              }));

            case 4:
              _ref12 = _context12.sent;
              data = _ref12.data;
              error = _ref12.error;

              if (!error) {
                _context12.next = 9;
                break;
              }

              throw error;

            case 9:
              return _context12.abrupt("return", {
                data: data,
                error: null
              });

            case 12:
              _context12.prev = 12;
              _context12.t0 = _context12["catch"](1);
              return _context12.abrupt("return", {
                data: null,
                error: _context12.t0
              });

            case 15:
            case "end":
              return _context12.stop();
          }
        }
      }, null, null, [[1, 12]]);
    } // Reset password

  }, {
    key: "resetPassword",
    value: function resetPassword(email) {
      var _ref13, error;

      return regeneratorRuntime.async(function resetPassword$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              _context13.prev = 0;
              _context13.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/reset-password'
              }));

            case 3:
              _ref13 = _context13.sent;
              error = _ref13.error;

              if (!error) {
                _context13.next = 7;
                break;
              }

              throw error;

            case 7:
              return _context13.abrupt("return", {
                error: null
              });

            case 10:
              _context13.prev = 10;
              _context13.t0 = _context13["catch"](0);
              return _context13.abrupt("return", {
                error: _context13.t0
              });

            case 13:
            case "end":
              return _context13.stop();
          }
        }
      }, null, null, [[0, 10]]);
    } // Update password

  }, {
    key: "updatePassword",
    value: function updatePassword(newPassword) {
      var _ref14, error;

      return regeneratorRuntime.async(function updatePassword$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.prev = 0;
              _context14.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.updateUser({
                password: newPassword
              }));

            case 3:
              _ref14 = _context14.sent;
              error = _ref14.error;

              if (!error) {
                _context14.next = 7;
                break;
              }

              throw error;

            case 7:
              return _context14.abrupt("return", {
                error: null
              });

            case 10:
              _context14.prev = 10;
              _context14.t0 = _context14["catch"](0);
              return _context14.abrupt("return", {
                error: _context14.t0
              });

            case 13:
            case "end":
              return _context14.stop();
          }
        }
      }, null, null, [[0, 10]]);
    } // Social login

  }, {
    key: "signInWithProvider",
    value: function signInWithProvider(provider) {
      var _ref15, error;

      return regeneratorRuntime.async(function signInWithProvider$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              _context15.prev = 0;
              _context15.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.auth.signInWithOAuth({
                provider: provider.toLowerCase(),
                options: {
                  redirectTo: window.location.origin + '/home'
                }
              }));

            case 3:
              _ref15 = _context15.sent;
              error = _ref15.error;

              if (!error) {
                _context15.next = 7;
                break;
              }

              throw error;

            case 7:
              return _context15.abrupt("return", {
                error: null
              });

            case 10:
              _context15.prev = 10;
              _context15.t0 = _context15["catch"](0);
              return _context15.abrupt("return", {
                error: _context15.t0
              });

            case 13:
            case "end":
              return _context15.stop();
          }
        }
      }, null, null, [[0, 10]]);
    }
  }]);

  return AuthService;
}(); // Auth state listener


exports.AuthService = AuthService;

var authStateListener = function authStateListener(callback) {
  return _supabaseClient.supabase.auth.onAuthStateChange(function (event, session) {
    callback(event, session);
  });
};

exports.authStateListener = authStateListener;
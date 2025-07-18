"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventService = void 0;

var _supabaseClient = require("../supabaseClient");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var EventService =
/*#__PURE__*/
function () {
  function EventService() {
    _classCallCheck(this, EventService);
  }

  _createClass(EventService, null, [{
    key: "getAllEvents",
    // Get all events
    value: function getAllEvents() {
      var _ref, data, error, eventsWithUsers;

      return regeneratorRuntime.async(function getAllEvents$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').select('*').order('start_time', {
                ascending: true
              }));

            case 3:
              _ref = _context2.sent;
              data = _ref.data;
              error = _ref.error;

              if (!error) {
                _context2.next = 8;
                break;
              }

              throw error;

            case 8:
              if (!(data && data.length > 0)) {
                _context2.next = 13;
                break;
              }

              _context2.next = 11;
              return regeneratorRuntime.awrap(Promise.all(data.map(function _callee(event) {
                var _ref2, userData;

                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!event.host_id) {
                          _context.next = 6;
                          break;
                        }

                        _context.next = 3;
                        return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('id, full_name, email').eq('id', event.host_id).single());

                      case 3:
                        _ref2 = _context.sent;
                        userData = _ref2.data;
                        return _context.abrupt("return", _objectSpread({}, event, {
                          users: userData || null
                        }));

                      case 6:
                        return _context.abrupt("return", event);

                      case 7:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              })));

            case 11:
              eventsWithUsers = _context2.sent;
              return _context2.abrupt("return", {
                data: eventsWithUsers,
                error: null
              });

            case 13:
              return _context2.abrupt("return", {
                data: data || [],
                error: null
              });

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](0);
              return _context2.abrupt("return", {
                data: null,
                error: _context2.t0
              });

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, null, null, [[0, 16]]);
    } // Get event by ID

  }, {
    key: "getEventById",
    value: function getEventById(eventId) {
      var _ref3, data, error, eventWithUser, _ref4, userData;

      return regeneratorRuntime.async(function getEventById$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').select('*').eq('id', eventId).single());

            case 3:
              _ref3 = _context3.sent;
              data = _ref3.data;
              error = _ref3.error;

              if (!error) {
                _context3.next = 8;
                break;
              }

              throw error;

            case 8:
              // Fetch user data for the event
              eventWithUser = data;

              if (!(data && data.host_id)) {
                _context3.next = 15;
                break;
              }

              _context3.next = 12;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('id, full_name, email').eq('id', data.host_id).single());

            case 12:
              _ref4 = _context3.sent;
              userData = _ref4.data;
              eventWithUser = _objectSpread({}, data, {
                users: userData || null
              });

            case 15:
              return _context3.abrupt("return", {
                data: eventWithUser,
                error: null
              });

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](0);
              return _context3.abrupt("return", {
                data: null,
                error: _context3.t0
              });

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, null, null, [[0, 18]]);
    } // Create a new event

  }, {
    key: "createEvent",
    value: function createEvent(eventData) {
      var _ref5, data, error;

      return regeneratorRuntime.async(function createEvent$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.prev = 0;
              _context4.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').insert(eventData).select().single());

            case 3:
              _ref5 = _context4.sent;
              data = _ref5.data;
              error = _ref5.error;

              if (!error) {
                _context4.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context4.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context4.prev = 11;
              _context4.t0 = _context4["catch"](0);
              return _context4.abrupt("return", {
                data: null,
                error: _context4.t0
              });

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Update an event

  }, {
    key: "updateEvent",
    value: function updateEvent(eventId, updates) {
      var _ref6, data, error;

      return regeneratorRuntime.async(function updateEvent$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.prev = 0;
              _context5.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').update(updates).eq('id', eventId).select().single());

            case 3:
              _ref6 = _context5.sent;
              data = _ref6.data;
              error = _ref6.error;

              if (!error) {
                _context5.next = 8;
                break;
              }

              throw error;

            case 8:
              return _context5.abrupt("return", {
                data: data,
                error: null
              });

            case 11:
              _context5.prev = 11;
              _context5.t0 = _context5["catch"](0);
              return _context5.abrupt("return", {
                data: null,
                error: _context5.t0
              });

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, null, null, [[0, 11]]);
    } // Delete an event

  }, {
    key: "deleteEvent",
    value: function deleteEvent(eventId) {
      var _ref7, error;

      return regeneratorRuntime.async(function deleteEvent$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.prev = 0;
              _context6.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events')["delete"]().eq('id', eventId));

            case 3:
              _ref7 = _context6.sent;
              error = _ref7.error;

              if (!error) {
                _context6.next = 7;
                break;
              }

              throw error;

            case 7:
              return _context6.abrupt("return", {
                error: null
              });

            case 10:
              _context6.prev = 10;
              _context6.t0 = _context6["catch"](0);
              return _context6.abrupt("return", {
                error: _context6.t0
              });

            case 13:
            case "end":
              return _context6.stop();
          }
        }
      }, null, null, [[0, 10]]);
    } // RSVP to an event

  }, {
    key: "rsvpToEvent",
    value: function rsvpToEvent(userId, eventId) {
      var _ref8, data, error;

      return regeneratorRuntime.async(function rsvpToEvent$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.prev = 0;
              _context7.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('RSVPs').upsert({
                user_id: userId,
                event_id: eventId,
                created_at: new Date().toISOString()
              }).select().single());

            case 3:
              _ref8 = _context7.sent;
              data = _ref8.data;
              error = _ref8.error;

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
    } // Remove RSVP

  }, {
    key: "removeRSVP",
    value: function removeRSVP(userId, eventId) {
      var _ref9, error;

      return regeneratorRuntime.async(function removeRSVP$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.prev = 0;
              _context8.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('RSVPs')["delete"]().eq('user_id', userId).eq('event_id', eventId));

            case 3:
              _ref9 = _context8.sent;
              error = _ref9.error;

              if (!error) {
                _context8.next = 7;
                break;
              }

              throw error;

            case 7:
              return _context8.abrupt("return", {
                error: null
              });

            case 10:
              _context8.prev = 10;
              _context8.t0 = _context8["catch"](0);
              return _context8.abrupt("return", {
                error: _context8.t0
              });

            case 13:
            case "end":
              return _context8.stop();
          }
        }
      }, null, null, [[0, 10]]);
    } // Get RSVPs for an event

  }, {
    key: "getEventRSVPs",
    value: function getEventRSVPs(eventId) {
      var _ref10, data, error, rsvpsWithUsers;

      return regeneratorRuntime.async(function getEventRSVPs$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              _context10.prev = 0;
              _context10.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('RSVPs').select('*').eq('event_id', eventId));

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
              if (!(data && data.length > 0)) {
                _context10.next = 13;
                break;
              }

              _context10.next = 11;
              return regeneratorRuntime.awrap(Promise.all(data.map(function _callee2(rsvp) {
                var _ref11, userData;

                return regeneratorRuntime.async(function _callee2$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        if (!rsvp.user_id) {
                          _context9.next = 6;
                          break;
                        }

                        _context9.next = 3;
                        return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('id, full_name, email').eq('id', rsvp.user_id).single());

                      case 3:
                        _ref11 = _context9.sent;
                        userData = _ref11.data;
                        return _context9.abrupt("return", _objectSpread({}, rsvp, {
                          users: userData || null
                        }));

                      case 6:
                        return _context9.abrupt("return", rsvp);

                      case 7:
                      case "end":
                        return _context9.stop();
                    }
                  }
                });
              })));

            case 11:
              rsvpsWithUsers = _context10.sent;
              return _context10.abrupt("return", {
                data: rsvpsWithUsers,
                error: null
              });

            case 13:
              return _context10.abrupt("return", {
                data: data || [],
                error: null
              });

            case 16:
              _context10.prev = 16;
              _context10.t0 = _context10["catch"](0);
              return _context10.abrupt("return", {
                data: null,
                error: _context10.t0
              });

            case 19:
            case "end":
              return _context10.stop();
          }
        }
      }, null, null, [[0, 16]]);
    } // Get user's RSVPs

  }, {
    key: "getUserRSVPs",
    value: function getUserRSVPs(userId) {
      var _ref12, data, error, rsvpsWithEvents;

      return regeneratorRuntime.async(function getUserRSVPs$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              _context12.prev = 0;
              _context12.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('RSVPs').select('*').eq('user_id', userId));

            case 3:
              _ref12 = _context12.sent;
              data = _ref12.data;
              error = _ref12.error;

              if (!error) {
                _context12.next = 8;
                break;
              }

              throw error;

            case 8:
              if (!(data && data.length > 0)) {
                _context12.next = 13;
                break;
              }

              _context12.next = 11;
              return regeneratorRuntime.awrap(Promise.all(data.map(function _callee3(rsvp) {
                var _ref13, eventData;

                return regeneratorRuntime.async(function _callee3$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        if (!rsvp.event_id) {
                          _context11.next = 6;
                          break;
                        }

                        _context11.next = 3;
                        return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events') // Use correct table name with capital E
                        .select('*').eq('id', rsvp.event_id).single());

                      case 3:
                        _ref13 = _context11.sent;
                        eventData = _ref13.data;
                        return _context11.abrupt("return", _objectSpread({}, rsvp, {
                          events: eventData || null
                        }));

                      case 6:
                        return _context11.abrupt("return", rsvp);

                      case 7:
                      case "end":
                        return _context11.stop();
                    }
                  }
                });
              })));

            case 11:
              rsvpsWithEvents = _context12.sent;
              return _context12.abrupt("return", {
                data: rsvpsWithEvents,
                error: null
              });

            case 13:
              return _context12.abrupt("return", {
                data: data || [],
                error: null
              });

            case 16:
              _context12.prev = 16;
              _context12.t0 = _context12["catch"](0);
              return _context12.abrupt("return", {
                data: null,
                error: _context12.t0
              });

            case 19:
            case "end":
              return _context12.stop();
          }
        }
      }, null, null, [[0, 16]]);
    } // Search events

  }, {
    key: "searchEvents",
    value: function searchEvents(searchTerm) {
      var _ref14, data, error, eventsWithUsers;

      return regeneratorRuntime.async(function searchEvents$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              _context14.prev = 0;
              _context14.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').select('*').or("title.ilike.%".concat(searchTerm, "%,description.ilike.%").concat(searchTerm, "%")).order('start_time', {
                ascending: true
              }));

            case 3:
              _ref14 = _context14.sent;
              data = _ref14.data;
              error = _ref14.error;

              if (!error) {
                _context14.next = 8;
                break;
              }

              throw error;

            case 8:
              if (!(data && data.length > 0)) {
                _context14.next = 13;
                break;
              }

              _context14.next = 11;
              return regeneratorRuntime.awrap(Promise.all(data.map(function _callee4(event) {
                var _ref15, userData;

                return regeneratorRuntime.async(function _callee4$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        if (!event.host_id) {
                          _context13.next = 6;
                          break;
                        }

                        _context13.next = 3;
                        return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('id, full_name, email').eq('id', event.host_id).single());

                      case 3:
                        _ref15 = _context13.sent;
                        userData = _ref15.data;
                        return _context13.abrupt("return", _objectSpread({}, event, {
                          users: userData || null
                        }));

                      case 6:
                        return _context13.abrupt("return", event);

                      case 7:
                      case "end":
                        return _context13.stop();
                    }
                  }
                });
              })));

            case 11:
              eventsWithUsers = _context14.sent;
              return _context14.abrupt("return", {
                data: eventsWithUsers,
                error: null
              });

            case 13:
              return _context14.abrupt("return", {
                data: data || [],
                error: null
              });

            case 16:
              _context14.prev = 16;
              _context14.t0 = _context14["catch"](0);
              return _context14.abrupt("return", {
                data: null,
                error: _context14.t0
              });

            case 19:
            case "end":
              return _context14.stop();
          }
        }
      }, null, null, [[0, 16]]);
    } // Get events by category

  }, {
    key: "getEventsByCategory",
    value: function getEventsByCategory(category) {
      var _ref16, data, error, eventsWithUsers;

      return regeneratorRuntime.async(function getEventsByCategory$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              _context16.prev = 0;
              _context16.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').select('*').eq('college_tag', category) // Use college_tag instead of category
              .order('start_time', {
                ascending: true
              }));

            case 3:
              _ref16 = _context16.sent;
              data = _ref16.data;
              error = _ref16.error;

              if (!error) {
                _context16.next = 8;
                break;
              }

              throw error;

            case 8:
              if (!(data && data.length > 0)) {
                _context16.next = 13;
                break;
              }

              _context16.next = 11;
              return regeneratorRuntime.awrap(Promise.all(data.map(function _callee5(event) {
                var _ref17, userData;

                return regeneratorRuntime.async(function _callee5$(_context15) {
                  while (1) {
                    switch (_context15.prev = _context15.next) {
                      case 0:
                        if (!event.host_id) {
                          _context15.next = 6;
                          break;
                        }

                        _context15.next = 3;
                        return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('id, full_name, email').eq('id', event.host_id).single());

                      case 3:
                        _ref17 = _context15.sent;
                        userData = _ref17.data;
                        return _context15.abrupt("return", _objectSpread({}, event, {
                          users: userData || null
                        }));

                      case 6:
                        return _context15.abrupt("return", event);

                      case 7:
                      case "end":
                        return _context15.stop();
                    }
                  }
                });
              })));

            case 11:
              eventsWithUsers = _context16.sent;
              return _context16.abrupt("return", {
                data: eventsWithUsers,
                error: null
              });

            case 13:
              return _context16.abrupt("return", {
                data: data || [],
                error: null
              });

            case 16:
              _context16.prev = 16;
              _context16.t0 = _context16["catch"](0);
              return _context16.abrupt("return", {
                data: null,
                error: _context16.t0
              });

            case 19:
            case "end":
              return _context16.stop();
          }
        }
      }, null, null, [[0, 16]]);
    } // Get upcoming events

  }, {
    key: "getUpcomingEvents",
    value: function getUpcomingEvents() {
      var _ref18, data, error, eventsWithUsers;

      return regeneratorRuntime.async(function getUpcomingEvents$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.prev = 0;
              _context18.next = 3;
              return regeneratorRuntime.awrap(_supabaseClient.supabase.from('Events').select('*').gte('start_time', new Date().toISOString()).order('start_time', {
                ascending: true
              }));

            case 3:
              _ref18 = _context18.sent;
              data = _ref18.data;
              error = _ref18.error;

              if (!error) {
                _context18.next = 8;
                break;
              }

              throw error;

            case 8:
              if (!(data && data.length > 0)) {
                _context18.next = 13;
                break;
              }

              _context18.next = 11;
              return regeneratorRuntime.awrap(Promise.all(data.map(function _callee6(event) {
                var _ref19, userData;

                return regeneratorRuntime.async(function _callee6$(_context17) {
                  while (1) {
                    switch (_context17.prev = _context17.next) {
                      case 0:
                        if (!event.host_id) {
                          _context17.next = 6;
                          break;
                        }

                        _context17.next = 3;
                        return regeneratorRuntime.awrap(_supabaseClient.supabase.from('users').select('id, full_name, email').eq('id', event.host_id).single());

                      case 3:
                        _ref19 = _context17.sent;
                        userData = _ref19.data;
                        return _context17.abrupt("return", _objectSpread({}, event, {
                          users: userData || null
                        }));

                      case 6:
                        return _context17.abrupt("return", event);

                      case 7:
                      case "end":
                        return _context17.stop();
                    }
                  }
                });
              })));

            case 11:
              eventsWithUsers = _context18.sent;
              return _context18.abrupt("return", {
                data: eventsWithUsers,
                error: null
              });

            case 13:
              return _context18.abrupt("return", {
                data: data || [],
                error: null
              });

            case 16:
              _context18.prev = 16;
              _context18.t0 = _context18["catch"](0);
              return _context18.abrupt("return", {
                data: null,
                error: _context18.t0
              });

            case 19:
            case "end":
              return _context18.stop();
          }
        }
      }, null, null, [[0, 16]]);
    }
  }]);

  return EventService;
}();

exports.EventService = EventService;
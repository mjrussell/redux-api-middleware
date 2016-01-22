'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actionWith = exports.normalizeTypeDescriptors = exports.getJSON = undefined;

var _errors = require('./errors');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * Extract JSON body from a server response
 *
 * @function getJSON
 * @access public
 * @param {object} res - A raw response object
 * @returns {promise|undefined}
 */

var getJSON = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(res) {
    var contentType;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            contentType = res.headers.get('Content-Type');

            if (!(contentType && ~contentType.indexOf('json'))) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return res.json();

          case 4:
            return _context.abrupt('return', _context.sent);

          case 7:
            _context.next = 9;
            return Promise.resolve();

          case 9:
            return _context.abrupt('return', _context.sent);

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getJSON(_x) {
    return ref.apply(this, arguments);
  };
}();

/**
 * Blow up string or symbol types into full-fledged type descriptors,
 *   and add defaults
 *
 * @function normalizeTypeDescriptors
 * @access private
 * @param {array} types - The [CALL_API].types from a validated RSAA
 * @returns {array}
 */

function normalizeTypeDescriptors(types) {
  var _types = _slicedToArray(types, 3);

  var requestType = _types[0];
  var successType = _types[1];
  var failureType = _types[2];

  if (typeof requestType === 'string' || (typeof requestType === 'undefined' ? 'undefined' : _typeof(requestType)) === 'symbol') {
    requestType = { type: requestType };
  }

  if (typeof successType === 'string' || (typeof successType === 'undefined' ? 'undefined' : _typeof(successType)) === 'symbol') {
    successType = { type: successType };
  }
  successType = _extends({
    payload: function payload(action, state, res) {
      return getJSON(res);
    }
  }, successType);

  if (typeof failureType === 'string' || (typeof failureType === 'undefined' ? 'undefined' : _typeof(failureType)) === 'symbol') {
    failureType = { type: failureType };
  }
  failureType = _extends({
    payload: function payload(action, state, res) {
      return getJSON(res).then(function (json) {
        return new _errors.ApiError(res.status, res.statusText, json);
      });
    }
  }, failureType);

  return [requestType, successType, failureType];
}

/**
 * Evaluate a type descriptor to an FSA
 *
 * @function actionWith
 * @access private
 * @param {object} descriptor - A type descriptor
 * @param {array} args - The array of arguments for `payload` and `meta` function properties
 * @returns {object}
 */

var actionWith = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(descriptor, args) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return typeof descriptor.payload === 'function' ? descriptor.payload.apply(descriptor, _toConsumableArray(args)) : descriptor.payload;

          case 3:
            descriptor.payload = _context2.sent;
            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](0);

            descriptor.payload = new _errors.InternalError(_context2.t0.message);
            descriptor.error = true;

          case 10:
            _context2.prev = 10;
            _context2.next = 13;
            return typeof descriptor.meta === 'function' ? descriptor.meta.apply(descriptor, _toConsumableArray(args)) : descriptor.meta;

          case 13:
            descriptor.meta = _context2.sent;
            _context2.next = 21;
            break;

          case 16:
            _context2.prev = 16;
            _context2.t1 = _context2['catch'](10);

            delete descriptor.meta;
            descriptor.payload = new _errors.InternalError(_context2.t1.message);
            descriptor.error = true;

          case 21:
            return _context2.abrupt('return', descriptor);

          case 22:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 6], [10, 16]]);
  }));

  return function actionWith(_x2, _x3) {
    return ref.apply(this, arguments);
  };
}();

exports.getJSON = getJSON;
exports.normalizeTypeDescriptors = normalizeTypeDescriptors;
exports.actionWith = actionWith;
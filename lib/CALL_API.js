'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Symbol key that carries API call info interpreted by this Redux middleware.
 *
 * @constant {symbol}
 * @access public
 * @default
 */
var CALL_API = Symbol('Call API');

exports.default = CALL_API;
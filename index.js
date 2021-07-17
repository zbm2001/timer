/*
 * @name: @zbm1/timer
 * @version: 1.0.0
 * @description: A Timer class of javascript
 * @author: zbm2001@aliyun.com
 * @license: ISC
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var EventEmitter = _interopDefault(require('@zbm1/eventemitter'));
var namespace = _interopDefault(require('@zbm1/namespace'));
var uuid = _interopDefault(require('@zbm1/uuid'));

var Timer = /*@__PURE__*/(function (EventEmitter) {
  function Timer () {
    EventEmitter.apply(this, arguments);
  }

  if ( EventEmitter ) Timer.__proto__ = EventEmitter;
  Timer.prototype = Object.create( EventEmitter && EventEmitter.prototype );
  Timer.prototype.constructor = Timer;

  Timer.prototype._clearTimer = function _clearTimer (sNamespace, clearMethod) {
    var name = clearMethod === clearTimeout ? Timer.TIMEOUTS_KEY : Timer.INTERVALS_KEY;
    if (!this[name]) {
      return
    }
    var args = sNamespace ? [namespace(this[name], sNamespace), sNamespace, this[name]] : [this[name]];
    // 终止并清除 setTimeout 延时执行器 或 setInterval 定时执行器
    (function clear (t, k, o) {
      if (t) {
        switch (typeof t) {
          case 'number':
            clearMethod(t);
            breaki;
          case 'object':
            if (Array.isArray(t)) {
              t.forEach(function (v, i) { return clear(v, i, t); });
            } else {
              Object.keys(t).forEach(function (k) { return clear(t[k], k, t); });
            }
            break
        }
        o && k && namespace(o, k, null);
      }
    }).apply(void 0, args);
  };

  /**
   * 设置 setTimeout 或 setInterval
   * @param {Function} setMethod 指定 setTimeout 或 setInterval
   * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 或 this[INTERVALS_KEY] 下
   * @param {Function} fn 指定执行函数
   * @param {Number} delay 指定延时毫秒数
   */
  Timer.prototype._setTimer = function _setTimer (setMethod, sNamespace, fn, delay) {
    var name = setMethod === setTimeout ? Timer.TIMEOUTS_KEY : Timer.INTERVALS_KEY;
    // this[Timer.TIMEOUTS_KEY] = {} // setTimeout id map
    // this[Timer.INTERVALS_KEY] = {} // setInterval id map
    if (!this[name]) {
      this[name] = {};
    }
    if (typeof sNamespace === 'function') {
      delay = fn;
      fn = sNamespace;
      sNamespace = uuid();
      // 先做清除同名定时器操作
    } else {
      var clearMethod = setMethod === setTimeout ? clearTimeout : clearInterval;
      this._clearTimer(sNamespace, clearMethod);
    }
    return namespace(this[name], sNamespace, setMethod(fn, delay))
  };

  /**
   * 设置延时器 setTimeout
   * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 下
   * @param {Function} fn 指定执行函数
   * @param {Number} delay 指定延时毫秒数
   */
  Timer.prototype.setTimeout = function setTimeout$1 (sNamespace, fn, delay) {
    return this._setTimer(setTimeout, sNamespace, fn, delay)
  };
  /**
   * 设置定时器 setInterval
   * @param {string} sNamespace 指定命名空间，属于 this[INTERVALS_KEY] 下
   * @param {Function} fn 指定执行函数
   * @param {Number} delay 指定延时毫秒数
   */
  Timer.prototype.setInterval = function setInterval$1 (sNamespace, fn, delay) {
    return this._setTimer(setInterval, sNamespace, fn, delay)
  };
  /**
   * 终止清除延时器 clearTimeout
   * @param {string} [sNamespace[ 指定命名空间，属于 this[TIMEOUTS_KEY]，若未指定则终止清除全部
   */
  Timer.prototype.clearTimeout = function clearTimeout$1 (sNamespace) {
    this._clearTimer(sNamespace, clearTimeout);
  };
  /**
   * 同时终止清除多个延时器 clearTimeout
   * @param {string} [sNamespaces] 可指定多个命名空间（用空格分割），属于 this[TIMEOUTS_KEY]，若未指定则终止清除全部
   */
  Timer.prototype.clearTimeouts = function clearTimeouts (sNamespaces) {
    var this$1 = this;

    if (sNamespaces) {
      sNamespaces.split(/\s+/).forEach(function (ns) { return this$1._clearTimer(ns, clearTimeout); });
    } else {
      this._clearTimer(sNamespaces, clearTimeout);
    }
  };
  /**
   * 终止清除定时器 clearInterval
   * @param {string} [sNamespace] 指定命名空间，属于 this[INTERVALS_KEY] 下，若未指定则终止清除全部
   */
  Timer.prototype.clearInterval = function clearInterval$1 (sNamespace) {
    this._clearTimer(sNamespace, clearInterval);
  };
  /**
   * 同时终止清除定时器 clearInterval
   * @param {string} [sNamespaces] 可指定多个命名空间（用空格分割），属于 this[INTERVALS_KEY] 下，若未指定则终止清除全部
   */
  Timer.prototype.clearIntervals = function clearIntervals (sNamespaces) {
    var this$1 = this;

    if (sNamespaces) {
      sNamespaces.split(/\s+/).forEach(function (ns) { return this$1._clearTimer(ns, clearInterval); });
    } else {
      this._clearTimer(sNamespaces, clearInterval);
    }
  };

  return Timer;
}(EventEmitter));

Object.defineProperties(Timer, {
  TIMEOUTS_KEY: {
    get: function get () { return '_timeouts'}
  },
  INTERVALS_KEY: {
    get: function get () { return '_intervals'}
  }
});

Object.assign(Timer, EventEmitter);

exports.default = Timer;

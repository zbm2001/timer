/*
 * @name: @zbm1/timer
 * @version: 0.1.0
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

// 递归终止并清除 setTimeout 延时执行器 或 setInterval 定时执行器
function recursionClear (clearMethod, t, k, o) {
  if (t) {
    switch (typeof t) {
      case 'number':
        clearMethod(t);
        break
      case 'object':
        if (Array.isArray(t)) {
          t.forEach(function (v, i) { return recursionClear(clearMethod, v, i, t); });
        } else {
          Object.keys(t).forEach(function (k) { return recursionClear(clearMethod, t[k], k, t); });
        }
        break
    }
    o && k && namespace(o, k, null);
  }
}

function Timer () {
}

Timer.TIMEOUTS_KEY = '_timeouts';
Timer.INTERVALS_KEY = '_intervals';

EventEmitter.inherito(Timer, {
    /**
     * 终止清除 clearTimeout 或 clearInterval
     * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 或 this[INTERVALS_KEY] 下
     * @param {Function} clearMethod 指定 clearTimeout 或 clearInterval
     */
    _clearTimer: function _clearTimer (sNamespace, clearMethod) {
      var this$1 = this;

      var ct = {
        name: Timer.TIMEOUTS_KEY,
        clearMethod: clearTimeout
      };
      var ci = {
        name: Timer.INTERVALS_KEY,
        clearMethod: clearInterval
      };
      var arr = clearMethod === clearTimeout
        ? [ct]
        : clearMethod === clearInterval
          ? [ci]
          : [ct, ci];

      var sNamespaces = sNamespace && sNamespace.trim();
      sNamespaces && (sNamespaces = sNamespaces.split(/\s+/));

      var forEach = sNamespaces
        ? function (ref) {
          var name = ref.name;
          var clearMethod = ref.clearMethod;

          return sNamespaces.forEach(function (sNamespace) {
          recursionClear(clearMethod, namespace(this$1[name], sNamespace), sNamespace, this$1[name]);
        });
      }
        : function (ref) {
          var name = ref.name;
          var clearMethod = ref.clearMethod;

          return recursionClear(clearMethod, this$1[name]);
      };

      arr.forEach(forEach);
    },

    /**
     * 设置 setTimeout 或 setInterval
     * @param {Function} setMethod 指定 setTimeout 或 setInterval
     * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 或 this[INTERVALS_KEY] 下
     * @param {Function} fn 指定执行函数
     * @param {Number} delay 指定延时毫秒数
     */
    _setTimer: function _setTimer (setMethod, sNamespace, fn, delay) {
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
    },

    /**
     * 设置延时器 setTimeout
     * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 下
     * @param {Function} fn 指定执行函数
     * @param {Number} delay 指定延时毫秒数
     */
    setTimeout: function setTimeout$1 (sNamespace, fn, delay) {
      return this._setTimer(setTimeout, sNamespace, fn, delay)
    },

    /**
     * 设置定时器 setInterval
     * @param {string} sNamespace 指定命名空间，属于 this[INTERVALS_KEY] 下
     * @param {Function} fn 指定执行函数
     * @param {Number} delay 指定延时毫秒数
     */
    setInterval: function setInterval$1 (sNamespace, fn, delay) {
      return this._setTimer(setInterval, sNamespace, fn, delay)
    },

    /**
     * 终止清除延时器 clearTimeout
     * @param {string} [sNamespace] 指定命名空间，属于 this[TIMEOUTS_KEY]，若未指定则终止清除全部
     *                              可指定多个命名空间（用空格分割）
     */
    clearTimeout: function clearTimeout$1 (sNamespace) {
      this._clearTimer(sNamespace, clearTimeout);
    },

    /**
     * 终止清除定时器 clearInterval
     * @param {string} [sNamespace] 指定命名空间，属于 this[INTERVALS_KEY] 下，若未指定则终止清除全部
     *                              可指定多个命名空间（用空格分割）
     */
    clearInterval: function clearInterval$1 (sNamespace) {
      this._clearTimer(sNamespace, clearInterval);
    },

    /**
     * 终止清除定时器 clearTimerAll
     * @param {string|undefined} [sNamespace] 指定命名空间，属于 this[INTERVALS_KEY] 下，若未指定则终止清除全部
     *                              可指定多个命名空间（用空格分割）
     */
    clearTimerAll: function clearTimerAll () {
      this._clearTimer();
    }
  },
  EventEmitter);

exports.default = Timer;

import EventEmitter from '@zbm1/eventemitter'
import namespace from '@zbm1/namespace'
import uuid from '@zbm1/uuid'

export default class Timer extends EventEmitter {
  // private _timeouts = {}
  // private _intervals = {}
  /**
   * 终止清除 clearTimeout 或 clearInterval
   * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 或 this[INTERVALS_KEY] 下
   * @param {Function} clearMethod 指定 clearTimeout 或 clearInterval
   */
  _clearTimer (sNamespace, clearMethod) {
    let name = clearMethod === clearTimeout ? Timer.TIMEOUTS_KEY : Timer.INTERVALS_KEY
    if (!this[name]) {
      return
    }
    let args = sNamespace ? [namespace(this[name], sNamespace), sNamespace, this[name]] : [this[name]];
    // 终止并清除 setTimeout 延时执行器 或 setInterval 定时执行器
    (function clear (t, k, o) {
      if (t) {
        switch (typeof t) {
          case 'number':
            clearMethod(t)
            breaki
          case 'object':
            if (Array.isArray(t)) {
              t.forEach((v, i) => clear(v, i, t))
            } else {
              Object.keys(t).forEach(k => clear(t[k], k, t))
            }
            break
        }
        o && k && namespace(o, k, null)
      }
    })(...args)
  }

  /**
   * 设置 setTimeout 或 setInterval
   * @param {Function} setMethod 指定 setTimeout 或 setInterval
   * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 或 this[INTERVALS_KEY] 下
   * @param {Function} fn 指定执行函数
   * @param {Number} delay 指定延时毫秒数
   */
  _setTimer (setMethod, sNamespace, fn, delay) {
    let name = setMethod === setTimeout ? Timer.TIMEOUTS_KEY : Timer.INTERVALS_KEY
    // this[Timer.TIMEOUTS_KEY] = {} // setTimeout id map
    // this[Timer.INTERVALS_KEY] = {} // setInterval id map
    if (!this[name]) {
      this[name] = {}
    }
    if (typeof sNamespace === 'function') {
      delay = fn
      fn = sNamespace
      sNamespace = uuid()
      // 先做清除同名定时器操作
    } else {
      let clearMethod = setMethod === setTimeout ? clearTimeout : clearInterval
      this._clearTimer(sNamespace, clearMethod)
    }
    return namespace(this[name], sNamespace, setMethod(fn, delay))
  }

  /**
   * 设置延时器 setTimeout
   * @param {string} sNamespace 指定命名空间，属于 this[TIMEOUTS_KEY] 下
   * @param {Function} fn 指定执行函数
   * @param {Number} delay 指定延时毫秒数
   */
  setTimeout (sNamespace, fn, delay) {
    return this._setTimer(setTimeout, sNamespace, fn, delay)
  }
  /**
   * 设置定时器 setInterval
   * @param {string} sNamespace 指定命名空间，属于 this[INTERVALS_KEY] 下
   * @param {Function} fn 指定执行函数
   * @param {Number} delay 指定延时毫秒数
   */
  setInterval (sNamespace, fn, delay) {
    return this._setTimer(setInterval, sNamespace, fn, delay)
  }
  /**
   * 终止清除延时器 clearTimeout
   * @param {string} [sNamespace[ 指定命名空间，属于 this[TIMEOUTS_KEY]，若未指定则终止清除全部
   */
  clearTimeout (sNamespace) {
    this._clearTimer(sNamespace, clearTimeout)
  }
  /**
   * 同时终止清除多个延时器 clearTimeout
   * @param {string} [sNamespaces] 可指定多个命名空间（用空格分割），属于 this[TIMEOUTS_KEY]，若未指定则终止清除全部
   */
  clearTimeouts (sNamespaces) {
    if (sNamespaces) {
      sNamespaces.split(/\s+/).forEach(ns => this._clearTimer(ns, clearTimeout))
    } else {
      this._clearTimer(sNamespaces, clearTimeout)
    }
  }
  /**
   * 终止清除定时器 clearInterval
   * @param {string} [sNamespace] 指定命名空间，属于 this[INTERVALS_KEY] 下，若未指定则终止清除全部
   */
  clearInterval (sNamespace) {
    this._clearTimer(sNamespace, clearInterval)
  }
  /**
   * 同时终止清除定时器 clearInterval
   * @param {string} [sNamespaces] 可指定多个命名空间（用空格分割），属于 this[INTERVALS_KEY] 下，若未指定则终止清除全部
   */
  clearIntervals (sNamespaces) {
    if (sNamespaces) {
      sNamespaces.split(/\s+/).forEach(ns => this._clearTimer(ns, clearInterval))
    } else {
      this._clearTimer(sNamespaces, clearInterval)
    }
  }
}

Object.defineProperties(Timer, {
  TIMEOUTS_KEY: {
    get () { return '_timeouts'}
  },
  INTERVALS_KEY: {
    get () { return '_intervals'}
  }
})

Object.assign(Timer, EventEmitter)

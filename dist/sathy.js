// Sathy.js
// version: 0.0.1
// author: Saiya Lee
// license: MIT
(function() {
  var Sathy, arr, doc,
    __hasProp = {}.hasOwnProperty,
    __slice = [].slice;

  doc = window.document;

  arr = [];

  Sathy = (function() {
    function Sathy(selector) {
      if (!(this instanceof Sathy)) {
        return new Sathy(selector);
      }
      this.init(selector);
    }

    Sathy.prototype.length = 0;

    Sathy.prototype.splice = arr.splice;

    Sathy.prototype.push = arr.push;

    Sathy.prototype.sort = arr.push;

    Sathy.prototype.init = function(selector) {
      if (selector instanceof Sathy) {
        return selector;
      }
      if (selector instanceof HTMLElement) {
        return this.push.apply(this([selector]));
      } else {
        return this.push.apply(this, arr.slice.call(doc.querySelectorAll(selector)));
      }
    };

    return Sathy;

  })();

  Sathy.isWindow = function(obj) {
    return (obj != null) && obj.window && obj === obj.window;
  };


  /**
   * extend obj
   * @param  {obj} dest   dest to copy
   * @param  {Object} source prop from
   * @return {Object}        result Object
   */

  Sathy.prototype.extend = Sathy.extend = function(dest, source) {
    var args, i, k, ride, v;
    args = [].slice.call(arguments);
    ride = typeof args[args.length - 1] === 'boolean' ? args.pop() : true;
    i = 1;
    if (args.length === 1) {
      dest = !Sathy.isWindow(this) ? this : {};
      i = 0;
    }
    while (source = args[i++]) {
      for (k in source) {
        v = source[k];
        if (ride || !(k in dest)) {
          dest[k] = v;
        }
      }
    }
    return dest;
  };

  Sathy.extend({
    isArray: function(val) {
      return toString.call(val) === '[object Array]';
    },
    isArrayLike: function(val) {
      return val && (this.isArray(val) || ((val.length >> 0) === val.length && val.length >= 0 && (val.length - 1) in val));
    },
    isFunction: function(fn) {
      return fn && 'apply' in fn && /\bfunction\b/.test(fn);
    },
    makeArray: function(arr) {
      var ret, v, _i, _len;
      ret = [];
      if (Sathy.isArrayLike(arr)) {
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          v = arr[_i];
          ret.push(v);
        }
      }
      return ret;
    },

    /**
     * excute a fn on every element in an array
     * @param  {Array}   arr      array like object
     * @param  {Function} fn      works on array elements
     * @param  {Object}   context fn's excute context
     * @return {undefined}
     */
    each: function(arr, fn, context) {
      var k, v, _i, _len;
      if (arr && fn) {
        if (this.isArrayLike(arr)) {
          for (k = _i = 0, _len = arr.length; _i < _len; k = ++_i) {
            v = arr[k];
            fn.call(context || v, v, k);
          }
        } else {
          for (k in arr) {
            if (!__hasProp.call(arr, k)) continue;
            v = arr[k];
            fn.call(context || v, v, k);
          }
        }
      }
    },

    /**
     * just like array, but return an array of result
     * @param  {Array}   arr      an array like object
     * @param  {Function} fn      works on array elements
     * @param  {object}   context fn's excute context,
     *                            if ommit, it will be array's element
     * @return {Array}           result
     */
    map: function(arr, fn, context) {
      var k, res, v, _i, _len;
      res = [];
      if (arr && fn) {
        if (this.isArrayLike(arr)) {
          for (k = _i = 0, _len = arr.length; _i < _len; k = ++_i) {
            v = arr[k];
            res.push(fn.call(context || v, v, k));
          }
        } else {
          for (k in arr) {
            if (!__hasProp.call(arr, k)) continue;
            v = arr[k];
            res.push(fn.call(context || v, v, k));
          }
        }
      }
      return res;
    },

    /**
     * generate random string, contains alphabet in lowercase and numbers
     * @param  {Number} len string length, default 16
     * @return {String}     random string
     */
    randomStr: function(len) {
      var str;
      str = '';
      len = len || 16;
      while (true) {
        str += Math.random().toString(32).substr(2);
        if (str.length >= len) {
          break;
        }
      }
      return str.substr(0, len);
    },
    ltrim: function(str) {
      if (str != null) {
        return (str + '').replace(/^\s+/, '');
      } else {
        return '';
      }
    },
    rtrim: function(str) {
      if (str != null) {
        return (str + '').replace(/\s+$/, '');
      } else {
        return '';
      }
    },
    trim: function(str) {
      if (str != null) {
        return (str + '').replace(/^\s+|\s+$/g, '');
      } else {
        return '';
      }
    },

    /**
     * setup a function step by step
     * @param  {Function} fn            fn to setup
     * @param  {arguments}   storedArgs... partial arguments of fn
     * @return {Funtion}                 partial applied fn
     */
    curry: function() {
      var fn, storedArgs;
      fn = arguments[0], storedArgs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (!Sathy.isFunction(fn)) {
        return;
      }
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args = storedArgs.concat(args);
        return fn.apply(null, args);
      };
    }
  });

  Sathy.prototype.extend({
    each: function(fn) {
      return Sathy.each(this, fn);
    },
    map: function(fn) {
      return Sathy.map(this, fn);
    }
  });

  Sathy.prototype.extend({
    html: function(html) {
      if (!this.length) {
        if (html === void 0) {
          return '';
        } else {
          return this;
        }
      }
      if (html === void 0) {
        return this[0].innerHTML;
      } else {
        html += '';
        this.each(function(elm) {
          elm.innerHTML = html;
        });
        return this;
      }
    },
    text: (function() {
      if (window.document.documentElement.innerText === void 0) {
        return function(text) {
          if (!this.length) {
            if (text === void 0) {
              return '';
            } else {
              return this;
            }
          }
          if (text === void 0) {
            return this[0].textContent;
          } else {
            text += '';
            this.each(function(elm) {
              elm.textContent = text;
            });
            return this;
          }
        };
      } else {
        return function(text) {
          if (!this.length) {
            if (text === void 0) {
              return '';
            } else {
              return this;
            }
          }
          if (text === void 0) {
            return this[0].innerText;
          } else {
            text += '';
            this.each(function(elm) {
              elm.innerText = text;
            });
            return this;
          }
        };
      }
    })(),
    attr: function(name, value) {
      var first;
      if (!this.length) {
        if (text === void 0) {
          return '';
        } else {
          return this;
        }
      }
      if (name === void 0) {
        return this;
      }
      name += '';
      if (value === void 0) {
        first = this[0];
        if (Sathy.isWindow(first)) {
          return first[name];
        } else {
          return first.getAttribute(name);
        }
      } else {
        value += '';
        this.each(function(elm) {
          if (Sathy.isWindow(elm)) {
            elm[name] = value;
          } else {
            elm.setAttribute(name, value);
          }
        });
        return this;
      }
    },
    removeAttr: function(name) {
      if (!this.length || name === void 0) {
        return this;
      }
      name += '';
      this.each(function(elm) {
        ele.removeAttribute(name);
      });
      return this;
    },
    remove: function() {
      if (!this.length) {
        return this;
      }
      this.each(function(elm) {
        ele.parentNode && ele.parentNode.removeChild(ele);
      });
      return this;
    }
  });

  if (window.addEventListener) {
    Sathy.prototype.on = function(type, handle, capture) {
      type += '';
      capture = !!capture;
      this.each(function(elm) {
        elm.addEventListener(type, handle, capture);
      });
      return this;
    };
    Sathy.prototype.off = function(type, handle, capture) {
      type += '';
      capture = !!capture;
      this.each(function(elm) {
        elm.removeEventListener(type, handle, capture);
      });
      return this;
    };
    Sathy.prototype.one = function(type, handle, capture) {
      type += '';
      capture = !!capture;
      this.each(function(elm) {
        elm.addEventListener(type, function(e) {
          handle.call(elm, e);
          elm.removeEventListener(type, arguments.callee);
        }, capture);
      });
      return this;
    };
  } else if (window.attachEvent) {
    Sathy.prototype.on = function(type, handle) {
      type = 'on' + type;
      this.each(function(elm) {
        elm.attachEvent(type, handle);
      });
      return this;
    };
    Sathy.prototype.off = function(type, handle) {
      type = 'on' + type;
      this.each(function(elm) {
        elm.detachEvent(type, handle);
      });
      return this;
    };
    Sathy.prototype.one = function(type, handle) {
      type = 'on' + type;
      this.each(function(elm) {
        elm.attachEvent(type, function(e) {
          handle.call(elm, e);
          elm.detachEvent(type, arguments.callee);
        });
      });
      return this;
    };
  } else {
    window.alert('DAMN IT');
  }

  Sathy.prototype.extend({
    css: function(name, value) {
      var key, styleArr, v;
      if (!this.length) {
        return;
      }
      if (typeof name === 'string') {
        key = name;
        name = {};
        name[key] = '' + value;
      }
      if (name instanceof Object) {
        styleArr = [];
        for (key in name) {
          v = name[key];
          styleArr.push(key + ':' + v);
        }
        styleArr = ';' + styleArr.join(';') + ';';
        this.each(function(elm) {
          elm.style.cssText += styleArr;
        });
      }
      return this;
    }
  });

  this.Sathy = Sathy;

}).call(this);

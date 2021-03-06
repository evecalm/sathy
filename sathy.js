
;(function  (window,undefined) {
	var doc = window.document;
	function sathy (selector) {
		if (!(this instanceof sathy)) {
			return new sathy(selector);
		}
		this.init( selector );
	}


	sathy.prototype.extend = sathy.extend = function  (config,defaults) {
		if(!arguments.length) return this;
		var obj = {},key;
		if ( 1 === arguments.length) {
			//if only one argument, extend sathy itself
			obj = this;
		}
		if(config){
			for (key in config) {
				obj[key] = config[key];
			}
			if (defaults) {
				for(key in defaults){
					obj[key] = (undefined === obj[key]) ? defaults[key] : obj[key];
				}
			}
		}
		return obj;
	};

	sathy.extend({

		isArrayLike: function  (obj) {
			var len;
			//for null,undefined,false,0,''
			if (!obj) return false;
			//obj is an Array
			if(obj instanceof Array) return true;
			len = obj.length;
			//length does not exsit in obj or length not a number
			if (len === undefined || typeof len !== 'number') return false;
			//if length > 0 and obj[length-1] exsit
			if(len > 0 && obj[len-1] !== undefined) return true;
			//for anything else
			return false;
		},

		isFunction: function  (fn) {
			return (fn instanceof Function);
		},

		isLiteral: function(literal){
			return (literal != null) && !(literal instanceof Object);
		},

		serialize: function  (obj) {
			var str = [],key;
			if (obj instanceof Object) {
				for (key in obj) {
					//bug: browser origined post action encodes '!' to '%21',
					//but js' encodeURI and encodeURIComponent don't
					//even though most server are compatible with this,
					//the data transported is really different.
					str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
				}
				return str.join('&').replace(/!/g, '%21');
			} else {
				return (obj + '');
			}
		},

		ajax: function  (config) {
			//{url:'a.php',method:'post',data:'',success:fun,error:funerr,timeout:0,header:null}
			function getXHR () {
				if (window.XMLHttpRequest) {
					getXHR = function  () {
						return new XMLHttpRequest();
					};
				} else if(window.ActiveXObject) {
					getXHR = function  () {
						return new ActiveXObject("Microsoft.XMLHTTP");
					};
				} else {
					getXHR = function  () {
						throw new Error('XMLHttpRequest is not supported!');
					};
				}
				return getXHR();
			}
			var xhr,key,timer,
				defaultConfig;
			defaultConfig = {
				url:'',
				method: 'get',
				dataType:'text',
				data:null,
				success:null,
				error:null,
				timeout:0,
				header:null,
				async:true
			};
			xhr = getXHR();
			config = sathy.extend(config,defaultConfig);
			xhr.open(config.method,config.url,config.async);
			if (config.header instanceof Object) {
				for (key in header) {
					xhr.setRequestHeader(key,config.header[key]);
				}
			}
			if (config.method.toLowerCase() === 'post') {
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			}
			xhr.onreadystatechange = function  () {
				if (xhr.readyState == 1) {
					if (config.async && config.timeout > 0) {
						timer = setTimeout(function() {
								xhr.abort('timeout');
							}, config.timeout);
					}
					return;
				}
				if (xhr.readyState == 4) {
					clearTimeout(timer);
					if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
						if (config.success instanceof Function) {
							var response = xhr.responseText;
							if (config.dataType === 'json') {
								response = sathy.parseJSON(response);
							}
							config.success.call(null,response);
						}
					} else {
						xhr.abort('error');
					}
				}
			};
			if (config.error instanceof Function) {
				xhr.onabort = config.error;
			}
			xhr.send(sathy.serialize(config.data));
			return xhr;
		},
		//string to JSON,copied from jQuery
		parseJSON: (window.JSON && JSON.parse) || function( data ) {
			if ( typeof data !== "string" || !data ) {
				return null;
			}
			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = data.replace(/^\s+|\s+$/g,'');

			// Make sure the incoming data is actual JSON
			// Logic borrowed from http://json.org/json2.js
			if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
				.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
				.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

				// Try to use the native JSON parser first
				return (new Function("return " + data))();

			} else {
				throw new Error('Invalid JSON string');
			}
		},
		//obj to JSON string, copied form JSON.js
		stringify: (window.JSON && window.JSON.stringify) || function (obj) {
			var t = typeof obj,
				me = arguments.callee;
			if (t != "object" || obj === null) {
				// simple data type
				if (t == "string") obj = '"'+obj+'"';
				return String(obj);
			}
			else {
				// recurse array or object
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for (n in obj) {
					v = obj[n];t = typeof(v);
					if (t == "string") v = '"'+v+'"';
					else if (t == "object" && v !== null) v = me(v);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
				return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		},

		each: function  (arr,fn, context) {
			var i,len;
			if ( sathy.isArrayLike(arr) && sathy.isFunction(fn)) {
				for (i = 0, len = arr.length; i < len; ++i) {
					fn.call(null,arr[i],i,arr);
				}
			}
		},

		map: function (arr, fn) {
			var i, len, result = [];
			if ( sathy.isArrayLike(arr) && sathy.isFunction(fn)) {
				for (i = 0, len = arr.length; i < len; ++i) {
					result.push( fn.call(null,arr[i],i,arr) );
				}
			}
			return result;
		},

		ltrim: function (str) {
			return (str + '').replace(/^\s+/, '');
		},

		rtrim: function (str) {
			return (str + '').replace(/\s+$/, '');
		},

		trim: function (str) {
			return (str + '').replace(/^\s+|\s+$/g, '');
		},

		randomStr: function (length) {
			length = length || 16;
			var str = ''
			do {
				str += Math.random().toString(32).substr(2);
			} while (str.length < length);
			return str.substr(0,length);
		}
	});

	sathy.prototype.extend({

		length: 0,
		//make sathy looks like an array
		splice: Array.prototype.splice,

		init: function (selector) {
			if ( selector instanceof sathy ) {
				return selector;
			}
			if (selector instanceof HTMLElement) {
				this.makeArray( [selector] );
			} else {
				this.makeArray( doc.querySelectorAll(selector) );
			}
		},

		makeArray: function (ele) {
			if (!ele || !ele.length) return;
			if (!sathy.isArrayLike(ele)) {
				ele = [ ele ];
			}
			Array.prototype.push.apply(this,Array.prototype.slice.call(ele));
		},

		css: function  (name,value) {
			if (!this.length) return;
			var styleArr,key;
			if ((typeof name === 'string') && (typeof value === 'string')) {
				key = name;
				name = {};
				name[key] = value;
			}
			if (name instanceof Object) {
				styleArr = [];
				for (key in name) {
					styleArr.push(key + ':' + name[key]);
				}
				styleArr = ';' + styleArr.join(';') + ';';
				this.each(function (ele) {
					ele.style.cssText += styleArr;
				});
			}
			return this;
		},

		html: function(html){
			if(!this.length){
				if (undefined === html) {
					return this;
				} else {
					return '';
				}
			}
			if (undefined === html) {
				return this[0].innerHTML;
			} else {
				this.each(function (ele) {
					ele.innerHTML = html + '';
				});
				return this;
			}
		},

		text: function  (text) {
			if(!this.length){
				if (undefined === text) {
					return this;
				} else {
					return '';
				}
			}
			if (undefined === text) {
				return this[0].innerText;
			} else {
				text += '';
				this.each(function (ele) {
					ele.innerText = text;
				});
				return this;
			}
		},

		attr: function  (name,value) {
			if (!this.length) {
				if (undefined === value) {
					return '';
				} else {
					return this;
				}
			}
			if(undefined === name) return this;
			name += '';
			if (undefined === value) {
				return this[0].getAttribute(name);
			} else {
				value += '';
				this.each(function (ele) {
					ele.setAttribute(name,value);
				});
				return this;
			}
		},

		removeAttr: function  (name) {
			if(!this.length || undefined === name) return this;
			name += '';
			this.each(function (ele) {
				ele.removeAttribute(name);
			});
			return this;
		},


		remove: function () {
			this.each(function (ele) {
				ele.parentNode && ele.parentNode.removeChild(ele);
			});
			return this;
		},

		append: function (str) {
			// body...
		},

		each: function (fn) {
			sathy.each(this, fn);
		},

		map: function (fn) {
			return sathy.map(this, fn);
		}
	});

	if(window.addEventListener) {
		sathy.prototype.on = function (type,handle) {
			type = (type + '').toLowerCase();
			this.each(function (ele) {
				ele.addEventListener(type,handle,false);
			});
		};
		sathy.prototype.off = function (type,handle) {
			type = (type + '').toLowerCase();
			this.each(function (ele) {
				ele.removeEventListener(type,handle,false);
			});
		};
		sathy.prototype.one = function (type, handle) {
			type = (type + '').toLowerCase();
			this.each(function (ele) {
				ele.addEventListener(type,function (e) {
					handle.call(null,e);
					ele.removeEventListener(type, arguments.callee);
				},false);
			});
		};
	} else if(window.attachEvent) {
		sathy.prototype.on = function (type,handle) {
			type = ('on' + type).toLowerCase();
			this.each(function (ele) {
				ele.attachEvent(type,handle);
			});
		};
		sathy.prototype.off = function (type,handle) {
			type = ('on' + type).toLowerCase();
			this.each(function (ele) {
				ele.detachEvent(type,handle);
			});
		};
		sathy.prototype.one = function (type, handle) {
			type = ('on' + type).toLowerCase();
			this.each(function (ele) {
				ele.attachEvent(type,function (e) {
					handle.call(null,e);
					ele.detachEvent(type, arguments.callee);
				},false);
			});
		};
	} else {
		sathy.prototype.on = function (type,handle) {
			type = ('on' + type).toLowerCase();
			this.each(function (ele) {
				ele[ type ] = handle;
			});
		};
		sathy.prototype.off = function (type) {
			type = ('on' + type).toLowerCase();
			this.each(function (ele) {
				ele[ type ] = null;
			});
		};
		sathy.prototype.one = function (type, handle) {
			type = ('on' + type).toLowerCase();
			this.each(function (ele) {
				ele[ type ] = function (e) {
					handle.call(null, e);
					ele[ type ] = null;
				};
			});
		};
	}
	if (window.$) window._$ = window.$;
	window.$ = window.sathy= sathy;
})(window);
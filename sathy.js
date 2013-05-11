
;(function  (window,undefined) {
	function sathy (id) {
		if (!(this instanceof sathy)) {
			return new sathy(id);
		}
		// console.log(id);
		if (!id) {
			this.element = null;
		} else if (id.nodeType) {
			this.element = id;
		} else {
			if (typeof id === 'string') {
				this.element = document.getElementById(id);
			} else {
				throw new Error('Sathy not support yet!');
			}
		}
	}
	sathy.prototype = {
		constructor: sathy,
		on: function  (type,handle) {
			if (this.element) {
				if (this.element.addEventListener) {
					this.element.addEventListener(type,handle,false);
				} else if(this.element.attachEvent) {
					this.element.attachEvent('on' + type,handle);
				} else {
					this.element['on' + type] = handle;
				}
			}
			return this;
		},
		off: function  (type) {
			if (this.element && type) {
				this.element['on' + type] = null;
			}
			return this;
		},
		css: function  (style) {
			if (!this.element) return;
			var styleArr,key;
			if ((typeof style === 'string') && arguments[1]) {
				key = style;
				style = {};
				style[key] = arguments[1];
			}
			if (style instanceof Object) {
				styleArr = [];
				for (key in style) {
					styleArr.push(key + ':' + style[key]);
				}
				if (document.all) {
					this.element.style.cssText += ';' + styleArr.join(';') + ';';
				} else{
					this.element.style.cssText += styleArr.join(';') + ';';
				}
			}
			return this;
		}
	};
	sathy.extend = function  (config,defaultConfig) {
		if(config){
			for (var key in defaultConfig) {
				if (typeof config[key] !== 'undefined') {
					defaultConfig[key] = config[key];
				}
			}
		}
		return defaultConfig;
	};
	sathy.serialize = function  (obj) {
		var str = [],key;
		if (obj instanceof Object) {
			for (key in obj) {
				str.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
			}
			return str.join('&');
		} else {
			return (obj + '');
		}
	};
	sathy.ajax = function  (config) {
		//{url:'a.php',method:'post',data:'',succees:fun,error:funerr,timeout:0,header:null}
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
			succees:null,
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
					setTimeout(function() {
							xhr.abort('timeout');
						}, config.timeout);
				}
				return;
			};
			if (xhr.readyState == 4) {
				clearTimeout(timer);
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
					if (config.succees instanceof Function) {
						var response = xhr.responseText;
						if (config.dataType === 'json') {
							response = sathy.parseJSON(response);
						};
						config.succees.call(null,response);
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
	};
	//parseJSON is copy from jQuery
	sathy.parseJSON = function( data ) {
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
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			throw new Error('Invalid JSON string');
		}
	};
	window.$ = window.sathy= sathy;
})(window);
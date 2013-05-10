
;(function  (window) {
	function sachy (id) {
		if (!(this instanceof sachy)) {
			return new sachy(id);
		}
		if (!id) {
			this.element = null;
		} else if (id.nodeType) {
			this.element = id;
		} else {
			if (typeof id === 'string') {
				this.element = document.getElementById(id);
			} else {
				throw new Error('Sachy not support yet!');
			}
		}
	}
	sachy.prototype = {
		constructor: sachy,
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
		}
	};
	sachy.extend = function  (config,defaultConfig) {
		if(config){
			for (var key in defaultConfig) {
				if (typeof config[key] !== 'undefined') {
					defaultConfig[key] = config[key];
				}
			}
		}
		return defaultConfig;
	};
	sachy.serialize = function  (obj) {
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
	sachy.ajax = function  (config) {
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
		var xhr,
		key,
		defaultConfig;
		defaultConfig = {
			url:'',
			method: 'get',
			data:null,
			succees:null,
			error:null,
			timeout:0,
			header:null,
			async:true
		};
		xhr = getXHR();
		config = sachy.extend(config,defaultConfig);
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
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					if (config.succees instanceof Function) {
						config.succees.call(null,xhr.responseText);
					}
				} else {
					if (config.error instanceof Function) {
						config.error.call(null);
					}
				}
			}
		};
		xhr.send(sachy.serialize(config.data));
		return xhr;
	};
	window.$ = sachy;
})(window);
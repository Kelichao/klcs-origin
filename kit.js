/*!
 * @description: 较为常用的工具集合
 * @author: kelichao
 * @update: 2016-11-19
 * @https://github.com/Kelichao/keyer.js
*/

;(function() {

	// root 的值, 客户端为window, 服务端(node) 中为 globe
	var root = this;

	// 判断对象类型
	var kind = Object.prototype.toString;

	// 安全构造函数法
	var kit = function(obj) {

		// 如果传入了参数，且参数是A的实例对象，直接返回该参数对象
		// 否则就把obj当参数使用了
		if (obj instanceof A)
		  return obj;

		// 如果忘记了实例化，this的prototype就没有保存着A的prototype地址
		if(!(this instanceof A)) {
			return new kit(obj);
		}

		/*
		 * 在new状态下，return返回的都是当前的this ->
		 * 且this指向的地方都是新开辟的堆空间地址
		 * 默认就是这种模式，可以不写
		 */
		// return this;
	};

	// 类型映射,目前是11种
	var typeMap = {
		"isArray":      "[object Array]",
		"isBoolean":    "[object Boolean]",
		"isFunction":   "[object Function]",
		"isString":     "[object String]",
		"isMath":       "[object Math]",
		"isDate":       "[object Date]",
		"isNull":       "[object Null]",
		"isRegExp":     "[object RegExp]",
		"isNumber":     "[object Number]",
		"isUndefined":  "[object Undefined]",
		"isError":      "[object Error]"
	};

	// 内部生成对象判断函数
	var creatrTypeFunction = function(object) {

		for(item in object) {

			// 将方法挂载到对象上,每个item一个闭包空间来去除闭包影响
			kit[item] = (function(val) {
				return function(total) {
					return kind.call(total) === object[val];
				};
			})(item);
		}
	};

	creatrTypeFunction(typeMap);

	// 这个forEach只负责用来遍历对象属性
	kit.forEach = function(total, fn, context) {

		if (isObject === true) {
			for(var i in total) {
				fn(total[i], i);
			}
		} else if (isArray === true) {

		}
	};

	/*
	 * address为需要解析成对象的地址串
	 * key为需要取得的键值
	 */
	kit.locaSearch = function(address, key){
	    var str = decodeURIComponent(address || location.search),
	        arr = [],
	        obj = {},
	        first = "",
	        final = "";

	    if (typeof str == 'string' && str.length != 0) {

	    	/*
	    	 * 注意，window.location.search 截取的串都是带问号的
			 * 如果有问号则去除问号
	    	 */
	        str = str.search(/^\?/g) !== -1 ? str.substring(1) : str;
	        arr = str.split("&");

	        for(var i=0; i<arr.length; i++) {
	            first = arr[i].split("=")[0];
	            final = arr[i].split("=")[1];
	            obj[first] = final;
	        }
	    }
	    if (!!key) {
	    	obj = obj[key];
	    }
	    return obj;
	};

	window.kit = kit;

	// 兼容 AMD 规范
	if (typeof define === 'function' && define.amd) {

		// 要求是define包裹，然后返回整个key对象即可
	    define('kit', [], function() {
	        return kit;
	    });
	}

	// 兼容CMD规范
	// 需要在文件底部注册CMD规范，以underscore为例
	if(typeof define === "function" && define.cmd) {
	  define(function() {
	    return kit;
	  })
	}

}.call(this));


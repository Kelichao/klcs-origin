/*!
 * @description: 较为常用的工具集合
 * @author: kelichao
 * @update: 2016-11-19
 * @https://github.com/Kelichao/keyer.js
*/

;(function() {

	// root 的值, 客户端为window, 服务端(node) 中为 exports
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

	// 兼容node模块
	// node中有exports模块用于导出某个js文件
	if (typeof exports !== 'undefined') {
	  if (typeof module !== 'undefined' && module.exports) {

	  	// 兼容老的require() API
	    exports = module.exports = kit;
	  }

	  // 新版的node绑定
	  exports.kit = kit;

	} else {
		// 把整体绑定在全局变量
		// 浏览器环境为window.kit
	    root.kit = kit;
	}

	kit.isObject = function(obj) {
		return kind.call(obj) === "[object Object]";
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
			// underscore用forEach生产，原理跟这个一样,后期可以调整
			kit[item] = (function(val) {
				return function(total) {
					return kind.call(total) === object[val];
				};
			})(item);
		}
	};

	creatrTypeFunction(typeMap);

	// forEach负责用来遍历对象/数组属性
	kit.forEach = function(total, fn, context) {

		if (kit.isObject(total) === true) {
			for(var i in total) {
				fn(total[i], i);
			}
		} else if (kit.isArray(total) === true) {
			var i = 0;
			for (; i<total.length ;i++) {
				fn(total[i], i);
			}
		}
	};

	// 去除字符串两边的空格
	// 如果有第二个参数，则把所有空格删除
	// kit.trim("  dsfdsa=- 234.;df  ");
	kit.trim = function(str,state) {
		var totalStr = "";

		if (state === true) {
			totalStr = str.replace(/\s/g, "");
			return totalStr;

		}
		
		totalStr = str.replace(/^\s+|((?:^|[^\\\\])(?:\\\\.)*)\s+$/g, "$1");
		// 失败：如果末尾有两个以上的空格就读取失败了 str.replace(/^\s+((\S|\s)*)\s+$/g, "$1");
		// jq写法   str.replace(/^\s+|((?:^|[^\\\\])(?:\\\\.)*)\s+$/g, "$1");
		return totalStr;
	};

	// 拆分规律字符串函数
	// key键值， string输入的串，type分割类型，flag是否除去首个问号字符
	var strToObject = function(key, string, type ,flag) {
	    var str = decodeURIComponent(string),
	        arr = [],
	        obj = {},
	        first = null,
	        final = null,
	        cont = "";

	    if (typeof str == 'string' && str.length != 0) {

	    	// 注意，window.location.search 截取的串都是带问号的
			// 如果有问号则去除问号
			if (flag) {
				str = str.search(/^\?/g) !== -1 ? str.substring(1) : str;
			}

	        arr = str.split(type);
	        kit.forEach(arr,function(value, key) {
	        	cont =value.split("=");
	            first = cont[0];
				final = cont[1];
	            obj[first] = final;
	        });
	    }

	    if (!!key) {
	    	obj = obj[key];
	    }

	    return obj;
	};

	
	// address为需要解析成对象的地址串
	// key为需要取得的键值
	kit.locaSearch = function(key, address){

		address = address || root.location.search;
		var total = strToObject(key, address, "&", true);
	    
	    // 测试用例kit.locaSearch("fsd","?sfsd=3423&we=234&fsd=324");
	    return total;
	};

	// cookie对象获取函数
	kit.cookie = function(key,cookie) {

		cookie = cookie || root.document.cookie;
		var total = strToObject(key, cookie, ";", false);
		    
		// 测试用例kit.cookie("bbb","aaa=123;bbb=789");
		return total;
	};

	// 克隆方法
	kit.clone = function(total, flag) {

		// 深度克隆
		if (flag === true) {

			// 用递归方法拷贝深层次对象
			var result = (function (cont) {

				//这里增加了数组处理，暂时还不清楚函数体如何进行复制。
				var object = (cont instanceof Array) ? [] : {};

				// 注意这里不能用forEach,不然就得不到arguments.callee作用域
				for (var i in cont) {
					
					// 如果是一个引用对象			
					if (kit.isObject(cont[i]) === true) {
						object[i] = arguments.callee(cont[i]); 	

					// 如果是一个简单对象，则直接赋值		
					} else {
						object[i] = cont[i];		
					}
				} 
				return object;
			})(total);

		// 浅复制
		} else {

			//这里增加了数组处理，暂时还不清楚函数体如何进行复制。
			var result = (total instanceof Array) ? [] : {};

			kit.forEach(total, function(value, key) {
				result[key] = value;
			})
		}

		return result;
	};


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


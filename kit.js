/*!
 * @description: 较为常用的工具集合
 * @author: kelichao
 * @update: 2016-11-19
 * @https://github.com/Kelichao/kit.js
*/

;(function() {

	// root 的值, 客户端为window, 服务端(node) 中为 exports
	var root = this;

	// 判断对象类型
	var kind = Object.prototype.toString;

	// 方法简写
	// 缓存变量, 便于压缩代码
  	// 此处「压缩」指的是压缩到 min.js 版本
  	// 而不是 gzip 压缩
  	// 同时可减少在原型链中的查找次数(提高代码效率
	var ArrayProto = Array.prototype, 
		ObjProto = Object.prototype, 
		FuncProto = Function.prototype;

	var push = ArrayProto.push,
		pop = ArrayProto.pop,
		href = root.location.href,
    	slice = ArrayProto.slice;

	// 安全构造函数法
	var kit = function(obj) {

		// 如果传入了参数，且参数是A的实例对象，直接返回该参数对象
		// 否则就把obj当参数使用了
		if (obj instanceof kit) {
		    return obj;
		}

		// 如果忘记了实例化，this的prototype就没有保存着A的prototype地址
		if(!(this instanceof kit)) {
			return new kit(obj);
		}

		// 如果obj并不是kit的实例
		// 且这里已经处于正常实例化阶段
		// 用于OOP方式调用，将传入的对象赋值给内部对象
		// wrapped仅仅用来保存对象
		this._wrapped = obj;

		/*
		 * 在new状态下，return返回的都是当前的this ->
		 * 且this指向的地方都是新开辟的堆空间地址
		 * 默认就是这种模式，可以不写
		 */
		// return this;
	};

	//原型对象挂载简写
	fn = kit.fn = kit.prototype;

	// 兼容node模块
	// node中有exports/module.exports模块用于导出某个js文件
	// node中可以用CMD模式调用此文件：var MATH = require("./MATH") 
	// 直接检验exports 是兼顾老版本nodeAPI
	if (typeof exports !== 'undefined') {

		// 在正常node环境中
		// module以及module.exports都存在
	  	if (typeof module !== 'undefined' && module.exports) {

	  	// exports 原本挂载的是module.exports对象地址，
	  	// 如果重写module.exports为kit对象则需要顺带
	  	// 将exports地址指向kit，重写后他们两者会丢失联系
	    exports = module.exports = kit;
	  	}

	// 这句话不是特别重要
	exports.kit = kit;

	} else {
		// 把整体绑定在全局变量
		// 其实就是global.kit
	    root.kit = kit;
	}

	// defined这个方法是用于判断变量是否被定义
	// 如果还没有定义 Uncaught ReferenceError: * is not defined(…) -> 0
	// 未定义的变量，建议直接typeof
	kit.isUndefined = function(variable) {
		if (typeof variable === "undefined") {
			return true;
		}
		return false;
	};

	// 类型映射,目前是11种
	var typeMap = {
		"isObject":		"[object Object]",
		"isArray":      "[object Array]",
		"isBoolean":    "[object Boolean]",
		"isFunction":   "[object Function]",
		"isString":     "[object String]",
		"isMath":       "[object Math]",
		"isDate":       "[object Date]",
		"isNull":       "[object Null]",
		"isRegExp":     "[object RegExp]",
		"isNumber":     "[object Number]",
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
	kit.each = kit.forEach = function(total, fn, context) {

		if (kit.isObject(total) || kit.isFunction(total)) {
			for(var i in total) {
				fn(total[i], i);
			}
		} else if (kit.isArray(total)) {
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
		// 失败：如果末尾有两个以上的空格就读取失败了
		// str.replace(/^\s+((\S|\s)*)\s+$/g, "$1");
		// jq写法   str.replace(/^\s+|((?:^|[^\\\\])(?:\\\\.)*)\s+$/g, "$1");
		return totalStr;
	};

	// 拆分规律字符串函数
	// key键值， string输入的串，type分割类型，flag是否除去首个问号字符
	var strToObject = function(key, string, type ,flag) {
	    var str = string,
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
	        	cont = value.split("=");
	            first = kit.trim(cont[0]);
				final = kit.trim(cont[1]);
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

	/*
		// 对象要求：属性中有对象，且该内部对象有简单类型。
		var person = {
			name: "Bob",
			sing:{
				"name":"发如雪"
			}
		};

		var x =kit.mixin(person);
		person.sing.name = "";
		console.log(x);
	*/
	// 糅合方法,注意这个方法不能在实例上使用
	// kit.mixin(true, {a:1}, {b:2}, {c:3}, {d:4});
	// kit.mixin( [deep ], target, object1 [, objectN ] )...
	/*
	    深度复制测试
		var x = {e:345};
		var y = kit.mixin(true,{a:1}, {b:2}, {c:3}, x);
		x.e = 1111;
		console.log(y.e) // 345
	*/
	kit.mixin = function() {

		var total,
			flag,
			i = 0,
			length = arguments.length;


		// 如果第一个是状态码，把total换到arg[1];
		if (typeof arguments[i] === "boolean") {
		 	flag = arguments[i];
		 	i++;
		}

		//这里增加了数组处理，暂时还不清楚函数体如何进行复制。
		total = arguments[i];
		result = (total instanceof Array) ? [] : {};

		// i 当前参数下标
		// length参数长度
		for (; i < length; i++) {
			total = arguments[i];

			// 深度克隆
			if (flag == true) {

				// 用递归方法拷贝深层次对象
				var middle = (function (cont) {

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

				// 得到middle后进行浅复制
				kit.forEach(total, function(value, key) {
					result[key] = value;
				})

			// 浅复制
			} else {

				kit.forEach(total, function(value, key) {
					result[key] = value;
				})
			}
		}
		return result;
	};

	var query = function(id) {
		return document.querySelector(id);
	};

	var selects = function(class1) {
		return document.querySelectorAll(class1);
	};

	// 客户端用户id
	var CLIENT_USERID;
	kit.CLIENT_USERID = CLIENT_USERID = kit.cookie("userid");

	// 客户端版本号
	kit.CLIENT_VERSION = kit.cookie("version") ? kit.cookie("version").split(".").slice(-1)[0] : "";


	// i客户端埋点快捷方法
	// 调用此方法之前需要引入TA.js
	// 此类对象方式需要点击，保险起见是mousedown
	/*
		{
			"ibyf130_3242": ".class1",
			"iby2345_fre4": ".class2"
		}
	*/
	// 数组方式["ibyf130_3242","iby2345_fre4"]
	// 网页加载后直接触发
	kit.ta = function(param) {

		if (typeof TA === "undefined") {
			console.warn("未引入TA.js");
			return;
		}

		if (kit.isObject(param)) {
			if (typeof $ === "function") {
				kit.forEach(param, function(value, key) {
					$(document).on("mousedown", value, function() {
						// 触发埋点方式
						TA.log({
							"id": key,
							"ld": "client",
							"client_userid": CLIENT_USERID,
							"send_time": "" 
						})
					})
				});
			}
		} else if (kit.isArray(param)) {
			kit.forEach(param, function(value, key) {
				// 触发埋点方式
				TA.log({
					"id": value,
					"ld": "client",
					"client_userid": CLIENT_USERID,
					"send_time": "" 
				});
			});
		}
	};

	// 冒泡排序法对数组进行排序
	// 第一个参数如果是"asc"则是正序从小到大(默认)
	// 如果是"desc",则倒叙，从大到小
	//arr = [85, 24, 63, 45, 17, 31, 96, 50];
	kit.sort = function() {
		// 冒泡排序法

		var temp,
			flag = false,// 是否交换过
			state = false,// 是否需要倒序
			argue = arguments[0],
			arr,
			length;// 7
			// 因为排序次数只要比数组长度少一次
			// 外层循环只要排长度 - 1即可，

		if (typeof argue === "string") {

			// switch用的是严格等
			switch (argue) {
				case "asc":
					state = false;
					break;
				case "desc":
					state = true;
					break;
				default:
					throw "请传入正确的排序方式'asc'或'desc'";
			}

			arr = arguments[1];
		} else {
			arr = argue;
		}

		length = arr.length - 1;

		// 每一次排序都会在数组的顶部出现一个符合要求的数组成员
		for (var i = 0; i < length ; i++) {
			
			// 内层循环
			// 最上面的元素可以通过i除去排序
			// 也就是说已经排好的不需要再排了
			for(var j = 0; j < length - i; j++) {
				if (arr[j] > arr[j + 1]) {
					temp = arr[j + 1];
					arr[j + 1] = arr[j];
					arr[j] = temp;

					// 如果该论循环已经发生了交换
					flag = true;
				}
			}

			// 如果当前排序已经没有变化，则直接退出循环
			if(flag === false) {
				break;
			}
		}

		if(state === true) {
			arr = arr.reverse();
		}

		return arr;
	};

	// 内部对挂载的方法按名称进行排序
	kit.method = function(fn) {

		var names = [];
		kit.forEach(fn, function(fn, name) {
			if(kit.isFunction(fn)) {
				names.push(name);
			}
		});

		return names.sort();
	};
	
	// 监听路由变化
	kit.route = function(fn) {
		
		// 如果参数是函数，则进行绑定
		if(kit.isFunction(fn) === true) {
			root.onhashchange = function() {
				fn(root.location.hash.substring(1));
			}
		}
	};
	
	// 调用客户端下载框
	kit.clientDown = function(name, type, url) {
		href = "ifind://!command=down&valuectrl=1&filename=" +
				name + "." + 
				type + "&url=http://" + 
				document.location.host + 
				url; 

		root.location.href = href;
	};

	// 拆分一个字符串中间有间隔的字符串
	// 如："aaa    bbb cc    ddd"
	kit.splitSpace = function(str) {
		return str.split(/\s+/g);
	};

	// 执行一次的函数包装器
	kit.once = function(fn) {
			var totalFn = fn;
			if (kit.isFunction(totalFn) === false) {
				throw "请传入函数方法";
			}
			return function() {
				totalFn();
				totalFn = new Function();
			}
		}

	// 为了能使用OOP形式的调用，将kit的所有方法挂载到原型
	// 去除不是function类型的。
	// 用于添加自定义方法，此方法放到最后执行
	/*
		// 用法
		kit.extend({
			"kelichao":function() {
				console.log("name");
			}
		})
	*/
	// kit.extend( [deep ], target, object1 [, objectN ] )...
	kit.extend = kit.fn.extend = function() {

		var length = arguments.length,
			i = 1,
			target = arguments[0] || {},
			// 参考了underscore
			// 得到排序后的所有方法名数组
			sortFuncName = kit.method(target);

		// 如果第一个参数是布尔状态,就把对象切到第二个参数
		if (typeof target === "Boolean") {
			target = arguments[1] || {};
			i++;
		}

		// 如果目标对象不是对象或者函数，则返回空对象
		if (!(kit.isObject(target) === true || kit.isFunction(target) === true)) {
			target = {};
		}

		if (length === 1) {
			kit.forEach(sortFuncName, function(value, key) {

				// 1.挂载到对象名下
				// 2.挂载到原型链上
				// 3.先保存下当前函数地址(后面用于wrapped)
				var func = kit[value] = target[value];

				// 如果这个方法是之前绑定在原型上的，
				// 那么不做覆盖处理,例如kit.fn.extend
				if (kit.isUndefined(fn[value]) === false) {
					return ;
				}

				// OOP调用,对方法内部传入参数进行修改
				// 否则一般写法为 fn[value] = func;
				fn[value] = function() {

					// 第一个参数
					// 由于这里调用点是kit的实例对象
					// this是当前的kit实例对象
					var args = [this._wrapped];

					// arguments 为 name 方法需要的其他参数
					// 用arguments拿参数的好处是不需要制定形参名
					// 通过apply调用可以一次性传入多个数组
					// 不管有几个参数，我都可以拿到。
					// 执行后args组成一个新数组，包含agruments
					// 把第一个参数改为实例对象
					push.apply(args, arguments);

					// 将this指向kit ,传入改造后的参数组
					return func.apply(kit, args);
				}
			});
		} else {
			// 暂无处理
		}

	};

	kit.extend(kit);

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


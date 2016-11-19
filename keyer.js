/*!
 * @description: 较为常用的工具集合
 * @author: kelichao
 * @update: 2016-11-19
 * @https://github.com/Kelichao/keyer.js
*/

;(function(globe,factory) {

	// 全局对象globe在浏览器端为window，服务端(node) 中为 global
	factory(globe);

// 且typeof可以检测变量是否定义
}(this, function(window, noGlobal) {

		// 分离构造器模式
		var key = function(value, context) {

				// 由于没有采用安全构造函数法，这里分离构造器
				return new key.fn.init(value, context);
			};

		// 核心方法
		key.fn = key.prototype = {

			author: "kelichao",

			init: function() {
				return this;
			},

			/*
			 * address为需要解析成对象的地址串
			 * key为需要取得的键值
			 */
			locaSearch: function(address, key){
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
			},
		};

		// 将主函数key的方法挂载到分离的构造器上
		var init = key.fn.init;
		var _key = init.prototype = key.fn;

		// 将所有方法挂载到输出变量上
		// 为了防止命名冲突，内部采用key变量
		window.keyer = _key;

		return keyer;

}));



console.log(keyer.locaSearch("aaa=rfwe&4234=sdf&fswef=123" + window.location.search))

## 今天开始正式用issue 写博客啦2016/10/18

### kit.js [(链接地址)](https://github.com/Kelichao/kit.js/blob/master/kit.js)

### 方法:借鉴底线库的工具框架，包含一些常用方法，在兼容AMD模式的同时，兼顾了CMD，在seaJS中也能够正常包装
<table>
<tr>
	<td>kit.method</td> 
	<td>为对象上挂载的函数体排序生成数组名，除去变量值</td>
</tr>
<tr>
	<td>kit.extend</td> 
	<td>通过浅复制，继承当前对象的方法</td>
</tr>
<tr>
	<td>kit.isArray </td> <td>判断是否为数组</td>
</tr>
<tr>
	<td>kit.isBoolean</td> <td>判断是否为布尔值</td>
</tr>
<tr>
	<td>kit.isFunction</td> <td>判断是否为函数</td>
</tr>
<tr>
	<td>kit.isString</td> <td>判断是否为字符串</td>
</tr>
<tr>
	<td>kit.isDate</td> <td>判断是否为日期</td>
</tr>
<tr>
	<td>kit.isNull</td> <td>判断是否为null(typeof null === "object")</td>
</tr>
<tr>
	<td>kit.isRegExp</td> <td>判断是否为正则</td>
</tr>
<tr>
	<td>kit.isNumber</td> <td>判断是否为数字</td>
</tr>
<tr>
	<td>kit.isUndefined</td> <td>判断是否是undefined</td>
</tr>
<tr>
	<td>kit.isError</td> <td>判断是否是Error</td>
</tr>
<tr>
	<td>kit.forEach/kit.each</td>
	 <td>负责用来遍历对象/数组属性,按照ES5标准，与jq参数位置不同</td>
</tr>
<tr>
	<td>kit.trim</td>
	 <td>去除字符串两边的空格，如果有第二个参数，则把所有空格删除</td>
</tr>
<tr>
	<td>kit.locaSearch</td> 
	<td>第一个参数为需要取得的键值，第二个为需要解析成对象的地址串，如果不传为location.search</td>
</tr>
<tr>
	<td>kit.cookie</td> 
	<td>第一个参数为需要取得的键值，第二个为需要解析成对象的地址串，如果不传为document.cookie</td>
</tr>
<tr>
	<td>kit.clone</td> 
	<td>第一个参数为克隆对象，如果第二个参数是true则使用递归深度复制</td>
</tr>
<tr>
	<td>kit.query</td> 
	<td>封装了document.querySelector</td>
</tr>
<tr>
	<td>kit.querys</td> 
	<td>封装了docuemnt.querySelectorAll</td>
</tr>
<tr>
	<td>kit.CLIENT_USERID</td> 
	<td>保存了cookie中"userid"字段</td>
</tr>
<tr>
	<td>kit.ta</td> 
	<td>埋点快捷方式，传入对象{"ibyf130_3242": ".class1","iby2345_fre4": ".class2"} 进行dom绑定，如果传入数组，则是载入页面调用</td>
</tr>
<tr>
	<td>kit.clientDown</td> 
	<td>快速调用客户端下载弹窗1：下载文件取名，2：文件类型，3：文件下载地址</td>
</tr>
<tr>
	<td>kit.splitSpace</td> 
	<td>按照空格分割字符串</td>
</tr>
<tr>
	<td>kit.once</td> 
	<td>执行一次函数包装器</td>
</tr>
<tr>
	<td>kit.mixin</td> 
	<td>拷贝属性的方法，第一个参数如果填布尔值则是深度复制，后面跟需要拷贝的对象，方法属性都会挂载到第一个对象上面
	kit.mixin( [deep ], target, object1 [, objectN ] )...</td>
</tr>
<tr>
	<td>kit.sort</td> 
	<td>第一个参数如果是"asc"则是正序从小到大(默认), 如果是"desc",则倒叙，如果只传一个数组参数则进行正序排序</td>
</tr>
</table>

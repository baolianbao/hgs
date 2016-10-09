# 第三章：模板

在前面的例子我们看到，对于一个回调函数，很明显的一个任务就是针对一个请求生产响应。

对于简单的请求来说，这足够了，

例如，有一个用户在新的网站上注册了一个新的账号，用户在表单中输入了邮箱地址和密码并点击了提交按钮。在服务器端，一个包含了由用户提交的数据的请求，Express将其交给特定的函数来处理该注册请求，回调函数需要和数据库通信，添加新的用户然后生成响应返回给浏览器。这两种类型的任务，我们通常称为：业务逻辑和显示逻辑。


Express支持多种渲染模板的引擎：
[Using template engines with Express](https://expressjs.com/en/guide/using-template-engines.html)

[支持的模板引擎列表](https://github.com/expressjs/express/wiki?_ga=1.205543377.373649515.1470470192#template-engines)

通过Express-Generator生成项目的默认模板引擎是[Pug](http://jade-lang.com/) 之前称为Jade，鉴于比较喜欢Python，以及在Flask框架中使用Jinja2作为模板引擎，我就使用和Jinja2比较类似的模板引擎[nunjucks](http://mozilla.github.io/nunjucks/)

## nunjucks模板引擎
首先安装：

```bash
npm i nunjucks --save
```

### 渲染模板
Express默认会到当前应用的`views`目录下查找模板，对于如下代码，我们需要在`views`目录下创建
`index.html` 和 `user.html` 文件。
** Example 3-1. views/index.html：nunjucks模板**

``` html
<h1>Hello World!</h1>
```
** Example 3-2. views/user.html：nunjucks模板**

```html
<h1>Hello, {{ name }}!<h1>
```

** Example 3-3. app.js：渲染模板**

```js
var express = require('express');
var nunjucks = require('nunjucks');

var app = express();

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.get('/', function(req,res){
	res.render('index.html');
});

app.get('/user/:name', function(req,res){
	var name = req.params.name;
	res.render('user.html',{name: name});
});

app.listen(3000);

```

更多文档：
https://mozilla.github.io/nunjucks/templating.html#variables

### 变量
变量可以通过过滤器修改，也就是加在变量后，并以`|`(管道)分割，下面的模板中的`name`变量的首字母会大写。

```html
Hello, {{ name|captialize }}
```



### 控制结构
nunjucks提供了些控制结构。
下面的示例中展示了如何在模板中使用条件语句：

```html
{% if name %}
<h1>Hello, {{ name|title }}</h1>
{% else %}
<h1>Hello, Stranger<h1>
{% endif %}
```

在模板中另外一个常见的需求就是渲染一个元素列表，以下的示例显示了如何执行循环操作：
```html
<ul>
{% for comment in comments %}
    <li>{{ comment }}</li>
{% endfor %}
</ul>
```

## 自定义错误页面

## 链接

## 静态文件
Web应用不仅仅是由JavaScript代码和模板组成的，我们还会用到一些静态文件，例如在HTML代码中引用的图片，JavaScript源代码和CSS

那么如何设置静态文件目录？

```js
app.use(express.static(path.join(__dirname, 'public')));
```
包括如何设置`favico`

```js
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
```
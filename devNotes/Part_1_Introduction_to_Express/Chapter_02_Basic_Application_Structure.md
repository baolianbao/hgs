# 第二章：基本项目结构

在本章，我们会学习关于一个Express应用的各个方面，同时我们也会创建并运行我们第一个Express Web应用。

## 初始化
所有的Express应用都必须创建一个应用实例，Web服务器使用一个称为Web Server Gateway Interface(WSGI)的协议，它将所有从客户端接收的请求都传递给该实例来处理。

该应用实例是Express类的对象，创建方式如下：

```js
var express = require('express');

var app = express();
```

之后，你会看到更加复杂的应用初始化案例，但对于一个简单应用，这两行代码就够了。


## 路由与回调函数
像浏览器之类的客户端向web服务器发出请求(request), 也就是将这些请求传递给Express应用实例， 应用实例需要知道针对不同的URL请求应该运行什么代码，因此它会保存URL和Node函数（方法）的映射，而URL和处理URL请求的函数之间的对应关系就称为路由(route).

Express应用创建路由的方法及其简单，示例如下：

```js
app.get('/', function(req, res){
    res.send('<h1>Hello World!</h1>');
})
```

该示例，创建了一个匿名回调函数(callback)用来处理应用的根URL，如果该应用部署到服务器上并设置域名为www.example.com，当在浏览器中打开 http://www.example.com 的时候就会触发该回调函数。

该函数最终会通过response向客户端

该函数称为回调函数，response向客户端传递的可以是简单的HTML内容，也可以是我们即将讨论的复杂的表单。

> 响应中的字符串嵌套在Node.js的代码中，管理起来会非常麻烦，这里这么做只是为了介绍response的概念，你会在第三章看到生成响应的合适的方法。

如果你注意过每天在浏览器里输入的URL，你会注意到有些URL是有变量部分。例如你的微博的个人信息URL是https:weibo.com/<your-name>， 也就是说你的名称也是其中的一部分，Express也支持这类的URL，如下的案例展示了一个路由所包含的动态名称：

```js
app.get('/user/:name', function(req,res){
	var name = req.params.name;
	res.send('<h1>Hello,' + name + '!</h1>');
});
```

示例中`:`之后的部分是动态部分，也就是任何URL符合静态部分的会被映射到该路由，当该回调函数被调用，Express将动态部分作为参数返回。

路由中的动态部分，默认是字符串(string)，但也可以指定数据类型(?)，甚至是正则表达式。

## 启动服务器
我们的应用实例，有一个`listen`方法来启动Express Web服务器。

```js
app.listen(3000);
```

一旦该服务器启动，它就进入了一个循环：等待请求并响应，知道该应用被停止，例如按Ctrl+C或错误。

运行时候，我们可以开启Debug模式：
`DEBUG=express:* node app.js`

## 完整应用
在之前的部分，我们学习了Express Web应用的不同部分，现在改创建一个了，app.js应用仅仅是将我们之前讨论的三个部分合并了，示例如下：

** 示例 2-1. app.js：一个完整的Express应用 **

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('<h1>Hello World!</h1>');
});

app.listen(3000);
```

然后在命令行中运行：
```bash
# mac
DEBUG=express:* node app.js

# Windows
DEBUG=express:* & node app.js
```


然后在浏览器中打开 http://127.0.0.1:3000

如果你输入其他URL，我们的应用不知道如何处理，这个时候惯例是返回404错误 —— 请求页面不存在，但现在我们并没有处理。它会返回 `Cannot GET /whateveryouasked `

** 示例 2-2. app.js：具有动态路由的Express应用 **

```js
var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('<h1>Hello World!</h1>');
});

app.get('/user/:name', function(req, res){
    res.send('<h1>Hello,'+req.params.name +'!<h1>');
});

app.listen(3000);
```

## Request-Response 循环
目前为止，你已经尝试了Express应用了，你可能想知道更多敢于Express是如何工作的。下面描述了该框架的设计。

### Application和Request 上下文
当Express应用从客户端获取以个请求时，对应的回调函数有两个参数，第一个是request，它包含了从客户端发来的HTTP 请求。

```js
app.get('/', function(request, response){

})
```

Express 上下文
1. 当前应用

### Request分发
如何获取所有的URL
http://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express


express 4.x

Applications - built with express()

app._router.stack
Routers - built with express.Router()

router.stack

### Middleware

### Response

```js
res.status(400).send('bad request');
```

对于response对象，我们还可以设置cookie：http://expressjs.com/en/4x/api.html#res
```
res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
```

另外一种特殊的response称为`redirect`， 常见的redirect会携带`302`状态码
res.redirect([status], path);

### 配合Express使用的模块


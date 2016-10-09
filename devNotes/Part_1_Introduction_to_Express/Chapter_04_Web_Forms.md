# 第4章：表单

## Cross-Site Request Forgery(CSRF) Protection

https://github.com/expressjs/csurf




## HTML Rendering of Forms

```html 
<h1>Hello, {% if username %}{{ username }}{% else %}Stranger{% endif %}!</h1>
<form method="POST">
    <div>
        What's your name?
    </div>
    <div>
        <input type="text" name="username" value="">                
    </div>
    <div>
        <input type="submit" value="Submit">                
    </div>
</form>
```

## 表单处理
我们需要`body-parser`中间件来处理
安装
```
$ npm i body-parser
```
body-parser

http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters-in-express

```js
var bodyParser = require('body-parser');
...

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));

app.get('/', function(req,res){
	res.render('index.html');
});

app.post('/', function(req, res){
	res.render('index.html', {username: req.body.username});
});
```
我们需要自己写客户端的表单验证，以免用户提交不合法的数据，这里先不细讲。

## 文件上传
http://www.hacksparrow.com/form-handling-processing-in-express-js.html

不少情况下我们需要向服务器上传一些文件，例如头像图片，在4.x中找不到req.files对象了
> In Express 4, req.files is no longer available on the req object by default. To access uploaded files on the req.files object, use multipart-handling middleware like busboy, multer, formidable, multiparty, connect-multiparty, or pez.

我们使用[multer](https://github.com/expressjs/multer)

安装：

```bash
npm i multer
```

首先，我们需要准备表单

```html
<form method="POST" enctype="multipart/form-data">
	<input type="file" name="speaker">
	<input type="submit" name="submit">
</form>

{% if file %}
<img src='uploads/{{ file }}'>
{% endif %}
```
注意这里文件上传组件的`name`属性。

然后在服务端处理表单：

```js
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// 这里的upload.single()参数必须和文件上传组件的name一致！
// http://stackoverflow.com/questions/31530200/node-multer-unexpected-field
app.post('/', upload.single('speaker'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.render('index', { file: req.file.filename } )
})

```





## 重定向和用户会话
上面的案例app.js使用上是有点问题的。如果我们在输入姓名后提交，然后再刷新页面，浏览器可能会警告我们，是否要再次提交。这是因为当我们刷新页面时，浏览器会重复上一次请求。当上一次发送了一个携带表单数据的POST请求，刷新操作会导致表单的重复提交，这并非我们所期望的操作。

许多用户不明白来自浏览器的警告信息。基于这个原因，在web应用开发中永远不让上一个请求是POST请求就显得很有必要。

我们可以通过`redirect`而不是正常方式来响应`POST`请求。重定向`redirect`是用URL替代HTML字符串的一种特殊的响应方式。当浏览器接收到这样的响应，它将根据重定向的URL发出GET请求，然后显示页面。这可能需要额外的几毫秒来加载，毕竟要第二次发送请求到服务器，此外，用户看不出任何区别。这样做后，上一个请求是GET，重刷新就可以正常工作了。

但是这个方案就带来一个问题。当应用处理POST请求时候，其必须能访问用户在表单中输入的数据，例如我们上面的`username`，但在请求结束后，数据就消失了。由于处理POST请求时使用了重定向，我们的应用需要将`username`存储起来，那样重定向的请求就可以获取它，并用它来创建实际的响应。

应用之所以能“记住”不同请求中的内容是通过将内容存在用户会话(`user session`)中，每一个连接的客户端都有私有存储空间。

我们需要安装session中间件[expressjs/session](https://github.com/expressjs/session)

```bash
npm i express-session
```

然后使用：

```js
var session = require('express-session');
...
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {}
}));
```

之后，我们便可以在在request的上下文中对session对象进行操作：

```js
app.get('/', function(req,res){
	res.render('index.html', {username: req.session.username});
});

app.post('/', function(req, res){
	var username = req.body.username;
	req.session.username = username;
	res.redirect('/');
});
```

这样之后，再刷新代码都没有问题了。

## 显示信息
有时候在用户执行请求之后给予提示显得很有必要，例如确认、警告、错误信息等，最常见的案例就是在一个网站上输入了错误的用户名或密码，服务器会重新返回登录表单，以及信息告诉你用户名或者密码错误。

Express有中间件可以完成这个需求：[flash](https://github.com/expressjs/flash)

首先，需要安装：
```bash
npm i flash
```

使用

```js
app.use(require('flash')());

```

之后，我们就可以在Request中访问flash对象了：

```js
app.get('/', function(req,res){
	res.render('index.html', {username: req.session.username});
	req.session.flash.splice(0,1);
});

app.post('/', function(req, res){
	var old_name = req.session.username;
	var username = req.body.username;

	if (old_name !== username){
		req.flash('info', 'Welcome '+ username);
	}

	req.session.username = username;
	res.redirect('/');
});
```

接着我们需要在模板里能够显示该信息：

{% for message in flash %}
    {{ message.message }}
{% endfor %}

话说，这个并不好使……因为它再的信息被读取后并未清空，信息会一直贮存在session中（req.session.flash）, 所以才使用：

```js
req.session.flash.splice(0,1);
```
来手动清空，当这样做并方便，需要优化，例如在`for message in flash`中将`flash`换成一个方法，每次执行都会剔除已经读出的消息。
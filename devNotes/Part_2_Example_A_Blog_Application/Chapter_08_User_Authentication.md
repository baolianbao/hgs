# 第8章：用户验证

大部分应用需要记录他们的用户是谁。当用户连接应用，验证。

常见的验证方式是

## Express的验证插件

* Passport.js：对用户进行验证和会话管理
* bcrypt：用来加密密码和验证
* token生成和验证

除了验证需要的模块外，以下的模块也会用到：
* express-mailer：发送和验证相关的邮件

## 密码安全
在设计web应用时，存储于数据库的用户信息安全往往被忽视，如果入侵者能够进入你的服务器并访问用户的数据库……

数据库安全存储用户密码的关键在于不存储密码明文而是哈希过的！一个hash函数会通过输入一个密码然后应用一个或多个加密，结果是一个新的字符串序列，和原密码丝毫不相干，哈希密码可以通过原密码进行验证，因为它是可重现的，给定一个密码，结果永远相同。

> Password hashing is a complex task that is hard to get right. It is recommended that you don’t implement your own solution but instead rely on reputable libraries that have been reviewed by the community. If you are interested in learning what’s involved in generating secure password hashes, the article Salted Password Hashing Doing it Right is a worthwhile read.

### 使用bcrypt来哈希密码
它提供了两个方法：
* hash(plainTextPassword, saltRounds, function(err,hash)) 用于生成hash
* compare(plainTextPassword, hash, function(err, res)) 用于比较hash和密码

安装bcrypt，需要[node-gyp](https://github.com/nodejs/node-gyp)的支持，对于不同的平台有不同的安装方式：
windows，有两种方式，我们可以使用[`windows-build-tools`](https://github.com/felixrieseberg/windows-build-tools)，需要使用管理员权限来运行命令行进行安装：

```bash
npm install --global --production windows-build-tools
```

最后安装`bcrypt`

```bash
npm install bcrypt --save
```




我们将考虑使用`passport.js`

关于Flash信息：https://gist.github.com/raddeus/11061808

## 配置
使用Passport 验证时，有三条内容需要配置：
1. 验证策略
2. 应用中间件
3. 回话（可选项）

### 策略
Passport 使用策略这个术语来处理验证请求，它的范围包括从验证用户名密码到OAuth或者OpenID。

在使用Passport进行验证之前，必须先配置策略。

通过使用`use()`方法来对策略和配置。例如，如下使用`LocalStrategy`对用户名密码进行验证：

```js
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
```
#### 验证回调
该案例提供了一个非常重要的概念：验证回调。它是用于根据用户名密码类似的凭证来获取用户的。

### 中间件
在类`Connect`或`基于Express`的应用中，必须使用`passport.initialize()`中间件来初始化Passport。如果我们的应用还需要对登录会话持久化，那么还需要调用`passport.session()`中间件。

```js
app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});
```
> 注意：虽然对于大多数应用来说推荐使用`session`，但是否启用session完全是可选的，另外需要确保在`passport.session()`在`express.session()`之后调用，从而确保登录正确的会话存储顺序。

### Sessions
常见的网站应用，凭证验证仅仅需要在登录请求时进行，如果验证成功，会话会通过用户浏览器的`cookie`来建立和存储。

随后的请求不再包含凭证，而是通过唯一的`cookie`来确认会话。

为了支持登录会话，Passport会从`session`中序列化`user`或将`user`序列化到`session`中去。

```js
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
```
在该实例中，为了保证存储在`session`中的数据量，只将用户ID序列化到session中了，当收到后继请求时，会用该`ID`来查找用户，然后重新存储到`req.user`
The serialization and deserialization logic is supplied by the application, allowing the application to choose an appropriate database and/or object mapper, without imposition by the authentication layer.

## 用户名密码
常见网站会使用用户名密码来验证用户，`passport-local`模块提供了支持。

### 安装

```bash
npm i passport-local
```

### 配置

```js
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
```
这里验证所提供的用户名和密码由应用通过登录表单来提供。

### 表单
表单放在网页里，可以让用户输入他们的凭证并登录。

```html
<form action="/login" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>
```

### 路由
登录表单会通过`POST`方法传递到服务器。使用`authenticate()`方法和`local`策略来处理登录请求。

```js
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
```

将`failureFlash`的值设置为`true`则会通知Passport则可以通过`message`选项设置后flash一个`error`信息，这有助于提示用户再次输入。

### 参数
默认情况下`LocalStrategy`会从凭证中查找`username`和`password`这样的参数，如果你的应用想用不同的字段，可以通过如下的方式来进行设置：

```js
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
  },
  function(username, password, done) {
    // ...
  }
));
```

## OAuth
OAuth是一个可以让用户通过授权API来访问各种应用的标准协议。

OAuth有两个主要的分支，使用都很广泛：OAuth 1.0a 与 OAuth 2.0

### 安装

```bash
$ npm i passport-oauth
```

### OAuth 2.0
用户先被重定向到服务提供商（微信，微博……）来授权访问，一旦给予权限之后，用户携带一段编码被重定向到原来的应用，那段编码可以用于交换`access token`
应用请求访问，我们看作为客户端，通过ID和secret来标识。

### 配置
当使用OAuth 2.0策略，客户端ID，客户端secret以及`endpoints`都作为选项。

```js
var passport = require('passport')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.provider.com/oauth2/authorize',
    tokenURL: 'https://www.provider.com/oauth2/token',
    clientID: '123-456-789',
    clientSecret: 'shhh-its-a-secret'
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));
```

OAuth 2.0策略的验证回调接收`accessToken`,`refreshToken`,`profile`参数
* `refreshToken`可以用来获取新的访问`token` 如果服务提供商不能确认当前的`refreshToken`则会返回`undefined`
* `profile`包含了由服务提供商提供的用户资料。

### 路由

OAuth 2.0验证需要两个路由。第一个路由用来将用户重定向到服务提供商。第二个路由是在服务提供商验证之后用户重定向的URL

```js
// Redirect the user to the OAuth 2.0 provider for authentication.  When
// complete, the provider will redirect the user back to the application at
//     /auth/provider/callback
app.get('/auth/provider', passport.authenticate('provider'));

// The OAuth 2.0 provider has redirected the user back to the application.
// Finish the authentication process by attempting to obtain an access
// token.  If authorization was granted, the user will be logged in.
// Otherwise, authentication has failed.
app.get('/auth/provider/callback',
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));

```

### Scope
当使用OAuth 2.0获取访问权，访问权的Scope由Scope选项控制。

```js
app.get('/auth/provider',
  passport.authenticate('provider', { scope: 'email' })
);
```

如果有多个scope时，可以使用数组。

```js
app.get('/auth/provider',
  passport.authenticate('provider', { scope: ['email', 'sms'] })
);
```

`scope`的值是由提供商指定的，通过咨询提供商或他们的文档来获取支持的scope

### 链接
可以在网页上放置一个链接或按钮，就可以触发验证处理：

```html
<a href="/auth/provider">Log In with OAuth 2.0 Provider</a>
```

## 用户信息
当使用例如Facebook，Twitter等第三方的服务来验证时，我们往往可以获取用户资料。不同的服务往往会有不同的方式来加密这些信息。为了集成方便，Passport normalizes profile information to the extent possible.

标准化的资料信息
Normalized profile information conforms to the contact schema established by Portable Contacts. The common fields available are outlined in the following table.

| 字段         | 数据类型    | 说明                                                                                         |
|-------------|-------------|---------------------------------------------------------------------------------------------|
| provider    | String      | The provider with which the user authenticated (facebook, twitter, etc.).                   |
| id          | {String}    | A unique identifier for the user, as generated by the service provider.                     |
| displayName | {String}    | The name of this user, suitable for display.                                                |
| name        | {Object}    | familyName {String} The family name of this user, or "last name" in most Western languages. |
|             |             | givenName {String}The given name of this user, or "first name" in most Western languages.   |
|             |             | middleName {String} The middle name of this user.                                           |
| emails      | {Array} [n] | value {String} The actual email address.                                                    |
|             |             | type {String} The type of email address (home, work, etc.).                                 |
| photos      | {Array} [n] | value {String} The URL of the image.         

需要注意的是，以上的这些字段不是所有的服务提供商都提供的，也有些服务商会提供一些这里没有提到的信息。

## 第三方服务提供商
### 微信
https://github.com/liangyali/passport-wechat
#### 安装

```bash
$ npm install passport-wechat
```
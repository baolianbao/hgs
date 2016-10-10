# 第6章：Email

## 使用express-mailer

```bash
$ npm i express-mailer --save
```

需要配置的信息：
|字段|描述|
|--|--|
|from| 发件人 |
|host| 服务器 |
|secureConnection| SSL连接 |
|port| 端口 |
|transportMethod| |
|auth| 验证 |

```js
var app = require('express')();
var mailer = require('express-mailer');
var nunjucks = require('nunjucks');

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

mailer.extend(app, {
  from: 'youremail@163.com',
  host: 'smtp.163.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'youremail@163.com',
    pass: 'yourpassword'
  }
});

app.mailer.send('email.html', {
        to: 'youremail@163.com', // REQUIRED. This can be a comma delimited string just like a normal email to field. 
        subject: 'Huaguoshan Email', // REQUIRED.
        otherProperty: 'Other Property' // All additional properties are also passed to the template as local variables.
    }, function (err) {
    if (err) {
        // handle error
        console.log(err);
    } else{
        console.log('Send Successfully');
    }
});
```

## 集成到我们的项目中
导入email包：

```js
var mailer = require('express-mailer');
```

配置


```js
app.locals.email.config = {
  from: 'youremail@163.com',
  host: 'smtp.163.com', // hostname
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP
  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'youremail@163.com',
    pass: 'yourpassword'
  }
};
```



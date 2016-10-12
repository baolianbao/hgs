# 第5章：数据库

## SQL 数据库

## NoSQL 数据库

## SQL还是NoSQL

## node数据库框架
[Database Integration](https://expressjs.com/en/guide/database-integration.html)

ORM 框架：
http://sequelizejs.com/
https://github.com/dresende/node-orm2

http://www.jianshu.com/p/0a6dd4be9438

## 使用Mogoonse
参考Mogoonse for Application Development

安装

```bash
$ npm i mogoonse --save
```

`mogoonse`是通过URL来指定的：

```js
mongodb://user:pass@localhost:port/database
// replica sets
mongodb://user:pass@localhost:port,anotherhost:port,yetanother:port/mydatabase
```

## 定义Schema和Model

```js
app.locals.dbURI = 'mongodb://localhost/huaguoshan'

mongoose.connect(app.locals.dbURI);


var roleSchema = new mongoose.Schema({
    name: {type: String, unique:true}
});

roleSchema.statics.representation = function(){
  return 'Role: ' + this.name;
};

// Build the Role model
mongoose.model('Role', roleSchema);


var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, index=true } // login name if they have
});

userSchema.statics.representation = function(){
  return 'User: ' + this.username;
}

// Build the User model
mongoose.model( 'User', userSchema );
```

这里我们通过定义 `static` 方法来让每个`model`自带方法。



###  关系

```js
var userSchema = new mongoose.Schema({
    role_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
    username: {type: String, unique: true, index: true } // login name if they have
});
```

### 数据库操作
#### 创建数据库
在使用mongoose连接后就直接创建数据库了！
然后通过如下的命令连接并使用数据库：

```bash
$ mongo
# 查看所有的数据库
> show dbs 

# 使用指定的数据库
> use huaguoshan

# 查看当前数据库里有哪些集合
> show collections
```

#### 插入文档
```bash
> db.roles.insert({name:'Admin'})
> db.roles.insert({name:'Manager'})
# 批量插入
> db.roles.insert([{name:'Officer'}, {name:'Owner'}, {name: 'User'}])


> db.users.insert({username:'hexcola', role_id: ObjectId(57fa5ebfb92494fb110d2790)})

```

#### 查询
```bash
> db.find()
```

#### 删除

```bash
# 删除数据库
> db.dropDatabase()

# 删除集合
> db.collections.drop()

# 删除文档
> db.collections.remove({username: 'hexcola'})
```


## 在Router中使用数据库
当用户发送GET请求到`/` 路由时候，我们会返回`index.html`页面，那么我们要在这个页面添加一个完整的表单：

```js
app.get('/', function(req, res){
    res.render('index.html');
});
```

```html
<form method="POST" >
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

那么用户在提交内容就会发送一个POST请求到`/`，我们需要通过数据库查询：

```js
app.post('/', function(req, res){
    if(req.body.username){
        User.findOne(
            {'username':req.body.username},
            '_id username',
            function(err, user){
                if(!err){
                    if(!user){
                        console.log('User not found');
                    } else {
                        req.session.user = user;
                        req.session.loggedin = 1;
                        console.log('Logged in user' + user);
                    }
                } else {
                    console.log('Error(should redirect to error page )');
                }
            });
    } else {
        console.log('Error(User input empty )');
    }
})
```

> 注意这里我们使用了 `User.findOne`方法，在此之前，我们需要创建`User`的实例：

```js
var User = mogoonse.model('User');
```






`session` 我们会用到`express-session`中间件



## 参考
[Node Hero - Node.js Database Tutorial](https://blog.risingstack.com/node-js-database-tutorial/)

https://www.codementor.io/nodejs/tutorial/node-js-mysql

https://codeforgeek.com/2015/01/nodejs-mysql-tutorial/


## 将MongoDB服务器作为Windows服务运行

请注意，你必须有管理权限才能运行下面的命令。执行以下命令将MongoDB服务器作为Windows服务运行：
mongod.exe --bind_ip yourIPadress --logpath "C:\data\dbConf\mongodb.log" --logappend --dbpath "C:\data\db" --port yourPortNumber --serviceName "YourServiceName" --serviceDisplayName "YourServiceName" --install
下表为mongodb启动的参数说明：
参数	描述
--bind_ip	绑定服务IP，若绑定127.0.0.1，则只能本机访问，不指定默认本地所有IP
--logpath	定MongoDB日志文件，注意是指定文件不是目录
--logappend	使用追加的方式写日志
--dbpath	指定数据库路径
--port	指定服务端口号，默认端口27017
--serviceName	指定服务名称
--serviceDisplayName	指定服务名称，有多个mongodb服务时执行。
--install	指定作为一个Windows服务安装。
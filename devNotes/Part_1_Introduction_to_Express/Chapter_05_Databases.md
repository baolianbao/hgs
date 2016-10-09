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
`session` 我们会用到`express-session`中间件



## 参考
[Node Hero - Node.js Database Tutorial](https://blog.risingstack.com/node-js-database-tutorial/)

https://www.codementor.io/nodejs/tutorial/node-js-mysql

https://codeforgeek.com/2015/01/nodejs-mysql-tutorial/
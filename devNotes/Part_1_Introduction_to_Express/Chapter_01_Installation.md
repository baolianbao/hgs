# 第一章： 安装

## 使用虚拟环境
https://www.develves.net/blogs/asd/2016-04-28-using-virtual-environments-nodejs/
https://pypi.python.org/pypi/nodeenv/


## 初始化项目
我们通常使用Express来开发网站应用，在初始化项目我们需要使用:
```bash
npm init
```

## 通过npm安装node.js模块
要安装express，使用如下命令

```bash
npm i express --save
```
> 这里的`i`表示 `install`，你完全可以写全了。

该命令会安装Express及其依赖并保存到`package.json`，可以通过node命令提示符然后导入express来检测是否安装成功。
```bash
$ node
>>> require('express')
>>>
```
如果看到输出了关于express的模块信息而不是 `Error: Cannot find module 'express'`，恭喜，我们可以进入下一个环节了，开始创建我们的第一个Web应用。
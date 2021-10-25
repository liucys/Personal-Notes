[TOC]

### 在安装完成 git 后需要全局配置用户信息

```js
git config --global user.name 'github上的名称'

git config --global user.email 'github上使用的邮箱地址'
```

### 查看已配置的git信息

```js
git config --list
```

### 通过命令升级本地git

```js
// widnows系统
git update-git-for-windows
```

### 日常工作中常用的 git 命令

```javascript
git init // 初始化本地仓库,默认为master分支(一般只有第一次建项目时使用)
git pull // 获取远程仓库的内容到本地
git add . // 提交全部修改文件到缓存区
git diff // 查看当前代码add后,会add那些内容
git commit -m "注释" // 提交本地代码到本地仓库,并附带提交的注释
git status // 查看当前分支状态
git push // 提交本地代码到远程仓库
```

### 使用 git add、git commit、git push 进行项目提交时 git commit -m 的提交类型

- build：影响构建系统或外部依赖关系的更改（示例范围：gulp，broccoli，npm）
- ci：更改我们的持续集成文件和脚本（示例范围：Travis，Circle，BrowserStack，SauceLabs）
- docs：仅文档更改
- feat：一个新功能
- fix：修复错误
- perf：改进性能的代码更改
- refactor：代码更改，既不修复错误也不添加功能
- style：不影响代码含义的变化（空白，格式化，缺少分号等）
- test：添加缺失测试或更正现有测试

### 分支操作

```javascript
git branch // 查看本地所有分支
git branch -r // 查看远程所有分支
git branch -a // 查看本地和远程的所有分支
git merge <分支名称> // 进行主分支中,运行命令合并分支
git merge --abort // 合并分支出现冲突时,取消合并,回到合并前的状态
git branch <新分支名称> // 基于当前分支,新建一个新分支
git checkout --orphan <新分支名称> // 新建一个空分支(会保留之前分支的所有文件)
git branch -D <分支名称> // 删除本地指定分支
git push <远程仓库名称>:<分支名称> // 删除远程仓库指定分支
git branch <新分支名称> <提交ID> // 从提交历史恢复某个删除的分支
git branch -m <原分支名> <新分支名> // 分支更名
git checkout <分支名称> // 切换到指定分支
git checkout <远程仓库名>/<分支名称> /*/ 切换到远程仓库指定分支上 */
git checkout -b <新分支名称> // 基于当前分支新建一个分支并切换到该分支
```

### HEAD

head 是一个对当前检出记录的符号引用,也就是说它指向你正在其基础上进行工作的提交记录.

head 总是指向当前所在分支上的最近一次提交记录.head 在通常情况下是指向分支名的,但是当你进行提交时,改变了分支的状态.head 就指向提交记录

分离 head 就是让其指向某个具体的提交记录而不是分支名称.

实质: 进行分支切换与修改提交

### 查看提交记录

```js
git log
```

### 如何根据指定项目的 commit 提交记录获取 commit 提交时的项目版本?

```js
# 根据旧项目的commit提交记录,提取出该旧项目的初始提交版本,从而作为新项目的起使版本.

# 首先,将旧项目在github中通过fork创建出一个新项目,然后将新项目通过git clone克隆到本地
git clone xxxx项目地址

# 其次,通过 git log命令查看项目的初始化提交版本.找到指定提交版本 commit 的版本号.允许命令将其回退到该版本号
git reset --hard xxxxxxx版本号

# 例如
# 在通过fork创建的新项目中运行命令 git log 查看commit提交版本,显示有：
commit 98acda6bb398362f68abd554435a35da13bc8f1b
Author: xxxx提交人的信息
Date:   Tue Jan 26 14:32:05 2021 +0800
    feat(basic): add basic data API
commit 1c1cb0115f90b4e684c5d4815ddda1cc1779958b
Author: xxxx提交人的信息
Date:   Mon Jan 25 22:20:05 2021 +0800
    Initial commit

# 在上面通过git log显示的内容中, commit 后面的就是commit版本号.运行命令将项目转到该指定commit提交版本,例如：
git reset --hard 1c1cb0115f90b4e684c5d4815ddda1cc1779958b
```

### 查看当前 git 链接的远程仓库地址

```js
git remote -v
```

### 移除当前本地仓库已设置的远程仓库链接

```js
git remote rm origin
```

### 为当前本地仓库设置链接到指定的远程仓库

```js
git remote add origin 远程仓库链接地址
// 当需要提交本地修改时,运行命令
git push origin master
```

### 相对引用

```js
git checkout 指定分支^ // 表示切换到指定分支的父节点

git checkout HEAD^ // 切换到当前分支的父节点

git checkout bugFix^ // 切换到bugFix分支的父节点

git checkout HEAD~4 // 一次向上后退四步(相当于调用了四次 git checkout HEAD^ 命令)

git branch -f main HEAD~3 // 将main分支强制指向 HEAD 的第三次父提交
```

### 撤销变更

撤销变更就是撤销我们的提交记录

`git reset` 通过把本地分支记录回退几个提交记录来实现撤销改动。你可以将这想象成“改写历史”。`git reset` 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。

git revert 功能与 git reset 相同,但是它能够将撤销远程分支记录并分享给别人,这有利于多人开发.

```js
# 方法一
git reset HEAD~1 // 撤销当前分支在本地的上一次提交

# 方法二
git revert HEAD // 撤销当前分支的远程提交修改
```

### 如何将本地文件夹内容推送到指定 github 仓库

```js
# 首先,进行本地文件夹,运行命令将本地文件夹变成git可管理的仓库
git init

# 其次,将本地文件夹内容提交到本地仓库
git add .  # 将内容添加到暂存区
git commit -m 'feat:first commit' # 将文件提交到仓库

# 接下来,将本地git关联到远程github仓库
git remote add origin 远程仓库地址

# 最后,将本地仓库内容推送到远程仓库中
git push -u origin matser
```

![](https://github.com/liucys/open-static-file/blob/main/Project_img/git.png)

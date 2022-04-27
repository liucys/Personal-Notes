[TOC]

### 在安装完成 git 后需要全局配置用户信息

```js
git config --global user.name 'github上的名称'

git config --global user.email 'github上使用的邮箱地址'
```

### 相关命令

```js
// 查看已配置的 git 信息
git config --list

// widnows系统升级本地git
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
// 分支查看
git branch // 查看本地所有分支
git branch -r // 查看远程所有分支
git branch -a // 查看本地和远程的所有分支

// 分支合并
git merge 需要合并得分支 // 进行主分支中,运行命令合并分支
git merge --abort // 合并分支出现冲突时,取消合并,回到合并前的状态

// 新建分支
git branch 新分支名称 // 基于当前分支,新建一个新分支
git checkout --orphan 新分支名称 // 新建一个空分支(会保留之前分支的所有文件)
git checkout -b 新分支名称 // 基于当前分支新建一个分支并切换到该分支
git push --set-upstream origin 本地新分支名称 // 推送本地新分支到远程

// 拉取远程分支到本地
git fetch
git checkout -b 远程分支名 origin/远程分支名

// 本地分支删除
(1)：git checkout 主分支名
(2)：git branch -d 想要删除得分支名

// 删除远程分支
(1)：git branch -a // 查看远程分支
(2)：git push 远程名称 -d 远程分支名称 // 例如：git push origin -d test

// 暂存当前分支数据（当在分支添加新功能时，急需需要回到主分支修复bug,但又不想提交当前分支添加的功能代码）
git stash save "备注内容" // 暂存分支上的代码
git stash list // 查看所有暂存记录
git stash clear // 删除所有暂存记录
git stash drop // 应用最近一次的暂存内容,随后删除该暂存记录(在分支上)
git stash apply stash@{下标} // 应用指定的暂存内容
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

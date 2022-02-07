[TOC]

Redis（REmote Dlctionary Server）是一个有 Salvatore Sanfillippo 写的`key-value`存储系统，是跨平台的非关系型数据库。

Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内存、分布式、可选持久性的键值对(Key-Value)存储数据库，并提供多种语言的 API。

Redis 通常被称为数据结构服务器，因为值（value）可以是字符串(String)、哈希(Hash)、列表(list)、集合(sets)和有序集合(sorted sets)等类型。

&nbsp;

执行操作命令：

在 `redis 安装目录下`进入 `cmd`，运行命令：`redis-cli -h 127.0.0.1 -p 6379` 运行 redis

- 清除缓存

```js
keys * // 查看所有已有key值

del key // 删除指定索引（key)的值

flushall // 清空整个redis服务器的缓存数据

flushdb // 清空当前库中的所有key
```

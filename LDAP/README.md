在 window 环境下配置安装 openLDAP

&nbsp;

#### 第一步：下载安装 OpenLDAPforWindows

下载地址：https://www.maxcrc.de/en/download-en/

当下载好压缩包后,解压并运行 exe 文件进行安装,安装选项一律选择 **Next** (默认是安装在 C 盘,可以在选择安装位置时,自定义安装位置).

&nbsp;

#### 第二步：在程序安装的根目录下修改配置 slapd.conf 文件

这里只需要修改红框圈起来的位置,默认情况下是 **dc=maxcrc**或其他值，我们只需要将其修改为自定义的名称即可，格式是 **dc=自定义**。如 **dc=test**(红框中修改的内容必须一致).

因为安装是一律 next 选项,因此默认管理员 root 密码为 **secret**，我们可以修改为自定义密码(在程序安装的根目录下运行终端 cmd,然后运行命令： **slappasswd -h {SSHA} -s 自定义密码**，就会生成加密的 SSHA 格式密码,用其替换掉 slapd.conf 文件中的 rootpw 处的原始密码即可)

&nbsp;

#### 第三步：导入自定义 ldif 文件内容(在程序安装的根目录下新建一个文件后缀为 .ldif 的文件,并自定义内容)

自定义内容格式要求：**冒号后面一定要空格，但是每行的头和尾都不能有空格**

**注意：其中的 dc=xxx 处,该处的值必须与第二步中设置的一致.**

例如：test.ldif 文件

```js
dn: dc=test,dc=com
objectClass: domain
objectClass: top
o: MichaelBlog
dc: test

dn: ou=People,dc=test,dc=com
objectclass: organizationalUnit
ou: People
description: Containerforpeoplentries

dn: uid=ZhangSan,ou=People,dc=test,dc=com
uid: ZhangSan
objectClass: inetOrgPerson
mail: 112233@qq.com
userPassword: 123456
sn: San
cn:ZhangSan

dn: uid=Admin,ou=people,dc=test,dc=com
uid: Admin
objectClass: inetOrgPerson
mail: 1234@gmail.com
userPassword: 111111
sn: Sun
cn: AdminSun
```

&nbsp;

#### 第四步：导入自定义的内容

在根目录下进入 cmd，运行命令：**slapd -d 1 -f ./slapd.conf**

执行结果末尾出现 **slapd starting** 字样则表示服务启动成功.

当启动成功后,我们关闭该服务,然后输入命令：**slapadd -v -l 自定义文件.ldif -f slapd.conf**

将自定义的数据内容进行导入。

&nbsp;

#### 第五步：安装可视化界面客户端

这里使用 ldapAdmin，下载地址为：http://www.ldapadmin.org/download/ldapadmin.html

下载完成后解压运行即可。

然后我们启动 openLDAP 服务,根据https://blog.csdn.net/vivianliulu/article/details/90640737 处进行相应的操作即可.

&nbsp;

#### NODE 中操作 LDAP 目录存储

```js
const ldap = require("ldapjs");
const RootDN = "cn=Manager,dc=poly,dc=com";
const RootPassword = "123456";
// 连接ldap服务
const ldapClient = ldap.createClient({
  url: "ldap://127.0.0.1:389",
  timeout: 5000,
  reconnect: true,
});

// 从根节点上进行绑定
ldapClient.bind(RootDN, RootPassword, (err) => {
  if (err) {
    console.log("验证失败：" + err);
    return;
  }

  /* 添加一个新的表 Department*/
  const ou = {
    ou: "Department",
    objectClass: "organizationalUnit",
    description: "a department table",
  };
  ldapClient.add(`ou=${ou.ou},dc=poly,dc=com`, ou, (err) => {
    if (err) {
      console.log("添加失败" + err);
    }
  });

  /* 在People表中添加一个uid为Admin的数据 */
  const user = {
    uid: "Admin",
    userPassword: "123456",
    mail: "admin@gmail.com",
    mobile: "13984842424",
    cn: "Admin",
    sn: "dmin",
    organizationName: "中国xxx集团有限公司",
    objectClass: ["inetOrgPerson"],
  };
  ldapClient.add("uid=Admin,ou=People,dc=poly,dc=com", user, (err) => {
    if (err) {
      console.log("添加失败：" + err);
      return;
    }
    console.log("添加成功");
  });

  /* 修改指定uid数据的userPassword值为123456 */
  const change = new ldap.Change({
    operation: "replace",
    modification: {
      userPassword: ["123456"],
    },
  });
  ldapClient.modify("uid=Liucy,ou=People,dc=poly,dc=com", change, (err) => {
    if (err) {
      console.log("修改失败：" + err);
      return;
    }
    console.log("修改成功");
  });

  /* 向uid=Liucy的数据添加字段mobile(注意,每次只能添加一个字段) */
  const attribute = new ldap.Change({
    operation: "add",
    modification: {
      mobile: "13984842424",
    },
  });
  ldapClient.modify("uid=Liucy,ou=People,dc=poly,dc=com", attribute, (err) => {
    if (err) {
      console.log("字段添加失败：" + err);
      return;
    }
    console.log("字段添加成功");
  });

  /* 搜索指定uid用户信息 */
  ldapClient.search("uid=Admin,ou=People,dc=poly,dc=com", {}, (err, res) => {
    if (err) {
      console.log("搜索出错：" + err);
      return;
    }
    // 搜索结果
    res.on("searchEntry", (entry) => {
      console.log("entry: " + JSON.stringify(entry.object));
    });
    // 监听错误
    res.on("error", (err) => {
      console.error("error: " + err.message);
    });
    // 搜索结束
    res.on("end", (result) => {
      console.log("status: " + result.status);
    });
  });

  /* 删除People表中uid为ZhangSan的数据 */
  ldapClient.del("uid=ZhangSan,ou=People,dc=poly,dc=com", (err) => {
    if (err) {
      console.log("删除失败：" + err);
      return;
    }
    console.log("删除成功");
  });
});

ldapClient.on("error", (err) => {
  console.log("连接出错：" + err);
});
```

所谓第三方登录，实质就是 OAuth 授权。用户想要登录 A 网站，A 网站让用户提供第三方网站的数据，证明自己的身份。获取第三方网站的身份数据，就需要 OAuth 授权。

举例来说，A 网站允许 GitHub 登录，背后就是下面的流程。

> 1. 用户在A网站上想通过GitHub进行登录,A 网站就让用户跳转到 GitHub.
> 2. GitHub 要求用户登录，然后询问"A 网站要求获得 xx 权限，你是否同意？"
> 3. 用户同意，GitHub 就会重定向回 A 网站，同时发回一个授权码。
> 4. A 网站使用授权码，向 GitHub 请求令牌access_token。
> 5. GitHub验证相关信息后 返回令牌.
> 6. A 网站使用令牌，向 GitHub 请求用户数据。



## GitHub进行OAuth实现步骤

### 1.首先,我们需要在GitHub平台进行OAuth登记,让GitHub知道是谁在请求.

> 进行登记的地址：https://github.com/settings/applications/new

应用的名称随便填，主页 URL(Homepage URL) 填写你项目的首页地址，跳转网址(Authorization callback URL)填写 你自己设立的项目登录处理地址。

当提交表单后,GiuHub会生成一个客户端ID(client ID)以及客户端密钥(client secrets),这就是应用的身份识别码,这两个参数值需要记录下来,后面需要使用到.



### 2.在我们的项目中,当需要通过github进行登录时,需要跳转到GitHub认证地址,并且需要携带参数client ID(上一步中获取的客户端ID值)以及redirect_uri(认证完成后跳转回来的地址(要与上一步中设置的Authorization callback URL地址一致).

> 跳转的URL地址如下：https://github.com/login/oauth/authorize?client_id=xxxxxx&redirect_uri=http://xxxxxx

用户点击到了 GitHub，GitHub 会要求用户进行登录授权认证，确保是本人在操作。



### 3.认证成功后,GitHub会跳转到设置传递的redirect_uri地址,并且携带上授权码code,我们需要通过该授权码code向GitHub发送获取Access_Token请求(这一步应该在服务端进行实现)

> 跳转回来的URL地址类似于：http://xxxxxxx?code=xxxxxxxx

后端拿到code后,需要向GitHub发送POST请求获取access_token,需要传递参数client_id、client_secret、code

> POST   https://github.com/login/oauth/access_token?client_id=xxxxx&client_secret=xxxxxx&code=xxxxx
>
> headers:{
>
> ​	accept:'application/json
>
> }

作为回应，GitHub 会返回一段 JSON 数据，里面包含了令牌`accessToken`。

> {
>
> ​	" access_token " : " xxxxxx ",
>
> ​	" scope " : "",
>
> ​	" token_type " : "bearer "
>
> }



### 4.当获取到access_token令牌后,我们就可以向GitHub请求获取用户信息了(这一步应该在服务端进行实现).

GitHub API 的地址是`https://api.github.com/user`，请求的时候必须在 HTTP 头信息里面带上令牌`Authorization: token 361507da`

> GET https://api.github.com/user
>
> headers:{
>
> ​	accept: "application/json",
>
> ​	Authorization: "Bearer  access_token值"
>
> }

作为回应, GitHub会返回一段JSON数据,里面包含了用户的基本信息.

> {
>
> ​	bio: "Industry excels in diligence, wastefulness in play, action in thinking, destruction in following.",
> ​	blog: "",
> ​	company: null,
> ​	created_at: "2019-06-14T10:50:24Z",
> ​	email: null,
> ​	events_url: "https://api.github.com/users/xxxx/events{/privacy}",
> ​	followers: 1,
> ​	followers_url: "https://api.github.com/users/xxxxx/followers",
> ​	following: 1,
> ​	following_url: "https://api.github.com/users/xxxxx/following{/other_user}",
> ​	gists_url: "https://api.github.com/users/xxxxx/gists{/gist_id}",
> ​	gravatar_id: "",
> ​	hireable: null,
> ​	html_url: "https://github.com/xxxxx",
> ​	id: xxxxxxx,
> ​	location: "Xiamen, China",
> ​	login: "xxxxx",
> ​	name: "xxxxx",
> ​	node_id: "xxxxxxxxxx",
> ​	organizations_url: "https://api.github.com/users/xxxxxx/orgs",
> ​	public_gists: 0,
> ​	public_repos: 4,
> ​	received_events_url: "https://api.github.com/users/xxxxxx/received_events",
> ​	repos_url: "https://api.github.com/users/xxxxxx/repos",
> ​	site_admin: false,
> ​	starred_url: "https://api.github.com/users/xxxxxx/starred{/owner}{/repo}",
> ​	subscriptions_url: "https://api.github.com/users/xxxxxx/subscriptions",
> ​	twitter_username: null,
> ​	type: "User",
> ​	updated_at: "2021-08-05T15:15:18Z",
> ​	url: "https://api.github.com/users/xxxxxx",
>
> }

当获取到用户信息后,我们可以根据该用户信息登录我们自己的数据库中的账户或者进行注册账户,然后生成自己系统相应的token;

我们也可以直接使用这些用户信息(临时性登录展示)
所谓第三方登录，实质就是 OAuth 授权。用户想要登录 A 网站，A 网站让用户提供第三方网站的数据，证明自己的身份。获取第三方网站的身份数据，就需要 OAuth 授权。

举例来说，A 网站允许 GitHub 登录，背后就是下面的流程。

> 1. 用户在 A 网站上想通过 GitHub 进行登录,A 网站就让用户跳转到 GitHub.
> 2. GitHub 要求用户登录，然后询问"A 网站要求获得 xx 权限，你是否同意？"
> 3. 用户同意，GitHub 就会重定向回 A 网站，同时发回一个授权码。
> 4. A 网站使用授权码，向 GitHub 请求令牌 access_token。
> 5. GitHub 验证相关信息后 返回令牌.
> 6. A 网站使用令牌，向 GitHub 请求用户数据。然后根据请求回来的用户数据进行相应的登录处理。

&nbsp;

## GitHub 进行 OAuth 实现步骤

### 1.首先,我们需要在 GitHub 平台进行 OAuth 登记,让 GitHub 知道是来自那个网站的 Oauth 请求.

> 进行登记的地址：https://github.com/settings/applications/new

应用的名称随便填，主页 URL(Homepage URL) 填写你项目的首页地址，跳转网址(Authorization callback URL)填写 你自己设立的项目登录处理地址。

当提交表单后，GiuHub 会生成一个客户端 ID(client ID)以及客户端密钥(client secrets)，这就是应用的身份识别码，这两个参数值需要记录下来，后面需要使用到。

&nbsp;

### 2.在我们的项目中，当需要通过 github 进行登录时，需要跳转到 GitHub 认证地址，并且需要携带参数 client ID(上一步中获取的客户端 ID 值)以及 redirect_uri(认证完成后跳转回来的地址(要与上一步中设置的 Authorization callback URL 地址一致)。

> 跳转携带参数的的 URL 地址格式如下：https://github.com/login/oauth/authorize?client_id=xxxxxx&redirect_uri=http://xxxxxx

用户点击到了 GitHub，GitHub 会要求用户进行登录授权认证，确保是本人在操作。

&nbsp;

### 3.认证成功后，GitHub 会跳转到设置传递的 redirect_uri 地址，并且携带上授权码 code，我们需要通过该授权码 code 向 GitHub 发送获取 Access_Token 的请求（这一步应该在服务端进行实现）

> 跳转回来的 URL 地址类似于：http://xxxxxxx?code=xxxxxxxx

通过自己定义的 HTTP 请求将 `code` 传递到服务端，服务端拿到 `code` 后，需要向 GitHub 发送 POST 请求获取 access_token,需要传递参数 `client_id、client_secret、code`

> POST https://github.com/login/oauth/access_token?client_id=xxxxx&client_secret=xxxxxx&code=xxxxx
>
> headers:{
>
> ​ accept:'application/json
>
> }

作为回应，GitHub 会返回一段 JSON 数据，里面包含了令牌`accessToken`。

> {
>
> ​ " access_token " : " xxxxxx ",
>
> ​ " scope " : "",
>
> ​ " token_type " : "bearer "
>
> }

&nbsp;

### 4.当获取到 access_token 令牌后，我们就可以向 GitHub 请求获取用户信息了(这一步应该在服务端进行实现).

GitHub API 的地址是`https://api.github.com/user`，请求的时候必须在 HTTP 头信息里面带上令牌`Authorization: token 361507da`

> GET https://api.github.com/user
>
> headers:{
>
> ​ accept: "application/json",
>
> ​ Authorization: "Bearer access_token 值"
>
> }

作为回应， GitHub 会返回一段 JSON 数据，里面包含了用户的基本信息。

> {
>
> ​ bio: "Industry excels in diligence, wastefulness in play, action in thinking, destruction in following.",
> ​ blog: "",
> ​ company: null,
> ​ created_at: "2019-06-14T10:50:24Z",
> ​ email: null,
> ​ events_url: "https://api.github.com/users/xxxx/events{/privacy}",
> ​ followers: 1,
> ​ followers_url: "https://api.github.com/users/xxxxx/followers",
> ​ following: 1,
> ​ following_url: "https://api.github.com/users/xxxxx/following{/other_user}",
> ​ gists_url: "https://api.github.com/users/xxxxx/gists{/gist_id}",
> ​ gravatar_id: "",
> ​ hireable: null,
> ​ html_url: "https://github.com/xxxxx",
> ​ id: xxxxxxx,
> ​ location: "Xiamen, China",
> ​ login: "xxxxx",
> ​ name: "xxxxx",
> ​ node_id: "xxxxxxxxxx",
> ​ organizations_url: "https://api.github.com/users/xxxxxx/orgs",
> ​ public_gists: 0,
> ​ public_repos: 4,
> ​ received_events_url: "https://api.github.com/users/xxxxxx/received_events",
> ​ repos_url: "https://api.github.com/users/xxxxxx/repos",
> ​ site_admin: false,
> ​ starred_url: "https://api.github.com/users/xxxxxx/starred{/owner}{/repo}",
> ​ subscriptions_url: "https://api.github.com/users/xxxxxx/subscriptions",
> ​ twitter_username: null,
> ​ type: "User",
> ​ updated_at: "2021-08-05T15:15:18Z",
> ​ url: "https://api.github.com/users/xxxxxx",
>
> }

当获取到用户信息后，我们可以根据该用户信息登录我们自己的数据库中的账户或者进行注册账户，然后生成自己系统相应的 token；

我们也可以直接使用这些用户信息(临时性登录展示)

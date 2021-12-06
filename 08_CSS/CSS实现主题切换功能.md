通过 css 与 javascript 结合实现暗黑模式切换效果以及侧边菜单栏

> 使用到的图标库网站： https://ionic.io/ionicons

&nbsp;

功能实现代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Theme and SideBar Menu</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: "Poppins", sans-serif;
      }

      /* 自定义属性 --black与--white 可以在其他地方通过var()使用自定义属性 */
      :root {
        --black: #333;
        --white: #fff;
      }

      .dark {
        --black: #fff;
        --white: #333;
      }

      /* header样式 */
      header {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 40px 100px;
        z-index: 10000;
      }

      header .logo {
        position: relative;
        display: inline-flex;
        color: var(--black);
        text-decoration: none;
        font-size: 2em;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }

      /* 按钮样式 */
      .righSide {
        display: flex;
      }

      .btns {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-left: 10px;
      }

      .btns ion-icon {
        font-size: 1.5em;
        color: var(--black);
      }

      .btns.menuToggle ion-icon {
        font-size: 3em;
      }

      .btns ion-icon:nth-child(2) {
        display: none;
      }

      .btns.active ion-icon:nth-child(2) {
        display: block;
      }

      .btns.active ion-icon:nth-child(1) {
        display: none;
      }

      /* 内容样式 */
      .main {
        position: relative;
        width: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .main .backImg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .main h2 {
        position: relative;
        z-index: 3;
        font-size: 16vw;
        color: var(--black);
        text-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
      }

      /* 导航栏样式 */
      .navigation {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: var(--white);
        z-index: 4;
        transition: 0.5s;
      }

      .navigation.active {
        left: 0;
      }

      .navigation li {
        list-style: none;
      }

      .navigation li a {
        display: inline-flex;
        margin: 5px 0;
        font-size: 1.25em;
        text-decoration: none;
        color: var(--black);
        padding: 5px 20px;
        border-radius: 40px;
      }

      .navigation li a:hover {
        background: var(--black);
        color: var(--white);
      }

      /* 版权区样式 */
      .copyrightText {
        position: absolute;
        left: 100px;
        bottom: 40px;
        z-index: 4;
        font-weight: 500;
        font-size: 1.3em;
        color: var(--black);
      }

      /* 组织区样式 */
      .sci {
        position: absolute;
        right: 100px;
        bottom: 40px;
        z-index: 4;
      }

      .sci li {
        list-style: none;
      }

      .sci li a {
        text-decoration: none;
        color: var(--black);
        font-size: 1.75em;
      }

      /* 响应式 */
      @media screen and (max-width: 768px) {
        header {
          padding: 20px;
        }
        .copyrightText {
          left: 20px;
          bottom: 20px;
        }
        .sci {
          right: 20px;
          bottom: 10px;
        }
      }
    </style>
  </head>
  <body>
    <header>
      <a href="#" class="logo">Logo</a>
      <div class="righSide">
        <div class="btns dayNight">
          <ion-icon name="moon-outline"></ion-icon>
          <ion-icon name="sunny-outline"></ion-icon>
        </div>
        <div class="btns menuToggle">
          <ion-icon name="menu-outline"></ion-icon>
          <ion-icon name="close-outline"></ion-icon>
        </div>
      </div>
    </header>
    <section class="main">
      <!-- 这个图片可以被替换为视频或其他之类，相当于背景作用 -->
      <img src="/public/20211026.jpg" class="backImg" />
      <!-- 这里可以添加一个图片用于实现遮罩效果 -->
      <h2>Ocena</h2>
      <p class="copyrightText">© Online Tutorials -2021</p>
      <ul class="sci">
        <li>
          <a href="#"><ion-icon name="logo-facebook"></ion-icon></a>
        </li>
        <li>
          <a href="#"><ion-icon name="logo-twitter"></ion-icon></a>
        </li>
        <li>
          <a href="#"><ion-icon name="logo-instagram"></ion-icon></a>
        </li>
      </ul>
    </section>
    <!-- Sidebar Navigation -->
    <ul class="navigation">
      <li><a href="#">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Package</a></li>
      <li><a href="#">Contact</a></li>
    </ul>
    <script
      type="module"
      src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
    ></script>
    <script
      nomodule
      src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
    ></script>
    <script>
      // 获取元素
      let dayNight = document.querySelector(".dayNight");
      let menuToggle = document.querySelector(".menuToggle");
      let body = document.querySelector("body");
      let navigation = document.querySelector(".navigation");

      // 光亮/暗黑模式切换
      dayNight.onclick = function () {
        body.classList.toggle("dark");
        dayNight.classList.toggle("active");
      };

      // 菜单点击
      menuToggle.onclick = function () {
        menuToggle.classList.toggle("active");
        navigation.classList.toggle("active");
      };
    </script>
  </body>
</html>
```

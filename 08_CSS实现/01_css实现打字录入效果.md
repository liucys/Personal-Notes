#### css 实现打字录入效果

```html
<h1>Pure CSS Typing animation.</h1>
<style>
  h1 {
    color: #0fbcf9;
    font: bold 200% Consolas, Monaco, monospace;
    border-right: 0.1em solid;
    width: 16.5em;
    width: 26ch;
    margin: 2em 1em;
    white-space: nowrap;
    overflow: hidden;
    animation: typing 3s steps(26, end), cursor-blink 0.3s step-end infinite
        alternate;
  }

  @keyframes typing {
    from {
      width: 0;
    }
  }

  @keyframes cursor-blink {
    50% {
      border-color: transparent;
    }
  }
</style>
```

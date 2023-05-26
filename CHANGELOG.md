# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.1.0](https://github.com/zhuwei-ones/whistle.wisdom-dev/compare/v1.0.5-alpha.0...v1.1.0) (2023-05-23)


### Features

* 支持新dev 环境域名 ([aaf82f6](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/aaf82f656db83a8234cff6af26105b6df8d2de93))

### [1.0.5-alpha.0](https://github.com/zhuwei-ones/whistle.wisdom-dev/compare/v1.0.4...v1.0.5-alpha.0) (2023-01-05)

### [1.0.4](https://github.com/zhuwei-ones/whistle.wisdom-dev/compare/v1.0.3...v1.0.4) (2023-01-05)


### Features

* 关闭多环境开发时清除language cookie 不影响原来的功能 ([e88c71d](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/e88c71de221fe5d6ee354ed64a504410aeca1bf3))


### Bug Fixes

* **server:** 获取语言标识不能只通过origin，应该通过函数处理过的url ([6e89283](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/6e89283fafefa05d9eccfe360e05480a3500cec8))
* **server:** 接口 Response Header 只覆盖原cookie language，不做有效cookie 设置，以 前端脚本设置的为主 ([1b1b40d](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/1b1b40dde00e243ca3b47044ff1cf125f1d686c7))
* **server:** api_branch cookie 因为属于子域名，接口是父域名，所以携带不上，现在把 api_branch 设置为父域名，并且加上环境标识字段来区分不同环境的 接口指向 ([66c92e3](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/66c92e3f0d2340c3241fae7b50d0f951e6b6f2e2))

### [1.0.3](https://github.com/zhuwei-ones/whistle.wisdom-dev/compare/v1.0.2...v1.0.3) (2022-12-30)

### [1.0.2](https://github.com/zhuwei-ones/whistle.wisdom-dev/compare/v1.0.1...v1.0.2) (2022-12-26)

### 1.0.1 (2022-12-26)


### Features

* 环境选择面板动态显隐 + 动态表单 ([025806b](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/025806ba80c9b649ea1dd82958c4f9b9a9607b0a))
* 客户端环境选择基础架构 ([83da75b](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/83da75bac9c42d697a5ec1dc62cf71f0954dd9a5))
* 切换按钮读取当前环境信息，不和表单选择的结果绑定 ([c6ccfe9](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/c6ccfe913d2f30f0b414e08162558885f77ce53f))
* 设置API 指向可以配置域名 ([18c7ab4](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/18c7ab4de3b9e187911554363c0926ecfdf2410d))
* **client:** 添加API 分支指向 填写框 ([2987a66](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/2987a661e786ff631e4ac2fd1817aec1d46175a7))
* **client:** 支持跳转不同环境链接 ([79ab920](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/79ab920eb2dfca6c1e7eea5d12e259076805d36c))
* server 端初始架构 ([b6c89c2](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/b6c89c22f5661b48630dd2e288c513c8cc44a705))
* **server:** 页面注入api 分支 cookie，用于转发 api ([855d6fd](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/855d6fdac9e46f56fe77e678bf81aedae0961980))


### Bug Fixes

* 获取正确的请求 环境url ([7490fa5](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/7490fa54f2dfeefb0e1372e4b96c8bdac514ffc2))
* 解决请求代理跨域问题 ([c7e3f08](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/c7e3f08044d623e1f143f3c5212c0e9cb298a44e))

## 1.0.0 (2022-12-26)


### Features

* 环境选择面板动态显隐 + 动态表单 ([025806b](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/025806ba80c9b649ea1dd82958c4f9b9a9607b0a))
* 客户端环境选择基础架构 ([83da75b](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/83da75bac9c42d697a5ec1dc62cf71f0954dd9a5))
* 切换按钮读取当前环境信息，不和表单选择的结果绑定 ([c6ccfe9](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/c6ccfe913d2f30f0b414e08162558885f77ce53f))
* 设置API 指向可以配置域名 ([18c7ab4](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/18c7ab4de3b9e187911554363c0926ecfdf2410d))
* **client:** 添加API 分支指向 填写框 ([2987a66](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/2987a661e786ff631e4ac2fd1817aec1d46175a7))
* **client:** 支持跳转不同环境链接 ([79ab920](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/79ab920eb2dfca6c1e7eea5d12e259076805d36c))
* server 端初始架构 ([b6c89c2](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/b6c89c22f5661b48630dd2e288c513c8cc44a705))
* **server:** 页面注入api 分支 cookie，用于转发 api ([855d6fd](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/855d6fdac9e46f56fe77e678bf81aedae0961980))


### Bug Fixes

* 获取正确的请求 环境url ([7490fa5](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/7490fa54f2dfeefb0e1372e4b96c8bdac514ffc2))
* 解决请求代理跨域问题 ([c7e3f08](https://github.com/zhuwei-ones/whistle.wisdom-dev/commit/c7e3f08044d623e1f143f3c5212c0e9cb298a44e))

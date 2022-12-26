# ONES Project 多语言多环境配置独立开发

# 背景

当前开发 Project 不同环境是通过 ONES Helper 进行参数配置，比如 私有部署 或者 国内海外
如果某个迭代涉及到多个环境，那么我们就需要频繁修改参数，不停刷新

1. 国内 Sass
2. 国外 Sass
3. 国内私有
4. 国外私有

组合配置就有 4 种，如果加上多语言（当前只有 3 种语言，后续增加更多），就有 12 种配置
12 种配置的切换，就会导致我们开发效率低下，增加开发成本，消耗开发精力，降低环境校验成本，就能降低 bug 率

为了解决这个问题，基于 whistle 开发了这个 环境代理插件

## 安装

```sh
w2 install whistle.wisdom-dev
```

## 开发

**开发服务端&客户端**

```sh
npm run dev
```

**开发服务端**

```sh
npm run dev:server
npm run dev:w2
```

**开发客户端**

```sh

# 只编译前端资源
npm run dev:client-pack

# 编译前端资源并开启预览
npm run dev:client-view
```

## 发布

```sh

# 打版本
npm run release # 小版本
npm run release -- --release-as 1.1.0 # 定制版本

# 打包
npm run build

# 编译前端资源并开启预览
npm login
npm publish
```

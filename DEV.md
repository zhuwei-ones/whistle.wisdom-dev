## 开发文档

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
npm run release # 补丁版本，bug 修复，向下兼容。
npm run release-minor # 次版本号，添加功能或者废弃功能，向下兼容；
npm run release-major # 主版本号，软件做了不兼容的变更（breaking change 重大变更）；
npm run release -- --release-as 1.x.x # 定制版本

# 打包
npm run build


# 发布到私有源

# 私有源信息参考：https://our.ones.pro/wiki/?from_wecom=1#/team/RDjYMhKq/space/H8a3Zh9m/page/PgNzT55o

# 用私有源账号登录之后发布
npm login --registry=https://npm2.myones.net/

# 已经配置发布到 https://npm2.myones.net/
npm publish
```

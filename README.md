# flipcard

## 开发

- 安装依赖
```bash
pnpm install
```

- 启动开发环境
```bash
pnpm run dev

pnpm run dev:playground
```

- 打包
```bash
pnpm run build
```

- 发布
```bash
npm login
# 确保版本号已更新
pnpm version patch # 或 minor/major
# 预发布版本
# pnpm version prerelease --preid alpha
# 不触发commit和tag
pnpm version patch --no-git-tag-version
# 批量修改
pnpm -r version patch
# 提交代码
# 发布到 npm
pnpm run release
```
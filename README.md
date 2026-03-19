# Firefly Admin

独立后台（单独部署到 Vercel），通过 GitHub OAuth 登录后直接把内容文件提交到 `main` 分支，从而触发 Firefly 站点自动重建发布。

## 本地运行

1. 复制环境变量：

```bash
cp .env.example .env.local
```

2. 安装依赖并启动：

```bash
pnpm install
pnpm dev -- --port 3001
```

打开 `http://localhost:3001`。

## Vercel 部署

- **Root Directory**：`firefly-admin`
- **Build Command**：`pnpm run build`
- **Install Command**：`pnpm install`
- **Output**：Next.js 默认

需要在 Vercel 配置 `.env.example` 中的环境变量。


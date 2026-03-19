# Firefly Admin

Firefly Admin 是一个独立的后台管理系统，专门为 Firefly 博客站点设计。通过 GitHub OAuth 登录后，用户可以直接在后台管理内容，并将修改提交到 `main` 分支，从而触发 Firefly 站点的自动重建和发布。

## 功能特点

- **GitHub OAuth 认证**：安全的登录方式，利用 GitHub 账号进行身份验证
- **内容管理**：支持创建、编辑、删除博客文章和动态
- **实时预览**：编辑内容时可以实时预览效果
- **自动部署**：提交内容后自动触发 Firefly 站点的重建和发布
- **响应式设计**：适配不同设备的屏幕尺寸

## 技术栈

- **前端框架**：Next.js 14
- **认证系统**：NextAuth.js
- **样式方案**：Tailwind CSS
- **类型系统**：TypeScript
- **构建工具**：Webpack (Next.js 默认)
- **包管理器**：pnpm

## 环境要求

- Node.js 18.0 或更高版本
- pnpm 7.0 或更高版本
- GitHub 账号（用于 OAuth 登录）

## 本地开发

### 1. 克隆项目

```bash
git clone <repository-url>
cd firefly-admin
```

### 2. 配置环境变量

复制 `.env.example` 文件并修改为 `.env.local`，然后填写相应的环境变量：

```bash
cp .env.example .env.local
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:3000` 运行。

## Vercel 部署

### 1. 准备工作

- 确保项目已提交到 GitHub 仓库
- 注册并登录 Vercel 账号

### 2. 部署步骤

1. 在 Vercel 控制台点击 "New Project"
2. 选择你的 GitHub 仓库
3. 配置部署设置：
   - **Root Directory**：`firefly-admin`（如果项目在子目录中）
   - **Build Command**：`pnpm run build`
   - **Install Command**：`pnpm install`
   - **Output Directory**：保持默认（Next.js 默认）
4. 配置环境变量（在 Vercel 控制台的 "Environment Variables" 部分），添加 `.env.example` 中的所有变量
5. 点击 "Deploy" 按钮开始部署

### 3. 部署后配置

- 部署完成后，Vercel 会提供一个域名
- 在 GitHub OAuth 应用设置中，将该域名添加到 "Authorized callback URLs"

## 项目结构

```
firefly-admin/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (sections)/     # 页面分组
│   │   │   ├── moments/    # 动态管理
│   │   │   └── posts/      # 文章管理
│   │   ├── api/            # API 路由
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # 组件
│   │   └── Editor.tsx      # 编辑器组件
│   ├── lib/                # 工具库
│   │   ├── api-auth.ts     # API 认证
│   │   ├── auth.ts         # 认证相关
│   │   ├── env.ts          # 环境变量
│   │   ├── github.ts       # GitHub API 交互
│   │   ├── matter.ts       # 内容解析
│   │   └── path-guard.ts   # 路径保护
│   └── middleware.ts       # 中间件
├── .env.example            # 环境变量示例
├── .env.local              # 本地环境变量（不提交）
├── .eslintrc.json          # ESLint 配置
├── .gitignore              # Git 忽略文件
├── next-env.d.ts           # Next.js 类型声明
├── next.config.mjs         # Next.js 配置
├── package.json            # 依赖配置
├── pnpm-lock.yaml          # pnpm 锁定文件
├── postcss.config.js       # PostCSS 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── tsconfig.json           # TypeScript 配置
└── tsconfig.tsbuildinfo    # TypeScript 构建信息
```

## 环境变量

项目需要以下环境变量：

| 变量名 | 描述 | 示例 |
|-------|------|------|
| `NEXTAUTH_URL` | 应用的基础 URL | `http://localhost:3000` |
| `GITHUB_ID` | GitHub OAuth 应用的客户端 ID | `your-github-client-id` |
| `GITHUB_SECRET` | GitHub OAuth 应用的客户端密钥 | `your-github-client-secret` |
| `REPO_OWNER` | GitHub 仓库所有者 | `your-github-username` |
| `REPO_NAME` | GitHub 仓库名称 | `your-repo-name` |
| `BRANCH_NAME` | 目标分支名称 | `main` |

## 贡献指南

1. Fork 项目仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 LICENSE 文件

## 联系方式

- 项目链接：[https://github.com/your-username/firefly-admin](https://github.com/your-username/firefly-admin)
- 问题反馈：[https://github.com/your-username/firefly-admin/issues](https://github.com/your-username/firefly-admin/issues)
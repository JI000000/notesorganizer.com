# NotesOrganizer.com

**超越笔记记录，掌控知识管理**

[🌐 在线体验](https://www.notesorganizer.com) | [📚 知识中心](https://www.notesorganizer.com/knowledge-hub) | [🛠️ AI工具](https://www.notesorganizer.com/tools)

---

NotesOrganizer.com 是新一代AI驱动的个人知识管理平台。我们不仅提供深度的PKM知识内容，更通过智能AI工具帮助用户将分散的笔记转化为结构化的知识库。

## ✨ 核心功能

### 🧠 基础AI工具 (4个)
- **[AI笔记摘要器](https://www.notesorganizer.com/tools/summarizer)**: 智能提取笔记核心要点
- **[AI标题生成器](https://www.notesorganizer.com/tools/title-generator)**: 生成吸引人的标题和内容
- **[AI标签建议器](https://www.notesorganizer.com/tools/tag-suggester)**: 智能推荐相关标签
- **[动作提取器](https://www.notesorganizer.com/tools/action-extractor)**: 从笔记中提取可执行任务

### 🚀 高级工具系统 (3个)
- **[AI工作台](https://www.notesorganizer.com/workbench)**: 完整笔记集合分析和处理
- **[协作中心](https://www.notesorganizer.com/collaboration-hub)**: 团队知识协作平台
- **[研究笔记](https://www.notesorganizer.com/research-notes)**: 专业研究管理系统

### 📚 知识中心
- **[PKM终极指南](https://www.notesorganizer.com/knowledge-hub/pkm-ultimate-guide)**: 个人知识管理完整指南
- **[Zettelkasten方法](https://www.notesorganizer.com/knowledge-hub/zettelkasten-method)**: 卡片笔记系统详解
- **[PKM工具评测](https://www.notesorganizer.com/knowledge-hub/pkm-tools-review)**: 主流工具深度对比
- **[PKM基础理论](https://www.notesorganizer.com/knowledge-hub/pkm-foundations-zettelkasten-para-lyt)**: 理论框架解析

## 🛠️ 技术架构

### 前端技术栈
- **Next.js 14** - 现代React框架，App Router
- **TypeScript** - 类型安全的JavaScript
- **Tailwind CSS** - 现代CSS框架
- **Lucide React** - 现代图标库

### 后端架构
- **Vercel Serverless Functions** - 无服务器API
- **OpenRouter.ai** - AI模型智能路由
- **Vercel KV** - 键值存储数据库
- **JSZip** - 文件压缩处理

### AI能力
- **多模型支持**: Claude 3.5 Sonnet、GPT-4o、GPT-3.5 Turbo
- **智能路由**: 根据任务复杂度自动选择最优模型
- **成本优化**: 开发环境Mock，生产环境智能降级
- **批量处理**: 异步任务队列，支持大规模笔记处理

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/notesorganizer.git
cd notesorganizer
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
创建 `.env.local` 文件：
```env
# AI服务配置
OPENROUTER_API_KEY=your_openrouter_api_key

# 数据库配置  
KV_REST_API_URL=your_vercel_kv_url
KV_REST_API_TOKEN=your_vercel_kv_token

# 开发环境配置
DISABLE_AI_IN_DEV=true
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
notesorganizer/
├── app/                    # Next.js应用路由
│   ├── api/               # API路由
│   │   ├── generate-title/  # 标题生成API
│   │   ├── generate-tags/   # 标签建议API
│   │   ├── extract-actions/ # 动作提取API
│   │   ├── summarize/       # 摘要API
│   │   └── project/         # 项目处理API
│   ├── tools/             # AI工具页面
│   ├── workbench/         # AI工作台
│   ├── collaboration-hub/ # 协作中心
│   ├── research-notes/    # 研究笔记
│   └── knowledge-hub/     # 知识中心
├── components/            # React组件
│   ├── layout/           # 布局组件
│   ├── sections/         # 页面区块
│   ├── workbench/        # 工作台组件
│   ├── collaboration/    # 协作组件
│   └── research/         # 研究组件
├── lib/                  # 工具函数
│   ├── ai/              # AI处理模块
│   ├── posts.ts         # 博客文章处理
│   └── project-upload.ts # 项目上传处理
├── docs/                 # 项目文档
├── posts/                # 博客文章
└── public/               # 静态资源
```

## 🧪 测试

### 运行测试
```bash
npm test
```

### 测试覆盖率
```bash
npm run test:coverage
```

### API测试
所有API端点都有完整的单元测试覆盖：
- ✅ 生成标题API: 4/4 tests passed
- ✅ 标签建议API: 4/4 tests passed  
- ✅ 动作提取API: 4/4 tests passed
- ✅ 摘要API: 4/4 tests passed
- ✅ 项目处理API: 完整测试覆盖

## 📊 功能特色

### 🎯 用户学习路径
- **新手路径**: 从基础概念到实践应用
- **内容创作者**: 专注内容组织和创作工具
- **研究者**: 深度研究和知识管理需求

### 🔒 数据安全
- **本地优先**: 支持本地文件处理
- **隐私保护**: 不存储用户敏感数据
- **数据主权**: 用户完全控制自己的数据

### 🌟 用户体验
- **响应式设计**: 完美适配所有设备
- **暗色主题**: 现代玻璃拟态设计
- **即时反馈**: 实时状态更新和错误提示
- **无障碍**: 支持键盘导航和屏幕阅读器

## 🚀 部署

### Vercel部署
```bash
npm run build
vercel --prod
```

### 环境变量配置
在Vercel项目设置中添加所需的环境变量。

## 📈 产品路线图

### 当前版本 (v1.0)
- ✅ 7个完整AI工具
- ✅ 知识中心和博客系统
- ✅ 响应式用户界面
- ✅ 完整的API测试覆盖

### 即将推出
- 🔄 知识图谱可视化
- 🔄 多语言支持
- 🔄 用户协作功能
- 🔄 移动端原生应用

## 🤝 贡献指南

查看 [docs/03_WORKFLOW_AND_STANDARDS.md](./docs/03_WORKFLOW_AND_STANDARDS.md) 了解开发流程和代码规范。

## 📄 许可证

本项目采用 MIT 许可证。

## 🔗 相关链接

- [项目文档](./docs/README.md)
- [系统架构](./docs/01_ARCHITECTURE.md)
- [部署指南](./docs/02_DEPLOYMENT.md)
- [开发标准](./docs/03_WORKFLOW_AND_STANDARDS.md)

---

**打造下一代个人知识管理平台** 🚀

*Built with ❤️ by the NotesOrganizer team* 
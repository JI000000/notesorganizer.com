# NotesOrganizer 知识管理与流程标准（复盘版）

---

## 阶段性复盘与知识沉淀（2024-07-03）

### 1. 代码现状与架构检视
- 前端：Next.js 14 + App Router，分主站内容、工具页、工作台三大模块，UI美观大气。
- 后端：API路由分免费工具、项目核心、等待名单等。
- AI能力：lib/ai/model-router.ts实现智能模型路由，自动切换与成本优化。
- 分析引擎：lib/ai/note-analyzer.ts实现完整笔记AI分析流程，支持mock数据。
- KV存储：支持Vercel KV与本地mock，开发/生产环境无缝切换。
- 测试：API端点均有Vitest单元测试，mock依赖，保证健壮性。
- 文档：docs/目录下有架构、部署、流程等文档，STAGE2_SUMMARY.md有阶段性总结。

### 2. 主要决策与执行回顾
- 三阶段战略：Lighthouse→Workbench→Observatory。
- 产品定位：专注"知识库整理"垂直场景，强调智能结构化、隐私友好、极致体验。
- 技术原则：一次性做对，高质量、快交付、低成本、可扩展。
- AI模型路由：OpenRouter聚合多模型，自动选择最优模型。
- API设计：所有AI相关API均有mock模式，开发环境不消耗额度。
- 输入限制：免费工具2000字上限，防止滥用。
- 状态管理：工作台任务全流程状态可追踪，支持断点恢复。

### 3. 设计与实现对比分析
| 设计目标                | 实现现状                | 差距与原因           |
|-------------------------|-------------------------|----------------------|
| 免费工具输入限制提示    | 已实现（最新修复）      | mock模式下曾失效，已修正 |
| 工具页UI美观分栏        | 已实现                  | 一度回归为上下，已恢复 |
| 工作台状态持久化        | 已实现                  | 早期刷新丢失，已修复   |
| AI模型智能切换          | 已实现                  | -                    |
| 本地开发零成本          | 已实现                  | -                    |
| API单元测试覆盖         | 已实现                  | -                    |

### 4. 问题与解决方案知识卡片
- mock模式下输入校验失效：将输入校验逻辑提前，无论mock还是真实AI都先校验。
- 工具页UI回归：恢复为左右分栏，提升可读性和美观度。
- 工作台刷新丢失进度：localStorage持久化jobId和状态，刷新后自动拉取结果。
- 高API成本风险：模型降级、mock模式、输入限制、开发环境禁用AI。

### 5. 流程、规则、标准与最佳实践
- 开发环境一律DISABLE_AI_IN_DEV=true，防止意外消耗。
- 所有API必须有mock能力和单元测试。
- 前端所有输入都要有长度限制和用户友好提示。
- UI设计遵循现代深色风格，分栏布局优先。
- 状态管理要支持断点恢复和异常处理。
- 文档与知识沉淀要及时更新，形成团队知识库。

### 6. 高效对话模板与Prompts
- 角色设定：你是我的联合创始人、全栈架构师、产品经理、LLM专家、PKM专家、SEO专家、资深网虫和blog作家。
- 需求描述模板：现在我们要实现xxx功能，目标是xxx，要求xxx。请你一步步分析、设计、实现，并严格自查，确保一次性做对。
- 复盘与知识管理模板：请你对本次开发过程进行全面复盘，输出架构、流程、标准、问题与解决方案、最佳实践、知识沉淀等文档，并提出改进建议。

### 7. 差距分析与改进建议
- mock模式下输入校验一度失效，说明流程设计上要始终优先用户输入校验，不能因开发便利牺牲用户体验。
- UI回归问题说明前端改动要有回归测试，UI/UX标准要文档化。
- 工作台状态丢失说明状态持久化和异常处理要全流程覆盖。
- 所有API和前端输入校验逻辑必须单元测试覆盖，防止mock/真实分支不一致。
- UI/UX标准文档化，每次改动都要对照标准回归。
- 知识管理流程固化，每次复盘都要输出知识卡片，沉淀到团队知识库。
- 与AI助手对话要结构化、目标导向、可追溯，避免模糊沟通。

---

# 03: Workflow, Standards, and Best Practices

This document serves as the operational handbook for the `notesorganizer.com` project. It codifies the processes and standards we've developed to ensure efficient, high-quality execution.

## 1. Our Golden Workflow

We follow an agile, iterative loop that combines human strategic direction with AI execution speed.

1.  **Vision & Strategy (Human-led)**: The project lead defines the high-level goals, target audience, and strategic direction.
2.  **Specific Requirements & Design (Human-led)**: The lead translates the vision into concrete, actionable requirements. For UI/UX, this includes providing "design blueprints" in text format, detailing structure, components, and copy.
3.  **Rapid Implementation (AI-led)**: The AI co-founder takes the specific requirements and executes them, generating code, content, or other assets.
4.  **Testing & Feedback (Human-led)**: The lead acts as the first user, testing the implementation against the requirements, checking for bugs, and evaluating the user experience.
5.  **Iterative Refinement (AI-led)**: The AI co-founder incorporates the feedback to debug, refactor, and polish the final output.

This cycle allows us to move from idea to implementation with maximum velocity.

## 2. Technical & Design Standards

- **Core Tech Stack**: Next.js, Tailwind CSS, MDX, Vercel.
- **AI API Standard**: **OpenRouter.ai** is the exclusive gateway for all AI-powered features.
- **Design Language**: A clean, modern, "glassmorphism" style built on a dark theme. The goal is consistency across all user-facing components.
- **Content Strategy**: A dual approach of:
    - **Pillar Content**: High-quality, long-form articles to build SEO authority.
    - **Micro-Tools**: Free, useful AI tools that act as user hooks and demonstrate product value.
- **Code Standards**:
    - **Environment Variables**: All sensitive keys (like API keys) must be stored as environment variables and accessed via `.env.local` for local development, never hard-coded.
    - **Component Reusability**: Strive to create shared, reusable components (e.g., layouts) to maintain consistency and reduce code duplication.

## 3. 人机协同：如何与你的AI联合创始人高效对话 (The Dialogue: High-Efficiency Prompts for Your AI Co-founder)

This is our collaboration playbook. To ensure the AI co-founder can deliver the best results, use these optimized prompt templates.

-   **【战略规划指令 | Strategic Planning】**
    -   `"Boss, let's start [quarterly/monthly] strategic planning. As our [all-in-one role], analyze the following [data/market report/user feedback] and create the next phase's [product/market/tech] strategy. The goal is [specific target, e.g., increase user retention by 20%]. Please provide at least three alternative plans with their pros and cons."`

-   **【新功能开发指令 | New Feature Development】**
    -   `"Boss, we need to build a new feature: '[feature name]'. Its core value is [one-sentence description]. Design the full-stack architecture for me, including [API endpoints, database schema, key algorithms]. Then, start implementing it step-by-step, beginning with [the most critical file]."`

-   **【精准调试指令 | Precision Debugging】(You have mastered this one)**
    -   `"Boss, the app has crashed. When I [performed an action], the frontend showed [description from screenshot], and the console/terminal logs are as follows [paste logs]. As our principal engineer, diagnose the root cause and fix it immediately."`

-   **【代码优化指令 | Code Optimization】**
    -   `"Boss, review [filename or directory]. This code works, but I believe it can be optimized for [performance/readability/cost]. Propose a refactoring plan, explain the reasoning, and then execute it."`

-   **【内容创作指令 | Content Creation】**
    -   `"Boss, we need a blog post on '[topic]'. The target keyword is '[long-tail keyword]'. As our in-house [PKM expert/tech blogger], write a deep, professional, and valuable article for our readers."` 
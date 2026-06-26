# 夏一站 SummerPause ☀️

> 像冰块一样凉爽的求职治愈伴侣。为职场 Gap 人群设计，缓解焦虑，重拾自信，科学求职。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey)

## 核心功能

通过「求职生命周期」理念，提供从内心治愈到求职落地的全方位支持：

| 模块 | 功能 |
|------|------|
| **01. 愈心面板** | 漂流瓶式 Gap 期鼓励语录 + 播客胶囊（玻璃质感随机推荐 + 收藏） |
| **02. 深度知己** | 霍兰德 RIASEC 测试、职业锚、盖洛普优势识别、Ikigai 图谱 |
| **03. 广度知彼** | AI 行业深度洞察 + 宏观数据/行业研报/薪酬需求/政策风口资源库 |
| **04. 求职渠道** | Google 高级搜索指令构建器，精准锁定内推/官推/社群面经/体制内岗位 |
| **05. 简历工坊** | 经验资产库 + AI 简历适配分析 + 版本管理 |
| **06. 探索记录** | 结构化投递管理、面试复盘、数据可视化（森林之径 + 统计面板） |
| **07. 听见可能** | 精选职场/女性成长/商业科技等播客推荐 |

## AI 模型支持

支持任何兼容 **OpenAI API 格式** (`/v1/chat/completions`) 的大语言模型，内置预设：

| 服务商 | 默认模型 |
|--------|----------|
| **DeepSeek** (默认) | `deepseek-chat` |
| **OpenAI** | `gpt-4o-mini` |
| **Google Gemini** | `gemini-2.0-flash` |
| **Moonshot (月之暗面)** | `moonshot-v1-8k` |
| **智谱 AI** | `glm-4-flash` |
| **SiliconFlow (硅基流动)** | `deepseek-ai/DeepSeek-V3` |
| **自定义中转站** | 自由填写 Base URL + Model |

点击页面右上角 ⚙️ 设置按钮即可配置，支持「测试连通性」一键验证。所有 API Key 安全存储在本地浏览器中，不会上传到任何服务器。

## 快速开始

```bash
# 克隆项目
git clone https://github.com/your-username/SummerPause.git
cd SummerPause

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# → http://localhost:3000

# 构建生产版本
npm run build

# 类型检查
npm run lint
```

## 项目结构

```
src/
├── App.tsx                   # 路由壳 + 全局布局
├── main.tsx                  # 入口
├── index.css                 # 主题变量 + 暗色模式
├── components/               # 复用 UI 组件
│   ├── Toast.tsx             # Toast 通知
│   ├── NavItem.tsx           # 导航项
│   ├── StatCard.tsx          # 数据卡片
│   ├── EditorField.tsx       # 编辑字段
│   ├── ReviewField.tsx       # 审阅字段
│   ├── AssetItem.tsx         # 资产卡片
│   ├── CategoryBtn.tsx       # 分类按钮
│   ├── IkigaiInput.tsx       # Ikigai 输入框
│   └── ForestPath.tsx        # 森林路径可视化
├── pages/                    # 页面组件（lazy loaded）
│   ├── Dashboard.tsx         # 愈心面板 + 播客胶囊
│   ├── KnowSelf.tsx          # 深度知己
│   ├── KnowOthers.tsx        # 广度知彼
│   ├── JobChannels.tsx       # 求职渠道
│   ├── ResumeWorkshop.tsx    # 简历工坊
│   ├── Tracker.tsx           # 探索记录
│   ├── PodcastPage.tsx       # 听见可能
│   └── tools/                # 交互式测评工具
│       ├── HollandTestTool.tsx
│       ├── CareerAnchorsTool.tsx
│       ├── StrengthsTool.tsx
│       └── IkigaiTool.tsx
├── hooks/                    # 自定义 Hooks
│   ├── useLocalStorage.ts    # 本地存储管理
│   ├── useDarkMode.ts        # 暗色模式切换
│   └── useToast.ts           # Toast 通知管理
├── data/                     # 静态数据
│   ├── encouragements.ts     # 漂流瓶语录库
│   └── podcasts.ts           # 播客节目数据
├── lib/
│   └── gemini.ts             # AI API 客户端（OpenAI 兼容）
└── types/
    └── index.ts              # 共享 TypeScript 类型
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript 5.8 |
| 构建 | Vite 6（React.lazy 代码分割） |
| 样式 | Tailwind CSS 4（CSS 变量主题 + 暗色模式） |
| 动画 | Motion (Framer Motion) |
| 图表 | Recharts |
| 图标 | Lucide React |
| 日期 | date-fns |
| 截图 | html2canvas |
| Markdown | react-markdown |

## 特性亮点

- **夏日清凉主题**：蓝色调主题 + 暗色模式，告别焦虑绿
- **播客胶囊**：玻璃质感随机推荐，支持收藏，内置 20+ 精选节目
- **移动端适配**：底部 Tab 导航，小屏也能顺畅使用
- **Toast 通知**：统一的成功/错误/信息提示，区分「未配置 Key」「网络错误」「模型不可用」
- **API 连通性测试**：配置后一键验证 Key 和 Base URL 是否可用
- **数据安全**：所有数据存储在浏览器 localStorage，支持 CSV/JSON 导出备份与导入恢复
- **零后端依赖**：纯前端 SPA，部署到任意静态托管平台即可

## 数据隐私

所有用户数据（经验资产、简历版本、投递记录、API Key 配置、播客收藏）均存储在浏览器 `localStorage` 中，不会发送到除 AI API 以外的任何服务器。支持一键导出备份和导入恢复。

## 开源协议

本项目采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议开源。

- **署名**：须给出适当署名并提供协议链接
- **非商业性使用**：不得用于商业目的
- **相同方式共享**：衍生作品须采用相同协议

<h1 align="center">PKBET</h1>

### 项目架构规范
**核心目录**

```
src/
├── api/                 # API 接口定义
├── assets/              # 静态资源
│   ├── images/          # 图片资源
│   └── svg/             # SVG 图标
├── components/          # 公共组件
│   ├── Base/            # 基础组件
│   └── [Page]/          # 页面组件
├── composables/         # 组合式函数
├── config/              # 配置文件
├── constants/           # 常量定义
├── hooks/               # 自定义 Hooks
├── locales/             # 国际化文件
├── pages/               # 页面文件
├── router/              # 路由配置
├── stores/              # 状态管理
├── styles/              # 全局样式
├── types/               # TypeScript 类型
├── utils/               # 工具函数
└── web-base/            # 基础模块，ws 协议等
```

### 1.开发规范

#### 1.1 开发环境要求

**Node.js 版本**

- 必须使用 Node.js v20.19.3 或更高版本
- 使用 `nvm` 或 `volta` 管理 Node.js 版本

**包管理器**

- 统一使用 `pnpm` 作为包管理器
- 版本要求：pnpm@10.12.3 或更高

**IDE 配置**

- 推荐使用 VS Code
- 安装项目推荐的扩展（见 `.vscode/extensions.json`）
- 启用自动保存和格式化

#### 1.2 项目启动流程

**首次启动**

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev
```

**日常开发**

```bash
# 启动开发服务器（包含 Mock 服务）
pnpm dev

# 类型检查
pnpm typecheck

# 代码检查
pnpm lint

# 自动修复代码格式
pnpm lint:fix
```

#### 1.3 构建部署规范

**构建命令**

```bash
# 开发环境构建
pnpm build:dev

# 生产环境构建
pnpm build:pro

# 预览构建结果
pnpm preview
```

**环境变量**

- 开发环境：`.env.development`
- 生产环境：`.env.production`
- 本地环境：`.env.local`（不提交到版本控制）

#### 2.4 版本管理规范

**分支策略**

- `main`：主分支，用于生产环境
- `develop`：开发分支，用于集成测试
- `feature/*`：功能分支，用于新功能开发





### 2. 代码规范

#### 2.1 CSS 样式规范

**UnoCSS 原子化 CSS**

- 优先使用 UnoCSS 原子类
- 自定义快捷方式在 `uno.config.ts` 中定义
- 支持响应式设计和暗色模式

**常用快捷方式**

```typescript
// 布局相关
['flex-center', 'flex justify-center items-center']
  ['flex-x-center', 'flex justify-center']
  ['flex-y-center', 'flex items-center']
  ['wh-full', 'w-full h-full']

// 文本相关
  ['text-overflow', 'overflow-hidden whitespace-nowrap text-ellipsis']
  ['text-break', 'whitespace-normal break-all break-words']
```

**样式优先级**

1. UnoCSS 原子类（推荐）
2. 组件内 scoped 样式
3. 全局样式（谨慎使用）

#### 2.2 路由规范

**页面路由定义**

```vue
<route lang="json5">
{
  name: 'home',
  meta: {
    title: '首页',
    i18n: 'menus.home',
    keepAlive: true // 是否开启页面缓存
  },
}
</route>
```

**路由命名**

- 使用 kebab-case 命名
- 页面文件放在 `src/pages/` 目录下
- 支持嵌套路由和动态路由

#### 2.3 国际化规范

**语言文件结构**

```json
{
  "menus": {
    "home": "🏠 主页",
    "profile": "个人中心"
  },
  "login": {
    "login": "登录",
    "email": "邮箱",
    "password": "密码"
  }
}
```

**使用方式**

```vue
<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>{{ t('menus.home') }}</div>
</template>
```

#### 2.5 提交规范

**提交类型**

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 3.demo示例

#### 3.1 ws 请求示例

**使用 wsRequest 组合式函数（推荐）**

```typescript
// 引入 wsRequest
import { NetMsgType } from '@/web-base/netBase/NetMsgType'
// wsRequest<RequestType, ResponseType>(
//   data: RequestType,           // 请求数据
//   msgId: number,              // 消息ID
//   config: {
//     needLogin: boolean = false, // 是否需要登录
//     timeout: number = 10000     // 超时时间（毫秒）
//     callbackId: numeber         // 回调事件 ID
//   }
// ): Promise<ResponseType>
async getUserLoginInfo(loginInfo: ReqLoginPacket) {
  return await wsRequest<ReqLoginPacket, ResNodifyLoginPacket>(loginInfo, NetMsgType.msgType.msg_req_login, {
    callbackId: NetMsgType.msgType.msg_nodify_login,
  })
},
async getUserInfo() {
  this.userInfo = await wsRequest({}, NetMsgType.msgType.msg_notify_user_info, {
    needLogin: true,
  })
},
```

**全局事件监听（推荐使用 useWsEvent）**

```typescript
// 引入 useWsEvent
import { useWsEvent } from '@/composables/useWsEvent'
import { WsEventName } from '@/types/ws-events'

// 在组件中使用 useWsEvent 监听事件
// 组件卸载时会自动移除监听，无需手动清理
useWsEvent('msg_nodify_login', (payload: any) => {
  if (payload.code == 1) {
    // 登录成功处理
    syncLoginStatusFromServe()
  }
})
```
#### 3.2 svg icon使用示例

**自定义SVG图标**

```vue
<template>
  <!-- 使用自定义SVG图标 -->
  <div class="flex gap-4 items-center">
    <!-- 方式一：使用 i-custom: 前缀 -->
    <div class="i-custom:avatar text-size-24 text-blue-500" />
    
    <!-- 方式二：使用 i-svg: 前缀 -->
    <div class="i-svg:dark-close_icon text-size-20 text-red-500" />
    
    <!-- 方式三：使用 i-svg: 前缀（带路径） -->
    <div class="i-svg:dark-refresh text-size-18 text-green-500" />
  </div>
</template>

<script setup lang="ts">
// SVG图标会自动从 src/assets/svg/ 目录加载
// 文件名会自动转换为图标名称
</script>
```

**图标使用示例**

```vue
<template>
  <div class="icon-demo">
    <!-- 基础图标 -->
    <div class="i-custom:avatar" />
    
    <!-- 带样式的图标 -->
    <div class="i-custom:avatar text-size-24 text-red-500 hover:text-red-700" />
    
    <!-- 响应式图标 -->
    <div class="i-custom:avatar text-size-16 md:text-size-20 lg:text-size-24" />
  </div>
</template>

```

#### 3.3 深浅模式使用示例

**基础使用**

```vue
<template>
  <div class="theme-demo">
    <!-- 使用 dark: 前缀的响应式类 -->
    <div class="bg-white text-gray-900 dark:bg-gray-800 dark:text-white p-4 rounded-lg">
      <h2 class="text-size-20 font-bold mb-4">深浅模式示例</h2>
      
      <!-- 卡片组件 -->
      <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
        <p class="text-gray-700 dark:text-gray-300">
          这是一个支持深浅模式的卡片组件
        </p>
      </div>
      
      <!-- 按钮组件 -->
      <button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
        切换主题
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDark, toggleDark } from '@/composables/dark'

// 切换深浅模式
function handleToggleTheme() {
  toggleDark()
}
</script>
```

**组件中的深浅模式**

```vue
<template>
  <div class="component-demo">
    <!-- 导航栏 -->
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center px-4 py-3">
        <h1 class="text-size-18 font-bold text-gray-900 dark:text-white">
          应用标题
        </h1>
        
        <!-- 主题切换按钮 -->
        <button 
          @click="handleToggleTheme"
          class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <div v-if="isDark" class="i-carbon:sun text-size-20 text-yellow-500" />
          <div v-else class="i-carbon:moon text-size-20 text-gray-600" />
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { isDark, toggleDark } from '@/composables/dark'

function handleToggleTheme() {
  toggleDark()
}
</script>
```

#### 3.4 文件路由配置示例

**基础页面路由**

```vue
<!-- src/pages/home/index.vue -->
<template>
  <PageContainer>
    <div class="home-page">
      <h1>首页内容</h1>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
// 页面逻辑
</script>

<route lang="json5">
{
  name: 'home',
  meta: {
    title: '首页',
    i18n: 'menus.home',
    keepAlive: true
  },
}
</route>
```

**嵌套路由**

```vue
<!-- src/pages/user/[id].vue -->
<template>
  <PageContainer>
    <div class="user-detail">
      <h1>用户详情: {{ $route.params.id }}</h1>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const userId = computed(() => route.params.id)
</script>

<route lang="json5">
{
  name: 'user-detail',
  meta: {
    title: '用户详情',
    i18n: 'menus.userDetail'
  },
}
</route>
```

**动态路由**

```vue
<!-- src/pages/product/[category]/[id].vue -->
<template>
  <PageContainer>
    <div class="product-detail">
      <h1>产品详情</h1>
      <p>分类: {{ category }}</p>
      <p>产品ID: {{ productId }}</p>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
const route = useRoute()
const category = computed(() => route.params.category)
const productId = computed(() => route.params.id)
</script>

<route lang="json5">
{
  name: 'product-detail',
  meta: {
    title: '产品详情',
    i18n: 'menus.productDetail'
  },
}
</route>
```

### 4. 其他

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite 6](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild) - 提升开发效率！

- 🗂 [基于文件的路由](./src/router)

- 📦 [组件自动化加载](./src/components)

- 🍍 [使用 Pinia 的状态管理](https://pinia.vuejs.org)

- 📲 [PWA](https://github.com/antfu/vite-plugin-pwa)

- 🎨 [UnoCSS](https://github.com/antfu/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

- 🌍 [I18n 国际化开箱即用](./src/locales)

- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)

- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入

- 💾 [本地数据模拟](https://github.com/pengzhanbo/vite-plugin-mock-dev-server)的支持

- 🌈 Git hooks - 提交代码 eslint 检测 和 提交规范检测

- 🪶 [Vant](https://github.com/youzan/vant) - 移动端 Vue 组件库

- 🔭 [vConsole](https://github.com/vadxq/vite-plugin-vconsole) - 移动端网页开发工具

- 📱 浏览器适配 - 使用 viewport vw/vh 单位布局

- 💻 [桌面端优化](https://github.com/wswmsword/postcss-mobile-forever) - 处理为移动端视图

- 🌓 支持深色模式

- 🛡️ 将 [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 设为默认

<br>

#### 开发工具

- [TypeScript](https://www.typescriptlang.org/)
- [pnpm](https://pnpm.js.org/) - 快, 节省磁盘空间的包管理器
- [VS Code Extensions](./.vscode/extensions.json)
  - [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 `<script setup>` IDE 支持
  - [Unocss](https://marketplace.visualstudio.com/items?itemName=antfu.unocss) - Unocss 智能提示
  - [Goto Alias](https://marketplace.visualstudio.com/items?itemName=antfu.goto-alias) - 跳转到定义
  - [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify) - 图标内联显示和自动补全
  - [File Nesting](https://marketplace.visualstudio.com/items?itemName=antfu.file-nesting) - 文件嵌套
  - [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally) - 多合一的 I18n 支持
  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - ESLint 支持
  - [Better JSON5](https://marketplace.visualstudio.com/items?itemName=blueglassblock.better-json5) - JSON5 支持

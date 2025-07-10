<script setup lang="ts">
import SideMenu from '@/components/SideMenu.vue'
import type { MenuItem } from '@/types/menu'
import { computed, ref } from 'vue'

// 示例菜单数据
const menuItems = ref<MenuItem[]>([
  {
    id: 'dashboard',
    name: '仪表板',
    icon: 'i-carbon:dashboard',
    route: '/dashboard',
    count: 0,
  },
  {
    id: 'games',
    name: '游戏管理',
    icon: 'i-carbon:game-console',
    count: 156,
    children: [
      { id: 'slot', name: '老虎机', icon: 'i-carbon:game-console', route: '/games/slot', count: 89 },
      { id: 'live', name: '真人娱乐', icon: 'i-carbon:video', route: '/games/live', count: 23 },
      { id: 'sports', name: '体育博彩', icon: 'i-carbon:basketball', route: '/games/sports', count: 44 },
    ],
  },
  {
    id: 'users',
    name: '用户管理',
    icon: 'i-carbon:user-multiple',
    route: '/users',
    count: 1024,
  },
  {
    id: 'orders',
    name: '订单管理',
    icon: 'i-carbon:shopping-cart',
    route: '/orders',
    count: 89,
  },
  {
    id: 'analytics',
    name: '数据分析',
    icon: 'i-carbon:analytics',
    route: '/analytics',
  },
  {
    id: 'finance',
    name: '财务管理',
    icon: 'i-carbon:wallet',
    route: '/finance',
    count: 15,
  },
  {
    id: 'settings',
    name: '系统设置',
    icon: 'i-carbon:settings',
    route: '/settings',
  },
])

// 菜单状态
const menuCollapsed = ref(false)
const activeMenuItem = ref('dashboard')
const selectedItem = ref<MenuItem | null>(null)

// 事件日志
const eventLog = ref<string[]>([])

function addLog(message: string) {
  eventLog.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`)
  if (eventLog.value.length > 10) {
    eventLog.value.pop()
  }
}

// 菜单事件处理
function onMenuSelect(item: MenuItem) {
  selectedItem.value = item
  activeMenuItem.value = item.id
  addLog(`选择菜单项: ${item.name} (${item.id})`)
}

function onMenuToggle() {
  menuCollapsed.value = !menuCollapsed.value
  addLog(`菜单${menuCollapsed.value ? '收起' : '展开'}`)
}

// 动态修改菜单
function addMenuItem() {
  const newId = `item-${Date.now()}`
  menuItems.value.push({
    id: newId,
    name: `新菜单 ${menuItems.value.length + 1}`,
    icon: 'i-carbon:add',
    count: Math.floor(Math.random() * 100),
  })
  addLog('添加了新菜单项')
}

function removeLastItem() {
  if (menuItems.value.length > 1) {
    const removed = menuItems.value.pop()
    addLog(`删除菜单项: ${removed?.name}`)
  }
}

function updateCount() {
  const randomItem = menuItems.value[Math.floor(Math.random() * menuItems.value.length)]
  randomItem.count = Math.floor(Math.random() * 1000)
  addLog(`更新计数: ${randomItem.name} -> ${randomItem.count}`)
}

// 计算样式
const contentStyle = computed(() => {
  const sideMenuWidth = menuCollapsed.value ? 64 : 280
  return {
    marginLeft: `${sideMenuWidth}px`,
    transition: 'margin-left 0.3s ease-in-out',
  }
})
</script>

<template>
  <div class="bg-gray-50 flex h-screen dark:bg-gray-900">
    <!-- 侧边菜单 -->
    <SideMenu
      v-model:collapsed="menuCollapsed"
      :items="menuItems"
      :active-id="activeMenuItem"
      class="hidden md:block"
      @select="onMenuSelect"
    />

    <!-- 主内容区域 -->
    <div class="flex flex-1 flex-col min-w-0" :style="contentStyle">
      <!-- 顶部工具栏 -->
      <div class="px-24 border-b bg-white flex h-64 items-center justify-between dark:border-gray-700 dark:bg-gray-800">
        <div>
          <h1 class="text-size-20 text-gray-900 font-bold dark:text-white">
            侧边菜单演示
          </h1>
          <p class="text-size-14 text-gray-600 dark:text-gray-400">
            展示菜单组件的各种功能
          </p>
        </div>

        <div class="flex gap-12 items-center">
          <button
            class="text-white px-16 py-8 rounded-lg bg-[linear-gradient(90deg,#24ee89,#9fe871)] transition-colors hover:bg-orange-600"
            @click="onMenuToggle"
          >
            {{ menuCollapsed ? '展开菜单' : '收起菜单' }}
          </button>

          <button class="text-gray-600 p-8 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <div class="i-carbon:settings text-size-20" />
          </button>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-24 flex-1 overflow-y-auto">
        <div class="gap-24 grid grid-cols-1 lg:grid-cols-2">
          <!-- 当前状态 -->
          <div class="p-24 rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <h2 class="text-size-18 text-gray-900 font-semibold mb-16 dark:text-white">
              当前状态
            </h2>

            <div class="space-y-12">
              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">菜单状态:</span>
                <span class="text-gray-900 font-medium dark:text-white">
                  {{ menuCollapsed ? '已收起' : '已展开' }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">当前选中:</span>
                <span class="text-gray-900 font-medium dark:text-white">
                  {{ selectedItem?.name || '无' }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">菜单项数量:</span>
                <span class="text-gray-900 font-medium dark:text-white">
                  {{ menuItems.length }}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600 dark:text-gray-400">宽度:</span>
                <span class="text-gray-900 font-medium dark:text-white">
                  {{ menuCollapsed ? '64px' : '280px' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 操作控制 -->
          <div class="p-24 rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <h2 class="text-size-18 text-gray-900 font-semibold mb-16 dark:text-white">
              操作控制
            </h2>

            <div class="space-y-12">
              <button
                class="text-white px-16 py-12 rounded-lg bg-green-500 w-full transition-colors hover:bg-green-600"
                @click="addMenuItem"
              >
                <div class="flex gap-8 items-center justify-center">
                  <div class="i-carbon:add" />
                  添加菜单项
                </div>
              </button>

              <button
                class="text-white px-16 py-12 rounded-lg bg-red-500 w-full transition-colors hover:bg-red-600"
                :disabled="menuItems.length <= 1"
                @click="removeLastItem"
              >
                <div class="flex gap-8 items-center justify-center">
                  <div class="i-carbon:subtract" />
                  删除最后一项
                </div>
              </button>

              <button
                class="text-white px-16 py-12 rounded-lg bg-blue-500 w-full transition-colors hover:bg-blue-600"
                @click="updateCount"
              >
                <div class="flex gap-8 items-center justify-center">
                  <div class="i-carbon:restart" />
                  随机更新计数
                </div>
              </button>
            </div>
          </div>

          <!-- 选中项详情 -->
          <div class="p-24 rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <h2 class="text-size-18 text-gray-900 font-semibold mb-16 dark:text-white">
              选中项详情
            </h2>

            <div v-if="selectedItem" class="space-y-12">
              <div class="flex gap-12 items-center">
                <div :class="selectedItem.icon" class="text-size-24 text-orange-500" />
                <div>
                  <div class="text-gray-900 font-medium dark:text-white">
                    {{ selectedItem.name }}
                  </div>
                  <div class="text-size-12 text-gray-500 dark:text-gray-400">
                    ID: {{ selectedItem.id }}
                  </div>
                </div>
              </div>

              <div v-if="selectedItem.route" class="text-size-14">
                <span class="text-gray-600 dark:text-gray-400">路由:</span>
                <code class="text-gray-900 ml-8 px-8 py-4 rounded bg-gray-100 dark:text-white dark:bg-gray-700">
                  {{ selectedItem.route }}
                </code>
              </div>

              <div v-if="selectedItem.count !== undefined" class="text-size-14">
                <span class="text-gray-600 dark:text-gray-400">计数:</span>
                <span class="text-orange-600 ml-8 px-8 py-4 rounded bg-orange-100 dark:text-orange-300 dark:bg-orange-900">
                  {{ selectedItem.count }}
                </span>
              </div>
            </div>

            <div v-else class="text-gray-500 py-20 text-center dark:text-gray-400">
              <div class="i-carbon:select-01 text-size-32 mb-8" />
              <p>请选择一个菜单项</p>
            </div>
          </div>

          <!-- 事件日志 -->
          <div class="p-24 rounded-lg bg-white shadow-sm dark:bg-gray-800">
            <h2 class="text-size-18 text-gray-900 font-semibold mb-16 dark:text-white">
              事件日志
            </h2>

            <div class="max-h-200 overflow-y-auto space-y-8">
              <div
                v-for="(log, index) in eventLog"
                :key="index"
                class="text-size-12 text-gray-700 p-12 rounded bg-gray-50 dark:text-gray-300 dark:bg-gray-700"
              >
                {{ log }}
              </div>

              <div v-if="eventLog.length === 0" class="text-gray-500 py-20 text-center dark:text-gray-400">
                <div class="i-carbon:document text-size-24 mb-8" />
                <p>暂无事件日志</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端提示 -->
    <div class="text-white p-24 text-center bg-gray-900 flex items-center inset-0 justify-center fixed md:hidden">
      <div>
        <div class="i-carbon:tablet text-size-48 mb-16" />
        <h2 class="text-size-20 font-bold mb-8">
          请使用桌面端查看
        </h2>
        <p class="text-gray-400">
          侧边菜单演示需要在桌面端浏览器中查看
        </p>
      </div>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'menu-demo',
  meta: {
    title: '菜单演示',
    i18n: 'menus.menuDemo'
  },
}
</route>

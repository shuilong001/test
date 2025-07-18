<script setup lang="ts">
import { showToast } from 'vant'
import { useAppStore } from '@/stores/modules/app'
import { TabBarList } from '@/constants'

// 类型定义
interface MenuItem {
  id: string
  name: string
  icon: string
  children?: MenuItem[]
}

const appStore = useAppStore()
const router = useRouter()
// 响应式数据
const activeMenu = computed(() => appStore.activeMenu)
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const expandedMenus = ref(['casino'])
const mobileMenuOpen = computed(() => appStore.mobileMenuOpen)
const activeMobileDropdown = ref('')

// 视口监听
const windowWidth = ref(0)

// 菜单数据
const menuItems = reactive<MenuItem[]>([
  {
    id: 'casino',
    name: '赌场',
    icon: '🎰',
    children: [
      { id: 'crash', name: '爆点', icon: '🚀' },
      { id: 'limbo', name: '极限倍数', icon: '🎯' },
      { id: 'twist', name: '扭转命运', icon: '🌪️' },
      { id: 'ups-downs', name: '跌宕游戏', icon: '📈' },
      { id: 'double-chance', name: '极速双选', icon: '⚡' },
      { id: 'plinko', name: '弹珠机', icon: '🎱' },
      { id: 'tower', name: '传奇之塔', icon: '🗼' },
      { id: 'fast-crash', name: '极速爆点', icon: '💥' },
      { id: 'wheel', name: '幸运转轮', icon: '🎡' },
      { id: 'coin-flip', name: '硬币对决', icon: '🪙' },
      { id: 'hilo', name: '希罗', icon: '🎲' },
      { id: 'classic', name: '经典规模', icon: '🎰' },
      { id: 'chat', name: '查话', icon: '💬' },
      { id: 'lucky-wheel', name: '幸运转轮', icon: '🍀' },
      { id: 'hash-dice', name: '哈希骰子', icon: '🎲' },
    ],
  },
  {
    id: 'bc-originals',
    name: 'BC 原创',
    icon: '⭐',
  },
  {
    id: 'bc-exclusive',
    name: 'BC 独家',
    icon: '💎',
  },
  {
    id: 'featured',
    name: '首选',
    icon: '🏆',
  },
  {
    id: 'slots',
    name: '老虎机',
    icon: '🎰',
  },
  {
    id: 'auction',
    name: '拍卖哥',
    icon: '🔨',
  },
  {
    id: 'live-casino',
    name: '真人娱乐场',
    icon: '🎭',
  },
  {
    id: 'hot-games',
    name: '热门游戏',
    icon: '🔥',
  },
])

// 视口监听函数
function updateWindowWidth() {
  windowWidth.value = window.innerWidth

  // 当视口大于768且小于1080时，自动折叠侧边栏
  if (windowWidth.value > 768 && windowWidth.value < 1080) {
    appStore.sidebarCollapsed = true
  }
  else if (windowWidth.value >= 1080) {
    appStore.sidebarCollapsed = false
  }
  // 小于768px时保持移动端布局，不影响侧边栏状态
}

// 生命周期钩子
onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

function handlePCMenuClick(item: MenuItem) {
  if (item.children) {
    const index = expandedMenus.value.indexOf(item.id)
    if (index > -1) {
      expandedMenus.value.splice(index, 1)
    }
    else {
      expandedMenus.value.push(item.id)
    }
  }
  else {
    appStore.activeMenu = item.id
    showToast(`已切换到: ${item.name}`)
  }
}

function handleMobileMenuClick(item: MenuItem) {
  if (item.children) {
    activeMobileDropdown.value = activeMobileDropdown.value === item.id ? '' : item.id
  }
  else {
    appStore.activeMenu = item.id
    activeMobileDropdown.value = ''
    appStore.mobileMenuOpen = false
    showToast(`已切换到: ${item.name}`)
  }
}

function handleSubmenuClick(child: MenuItem) {
  appStore.activeMenu = child.id
  activeMobileDropdown.value = ''
  appStore.mobileMenuOpen = false
  showToast(`选择子菜单: ${child.name}`)
}

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  return sidebarCollapsed.value ? 'w-80' : 'w-200'
})

function handleRedirect(item: any) {
  router.replace({
    path: item.to,
  })
}
</script>

<template>
  <div>
    <!-- 移动端下拉菜单 -->
    <div v-if="mobileMenuOpen" class="border-b border-gray-200 bg-white transform transition-colors transition-transform duration-300 duration-300 left-0 right-0 top-60 fixed z-40 dark:border-gray-700 dark:bg-gray-800 md:hidden">
      <div class="max-h-[calc(100vh-5rem)] overflow-y-auto">
        <div v-for="item in menuItems" :key="item.id" class="border-b border-gray-100 dark:border-gray-700/50">
          <div
            class="px-6 py-4 flex cursor-pointer transition-colors items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'bg-gray-100 text-green-600 dark:bg-gray-700 dark:text-green-400': activeMenu === item.id }"
            @click="handleMobileMenuClick(item)"
          >
            <div class="flex gap-4 items-center">
              <span class="text-size-20" v-html="item.icon" />
              <span class="text-size-16 text-gray-900 font-medium dark:text-white">{{ item.name }}</span>
            </div>
            <div v-if="item.children" class="text-gray-400 transition-transform dark:text-gray-500" :class="{ 'rotate-90': activeMobileDropdown === item.id }">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- 移动端子菜单下拉 -->
          <div v-if="item.children && activeMobileDropdown === item.id" class="animate-slideDown bg-gray-50 dark:bg-gray-900/80">
            <div
              v-for="child in item.children"
              :key="child.id"
              class="px-10 py-3 flex gap-4 cursor-pointer transition-colors items-center hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-100 text-green-600 dark:bg-gray-700 dark:text-green-400': activeMenu === child.id }"
              @click="handleSubmenuClick(child)"
            >
              <span class="text-size-18" v-html="child.icon" />
              <span class="text-size-14 text-gray-800 dark:text-gray-200">{{ child.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PC端左侧菜单栏 -->
    <aside class="border-r border-gray-200 bg-white h-[calc(100vh-60px)] hidden hidden transition-all transition-colors duration-300 duration-300 left-0 top-60 fixed z-40 overflow-y-auto dark:border-gray-700 dark:bg-gray-800 md:block md:block" :class="sidebarWidth">
      <!-- 显示TabBarList -->
      <div v-if="TabBarList.length > 0" class="border-b border-gray-200 flex flex-col gap-4 dark:border-gray-700/30">
        <div v-for="item in TabBarList" :key="item.name" class="px-16 py-8 rounded-lg flex flex-center gap-16 cursor-pointer transition-all items-center hover:bg-gray-50 dark:hover:bg-gray-700" @click="handleRedirect(item)">
          <div :class="item.icon" class="text-size-20" />
          <span v-if="!sidebarCollapsed" class="text-size-16 text-gray-700 font-medium flex-1 transition-all transition-colors duration-300 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{{ item.name }}</span>
        </div>
      </div>
      <!-- PC菜单项 -->
      <nav class="py-3">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="mb-1 border-gray-200 dark:border-gray-700/30"
          :class="{
            'bg-gray-100 border-r-3 border-r-green-500 dark:bg-gray-700': activeMenu === item.id,
          }"
        >
          <div
            class="group px-16 py-8 rounded-lg flex gap-16 cursor-pointer transition-all items-center hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'justify-center': sidebarCollapsed }"
            @click="handlePCMenuClick(item)"
          >
            <div class="text-size-20 flex-shrink-0" v-html="item.icon" />
            <span v-if="!sidebarCollapsed" class="text-size-16 text-gray-700 font-medium flex-1 transition-all transition-colors duration-300 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{{ item.name }}</span>
            <div v-if="item.children && !sidebarCollapsed" class="text-gray-400 transition-transform dark:text-gray-500" :class="{ 'rotate-180': expandedMenus.includes(item.id) }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" />
              </svg>
            </div>
          </div>

          <!-- PC端子菜单 -->
          <div v-if="item.children && expandedMenus.includes(item.id) && !sidebarCollapsed" class="px-16 py-8 rounded-lg bg-gray-50 dark:bg-gray-900/50">
            <div
              v-for="child in item.children"
              :key="child.id"
              class="group px-8 py-3 rounded-lg flex gap-16 cursor-pointer transition-all items-center hover:bg-gray-100 hover:translate-x-2 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-100 text-green-600 dark:bg-gray-700 dark:text-green-400': activeMenu === child.id }"
              @click.stop="handleSubmenuClick(child)"
            >
              <div class="text-size-16 flex-center h-5 w-5" v-html="child.icon" />
              <span class="text-size-15 text-gray-600 font-medium transition-colors dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{{ child.name }}</span>
            </div>
          </div>
        </div>
      </nav>

      <!-- 收起状态时的工具提示 -->
      <div v-if="sidebarCollapsed" class="text-size-12 text-white ml-2 px-3 py-2 rounded-lg bg-gray-700 opacity-0 pointer-events-none transition-opacity left-full top-24 absolute dark:bg-gray-600 group-hover:opacity-100">
        点击展开菜单
      </div>
    </aside>
  </div>
</template>

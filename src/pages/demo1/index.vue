<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import type { PickerColumn } from 'vant'
import { showToast } from 'vant'
import { languageColumns, locale } from '@/utils/i18n'
import { isDark, toggleDark } from '@/composables/dark'

// 类型定义
interface MenuItem {
  id: string
  name: string
  icon: string
  children?: MenuItem[]
}

interface Game {
  id: number
  name: string
  players: number
  gradient: string
  category: string // 添加游戏分类
  provider: string // 添加游戏提供商
}

interface GameCategory {
  id: string
  name: string
  icon: string
}

// 响应式数据
const sidebarCollapsed = ref(false)
const activeMenu = ref('casino')
const expandedMenus = ref(['casino'])
const mobileMenuOpen = ref(false)
const activeMobileDropdown = ref('')

// 视口监听
const windowWidth = ref(0)

// 搜索相关
const showSearch = ref(false)
const searchValue = ref('')

// 游戏分类相关
const activeGameCategory = ref('slots')

// 语言选择器
const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])

// 主题切换
const checked = computed({
  get: () => isDark.value,
  set: () => toggleDark(),
})

// 游戏分类数据
const gameCategories = reactive<GameCategory[]>([
  { id: 'slots', name: '老虎机', icon: '🎰' },
  { id: 'live-casino', name: '真人娱乐场', icon: '🎭' },
  { id: 'fishing', name: '捕鱼游戏', icon: '🎯' },
  { id: 'card-games', name: '棋牌游戏', icon: '♟️' },
  { id: 'game-shows', name: '游戏秀', icon: '🎮' },
  { id: 'new-releases', name: '最新发布', icon: '📢' },
  { id: 'buy-bonus', name: '购买回合奖励', icon: '🛒' },
])

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

// 完整的游戏数据（包含分类信息）
const allGames = reactive<Game[]>([
  { id: 1, name: 'PLINKO', players: 263, gradient: 'linear-gradient(135deg, #4ade80, #22d3ee)', category: 'casino', provider: 'BC.GAME' },
  { id: 2, name: 'FAST PARTY', players: 28, gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', category: 'casino', provider: 'BC.GAME' },
  { id: 3, name: 'LIMBO', players: 348, gradient: 'linear-gradient(135deg, #10b981, #059669)', category: 'casino', provider: 'BC.GAME' },
  { id: 4, name: 'TWIST', players: 308, gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)', category: 'casino', provider: 'BC.GAME' },
  { id: 5, name: 'MINE', players: 314, gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', category: 'casino', provider: 'BC.GAME' },
  { id: 6, name: 'CLASSIC DICE', players: 192, gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', category: 'casino', provider: 'BC.GAME' },
  { id: 7, name: 'KENO', players: 244, gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', category: 'casino', provider: 'BC.GAME' },
  { id: 8, name: 'WUKONG', players: 80, gradient: 'linear-gradient(135deg, #374151, #1f2937)', category: 'slots', provider: 'PG Soft' },
  { id: 9, name: 'HASHDICE', players: 88, gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', category: 'casino', provider: 'BC.GAME' },
  { id: 10, name: 'COINFLIP', players: 156, gradient: 'linear-gradient(135deg, #f59e0b, #ea580c)', category: 'casino', provider: 'BC.GAME' },
  { id: 11, name: 'FORTUNE TIGER', players: 523, gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', category: 'slots', provider: 'PG Soft' },
  { id: 12, name: 'GATES OF OLYMPUS', players: 412, gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)', category: 'slots', provider: 'Pragmatic Play' },
  { id: 13, name: 'CRAZY TIME', players: 287, gradient: 'linear-gradient(135deg, #dc2626, #991b1b)', category: 'live-casino', provider: 'Evolution' },
  { id: 14, name: 'LIGHTNING ROULETTE', players: 198, gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)', category: 'live-casino', provider: 'Evolution' },
  { id: 15, name: 'FISHING GOD', players: 345, gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', category: 'fishing', provider: 'JDB' },
  { id: 16, name: 'OCEAN KING', players: 267, gradient: 'linear-gradient(135deg, #0ea5e9, #0284c7)', category: 'fishing', provider: 'Kagaming' },
  { id: 17, name: 'TEXAS HOLDEM', players: 156, gradient: 'linear-gradient(135deg, #65a30d, #4d7c0f)', category: 'card-games', provider: 'PokerStars' },
  { id: 18, name: 'BLACKJACK', players: 234, gradient: 'linear-gradient(135deg, #1f2937, #111827)', category: 'card-games', provider: 'NetEnt' },
  { id: 19, name: 'MEGA BALL', players: 189, gradient: 'linear-gradient(135deg, #f97316, #ea580c)', category: 'game-shows', provider: 'Evolution' },
  { id: 20, name: 'MONOPOLY LIVE', players: 312, gradient: 'linear-gradient(135deg, #16a34a, #15803d)', category: 'game-shows', provider: 'Evolution' },
])

// 计算过滤后的游戏列表
const filteredGames = computed(() => {
  // 根据左侧菜单过滤
  let filtered = allGames

  // 如果选择了具体的子菜单项，进行相应过滤
  if (activeMenu.value !== 'casino') {
    // 根据菜单ID过滤游戏
    filtered = filtered.filter((game) => {
      switch (activeMenu.value) {
        case 'slots':
          return game.category === 'slots'
        case 'live-casino':
          return game.category === 'live-casino'
        case 'bc-originals':
          return game.provider === 'BC.GAME'
        case 'featured':
          return game.players > 300 // 热门游戏以玩家数量为标准
        case 'hot-games':
          return game.players > 200
        default:
          return game.category === activeMenu.value || game.provider === 'BC.GAME'
      }
    })
  }

  // 根据顶部游戏分类标签过滤
  if (activeGameCategory.value !== 'slots') {
    filtered = filtered.filter((game) => {
      switch (activeGameCategory.value) {
        case 'live-casino':
          return game.category === 'live-casino'
        case 'fishing':
          return game.category === 'fishing'
        case 'card-games':
          return game.category === 'card-games'
        case 'game-shows':
          return game.category === 'game-shows'
        case 'new-releases':
          return game.id > 15 // 模拟新发布的游戏
        case 'buy-bonus':
          return game.provider !== 'BC.GAME' // 第三方游戏通常有购买奖励功能
        default:
          return game.category === 'slots'
      }
    })
  }

  return filtered
})

// 视口监听函数
function updateWindowWidth() {
  windowWidth.value = window.innerWidth

  // 当视口大于768且小于1080时，自动折叠侧边栏
  if (windowWidth.value > 768 && windowWidth.value < 1080) {
    sidebarCollapsed.value = true
  }
  else if (windowWidth.value >= 1080) {
    sidebarCollapsed.value = false
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

// 方法
function toggleSidebar() {
  // 手动切换时允许用户自定义状态
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

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
    activeMenu.value = item.id
    // 根据选择的菜单自动切换游戏分类
    if (item.id === 'slots') {
      activeGameCategory.value = 'slots'
    }
    else if (item.id === 'live-casino') {
      activeGameCategory.value = 'live-casino'
    }
    showToast(`已切换到: ${item.name}`)
  }
}

function handleMobileMenuClick(item: MenuItem) {
  if (item.children) {
    activeMobileDropdown.value = activeMobileDropdown.value === item.id ? '' : item.id
  }
  else {
    activeMenu.value = item.id
    activeMobileDropdown.value = ''
    mobileMenuOpen.value = false
    // 根据选择的菜单自动切换游戏分类
    if (item.id === 'slots') {
      activeGameCategory.value = 'slots'
    }
    else if (item.id === 'live-casino') {
      activeGameCategory.value = 'live-casino'
    }
    showToast(`已切换到: ${item.name}`)
  }
}

function handleSubmenuClick(child: MenuItem) {
  activeMenu.value = child.id
  activeMobileDropdown.value = ''
  mobileMenuOpen.value = false
  showToast(`选择子菜单: ${child.name}`)
}

// 游戏分类切换
function handleGameCategoryChange(category: string) {
  activeGameCategory.value = category
  const categoryName = gameCategories.find(c => c.id === category)?.name || category
  showToast(`已切换到: ${categoryName}`)
}

// 搜索功能
function onSearch() {
  showSearch.value = false
  showToast(`搜索: ${searchValue.value}`)
}

function onCancel() {
  showSearch.value = false
  searchValue.value = ''
}

// 语言选择
function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
  showToast(`语言已切换为: ${event.selectedOptions[0].text}`)
}

function onPcLanguageConfirm(value: string) {
  locale.value = value as string
  showLanguagePicker.value = false
  const language = languageColumns.find(l => l.value === value)
  showToast(`语言已切换为: ${language?.text}`)
}

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  return sidebarCollapsed.value ? 'w-80' : 'w-256'
})

const contentMargin = computed(() => {
  if (sidebarCollapsed.value) {
    return 'ml-80'
  }
  return 'ml-256'
})
</script>

<template>
  <div class="text-gray-900 bg-gray-50 min-h-screen transition-colors duration-300 dark:text-white dark:bg-gray-900">
    <!-- 顶部导航栏 -->
    <header class="px-16 border-b border-gray-200 bg-white flex h-60 transition-colors duration-300 items-center left-0 right-0 top-0 justify-between fixed z-50 dark:border-gray-700 dark:bg-gray-800">
      <div class="flex gap-6 items-center">
        <!-- PC端汉堡菜单按钮 -->
        <div class="flex flex-col gap-4 w-16 hidden cursor-pointer justify-center md:flex" @click="toggleSidebar">
          <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" />
          <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" />
          <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" />
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="flex flex-col gap-4 w-16 cursor-pointer justify-center md:hidden" @click="toggleMobileMenu">
          <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" :class="{ 'rotate-45 translate-y-2': mobileMenuOpen }" />
          <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" :class="{ 'opacity-0': mobileMenuOpen }" />
          <div class="rounded bg-gray-600 h-2 w-full transition-all dark:bg-gray-300" :class="{ '-rotate-45 -translate-y-2': mobileMenuOpen }" />
        </div>

        <div class="flex gap-3 items-center">
          <span class="text-size-24 text-gray-900 tracking-wider font-bold md:text-size-20 dark:text-white">BC.GAME</span>
        </div>
      </div>

      <div class="flex gap-8 items-center">
        <!-- 搜索 -->
        <div class="text-gray-500 rounded-lg flex-center h-24 w-24 hidden cursor-pointer transition-colors dark:text-gray-400 md:flex dark:hover:text-white dark:hover:bg-gray-700" @click="showSearch = true">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" class="h-24 w-24">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" />
          </svg>
        </div>

        <!-- 登录按钮 -->
        <button class="text-size-16 text-#fff font-bold rounded-8 bg-gray-900 flex-center h-30 w-64 cursor-pointer transition-all md:w-96 hover:shadow-green-500/25 hover:shadow-lg">
          登录
        </button>

        <!-- 注册按钮 -->
        <button class="text-size-16 text-#000 font-bold rounded-8 bg-[linear-gradient(90deg,#24ee89,#9fe871)] flex-center h-30 w-64 cursor-pointer transition-all md:w-96 hover:shadow-green-500/25 hover:shadow-lg">
          注册
        </button>

        <!-- 多语言 -->
        <!-- <div
          class="text-size-12 text-gray-600 font-medium px-4 py-2 border border-gray-300 rounded-lg cursor-pointer transition-all md:text-size-14 dark:text-gray-300 hover:text-gray-800 md:px-3 md:py-1.5 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:text-white dark:hover:border-gray-500 dark:hover:bg-gray-700"
          @click="showLanguagePicker = true"
        >
          {{ currentLanguage }}
        </div> -->

        <!-- 深浅模式切换 -->
        <div class="flex items-center">
          <van-switch
            v-model="checked"
            size="22px"
            active-color="#22c55e"
            inactive-color="#d1d5db"
            class="md:scale-90"
          />
        </div>
      </div>
    </header>

    <!-- 搜索弹窗 -->
    <van-popup v-model:show="showSearch" class="h-screen" position="top">
      <div class="bg-white h-full dark:bg-gray-900">
        <van-search
          v-model="searchValue"
          placeholder="搜索游戏..."
          show-action
          @search="onSearch"
          @cancel="onCancel"
        />
        <div class="flex h-400 items-center justify-center">
          <div class="text-center">
            <div class="text-size-48 mb-4">
              🎮
            </div>
            <div class="text-gray-500 dark:text-gray-400">
              暂无搜索结果
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 语言选择器 -->
    <van-popup v-model:show="showLanguagePicker" position="bottom" class="md:hidden">
      <van-picker
        v-model="languageValues"
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>

    <!-- PC语言选择器 -->
    <van-popup v-model:show="showLanguagePicker" position="center" class="hidden md:block">
      <div class="py-20 rounded-xl bg-white flex flex-col w-300 shadow-2xl items-center justify-center dark:bg-gray-800">
        <h3 class="text-size-18 text-gray-900 font-bold mb-16 dark:text-white">
          选择语言
        </h3>
        <van-radio-group v-model="languageValues" class="flex flex-col gap-12" @change="onPcLanguageConfirm">
          <van-radio
            v-for="item in languageColumns"
            :key="item.value"
            :name="item.value"
            class="text-gray-900 dark:text-white"
          >
            {{ item.text }}
          </van-radio>
        </van-radio-group>
      </div>
    </van-popup>

    <!-- 移动端下拉菜单 -->
    <div class="border-b border-gray-200 bg-white transform transition-colors transition-transform duration-300 duration-300 left-0 right-0 top-60 fixed z-40 dark:border-gray-700 dark:bg-gray-800 md:hidden" :class="{ '-translate-y-full': !mobileMenuOpen }">
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
    <aside class="border-r border-gray-200 bg-white h-[calc(100vh-60px)] hidden transition-all transition-colors duration-300 duration-300 left-0 top-60 fixed z-40 overflow-y-auto dark:border-gray-700 dark:bg-gray-800 md:block" :class="sidebarWidth">
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
            class="group mx-2 px-6 py-8 rounded-lg flex gap-16 cursor-pointer transition-all items-center hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'justify-center': sidebarCollapsed }"
            @click="handlePCMenuClick(item)"
          >
            <div class="text-size-20 flex-shrink-0" v-html="item.icon" />
            <span v-if="!sidebarCollapsed" class="text-size-16 text-gray-700 font-medium flex-1 transition-colors dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{{ item.name }}</span>
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

    <!-- 主内容区域 -->
    <main class="p-8 pt-76 bg-gray-50 transition-all duration-300 relative dark:bg-gray-900" :class="[contentMargin, `md:${contentMargin}`]">
      <!-- 游戏分类标签使用 van-tabbar -->
      <div class="py-8 bg-gray-50 top-60 sticky z-10 dark:bg-gray-900">
        <van-tabs
          v-model:active="activeGameCategory"
          type="card"
          class="game-category-tabs"
          @change="handleGameCategoryChange"
        >
          <van-tab
            v-for="category in gameCategories"
            :key="category.id"
            :name="category.id"
            :title="`${category.icon} ${category.name}`"
          />
        </van-tabs>

        <!-- 游戏统计信息 -->
        <div class="py-8 flex gap-4 items-center justify-between">
          <div class="text-size-18 text-gray-700 font-medium dark:text-gray-300">
            找到 {{ filteredGames.length }} 款游戏
          </div>
          <div class="text-size-14 text-gray-500 dark:text-gray-400">
            当前分类: {{ gameCategories.find(c => c.id === activeGameCategory)?.name }}
          </div>
        </div>
      </div>

      <!-- 游戏网格 -->
      <div class="gap-6 grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 xl:grid-cols-5">
        <div
          v-for="(game, index) in filteredGames"
          :key="game.id"
          class="p-6 border border-gray-200 rounded-2xl aspect-square cursor-pointer transition-all relative overflow-hidden dark:border-white/10 hover:border-gray-300 hover:shadow-2xl hover:shadow-xl hover:scale-105 dark:hover:border-white/20"
          :style="{
            background: game.gradient,
            animationDelay: `${index * 0.1}s`,
          }"
        >
          <div class="bg-gradient-to-t inset-0 absolute from-black/60 to-transparent via-transparent" />
          <div class="flex flex-col h-full justify-end relative z-10">
            <h3 class="text-size-20 text-white font-bold mb-3 drop-shadow-lg">
              {{ game.name }}
            </h3>
            <div class="text-size-14 text-white/90 mb-2 drop-shadow">
              🏢 {{ game.provider }}
            </div>
            <div class="text-size-14 text-white/80 drop-shadow">
              👥 {{ game.players }}
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredGames.length === 0" class="flex h-400 items-center justify-center">
        <div class="text-center">
          <div class="text-size-64 mb-6">
            😔
          </div>
          <div class="text-size-20 text-gray-600 font-medium mb-2 dark:text-gray-400">
            暂无游戏
          </div>
          <div class="text-size-16 text-gray-500 dark:text-gray-500">
            请尝试切换其他分类或筛选条件
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 游戏分类标签样式 */
:deep(.game-category-tabs .van-tabs__nav) {
  background: transparent;
  border: none;
}

:deep(.game-category-tabs .van-tab) {
  @apply px-6 py-3 text-size-16 text-gray-700 border border-gray-300 rounded-xl bg-white transition-all whitespace-nowrap dark:text-gray-200 dark:border-gray-600 dark:bg-gray-800;
}

:deep(.game-category-tabs .van-tab--active) {
  @apply bg-gradient-to-r  font-bold shadow-lg from-green-500 to-green-600 border-green-500;
}

:deep(.game-category-tabs .van-tabs__line) {
  display: none;
}

:deep(.game-category-tabs .van-tabs__content) {
  display: none;
}
:deep(.van-tabs__nav--card) {
  @apply flex gap-16;
}

/* 滚动条样式 */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
}

aside::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 2px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.5);
}

/* 移动端下拉菜单滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(55, 65, 81, 0.3);
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.3);
  border-radius: 2px;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    max-height: 500px;
    transform: translateY(0);
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}

.grid > div {
  animation: fadeInUp 0.6s ease-out both;
}

/* 汉堡包菜单动画 */
.hamburger-line {
  transform-origin: center;
}

/* 收起状态悬停效果 */
aside.w-16 .group:hover .opacity-0 {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 767px) {
  main {
    margin-left: 0 !important;
  }
}
</style>

<route lang="json5">
  {
    name: 'demo1',
    meta: {
      title: 'demo1',
      i18n: 'menus.demo1'
    },
  }
  </route>

<script setup lang="ts">
import { showToast } from 'vant'

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
const activeMenu = ref('card-games')

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

  return filtered
})

// 游戏分类切换
function handleGameCategoryChange(category: string) {
  const categoryName = gameCategories.find(c => c.id === category)?.name || category
  showToast(`已切换到: ${categoryName}`)
}
</script>

<template>
  <PageContainer :has-header="false">
    <main class="p-16 transition-all duration-300 relative md:p-24">
      <!-- 游戏分类标签使用 van-tabbar -->
      <div class="py-8 z-10">
        <van-tabs
          v-model:active="activeMenu"
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
            当前分类: {{ gameCategories.find(c => c.id === activeMenu)?.name }}
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
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'demo1',
  meta: {
    title: '首页',
    i18n: 'menus.demo1'
  },
}
</route>

<style scoped>
/* 游戏分类标签样式 */
:deep(.game-category-tabs .van-tabs__nav) {
  background: transparent;
  border: none;
  margin: 0;
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

/* 隐藏滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  display: none !important;
}

aside::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  display: none !important;
}

/* 针对移动端菜单的滚动条 */
.max-h-\[calc\(100vh-5rem\)\]::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
  background: transparent !important;
  display: none !important;
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

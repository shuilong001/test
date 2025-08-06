<script setup lang="ts">
import { showToast } from 'vant'
import { useAppStore } from '@/stores/modules/app'

const MaxScreenWidth = 1440
// 类型定义
interface MenuItem {
  id: string
  name: string
  icon: string
  children?: MenuItem[]
}

const appStore = useAppStore()
// const router = useRouter()
// 响应式数据
const activeMenu = computed(() => appStore.activeMenu)
const sidebarCollapsed = computed(() => appStore.sidebarCollapsed)
const expandedMenus = ref(['casino'])
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

const checked = computed({
  get: () => isDark.value,
  set: () => toggleDark(),
})

// 视口监听函数
function updateWindowWidth() {
  windowWidth.value = window.innerWidth

  // 当视口大于768且小于1080时，自动折叠侧边栏
  if (windowWidth.value > 768 && windowWidth.value < MaxScreenWidth) {
    appStore.sidebarCollapsed = true
  }
  else if (windowWidth.value >= MaxScreenWidth) {
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
  appStore.activeMenu = item.id
  showToast(`已切换到: ${item.name}`)
}

function handleSubmenuClick(child: MenuItem) {
  appStore.activeMenu = child.id
  activeMobileDropdown.value = ''
  showToast(`选择子菜单: ${child.name}`)
}

function handleExpand(item: MenuItem) {
  if (item.children) {
    const index = expandedMenus.value.indexOf(item.id)
    if (index > -1) {
      expandedMenus.value.splice(index, 1)
    }
    else {
      expandedMenus.value.push(item.id)
    }
  }
}

// 计算侧边栏宽度
const sidebarWidth = computed(() => {
  return sidebarCollapsed.value ? `w-[var(--sidebar-width-collapsed)]` : `w-[var(--sidebar-width)]`
})

function handleRedirect(item: any) {
  // router.replace({
  //   path: item.to,
  // })
  appStore.activeMenu = item.id
}
// 顶部菜单
const TopMenuList = [
  {
    id: 'recently-played',
    name: 'Recently played',
    icon: 'i-custom:side-recently wh-24 ',
  },
  {
    id: 'my-favorite',
    name: 'My favorite',
    icon: 'i-custom:side-favorite wh-20',
  },
  {
    id: 'club',
    name: 'Club',
    icon: 'i-custom:side-club w-16 h-25',
  },
  {
    id: 'contest',
    name: 'Contest',
    icon: 'i-custom:side-contest w-20 h-19',
  },
  {
    id: 'offers-activities',
    name: 'Offers/Activities',
    icon: 'i-custom:side-offers wh-20',
  },
]
const BottomMenuList = [
  {
    id: 'recently-played',
    name: 'Recently played',
    icon: 'i-custom:side-recently wh-24 ',
  },
  {
    id: 'my-favorite',
    name: 'My favorite',
    icon: 'i-custom:side-favorite wh-20',
  },

]

function onMouseEnter() {
  appStore.sidebarCollapsed = false
}

function onMouseLeave() {
  if (windowWidth.value > 768 && windowWidth.value < MaxScreenWidth) {
    appStore.sidebarCollapsed = true
  }
}
</script>

<template>
  <div
    :class="sidebarWidth"
    class="py-32 bg-#1C1C1C flex-col h-[calc(100vh-60px)] left-0 top-60 justify-between justify-between fixed z-40 overflow-y-auto hide-scrollbar"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <aside class="flex-1">
      <div class="px-16 pb-20 border-b border-#fff/10 flex flex-col gap-12">
        <div
          v-for="item in TopMenuList"
          :key="item.id"
          class="px-12 py-6 rounded-64 flex gap-4 cursor-pointer items-center"
          :class="[activeMenu === item.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF', sidebarCollapsed ? 'justify-center px-0' : '']"
          @click="handleRedirect(item)"
        >
          <div class="flex-center h-28 w-31">
            <div :class="item.icon" />
          </div>
          <div v-if="!sidebarCollapsed" class="text-size-14">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="px-16 py-16 border-b border-#fff/10 flex flex-col gap-10">
        <div
          v-for="item in menuItems"
          :key="item.id"
        >
          <div
            class="px-12 py-6 rounded-64 flex gap-4 cursor-pointer items-center"
            :class="[activeMenu === item.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF', sidebarCollapsed ? 'justify-center px-0' : '']"
            @click="handlePCMenuClick(item)"
          >
            <div class="text-size-20 flex-shrink-0" v-html="item.icon" />
            <span v-if="!sidebarCollapsed" class="text-size-14 flex-1">{{ item.name }}</span>
            <div v-if="item.children && !sidebarCollapsed" class="i-custom:side-arrow p-4 h-4 w-9 transition-transform" :class="{ 'rotate-180': !expandedMenus.includes(item.id) }" @click.stop="handleExpand(item)" />
          </div>

          <!-- PC端子菜单 -->
          <div v-if="item.children && expandedMenus.includes(item.id) && !sidebarCollapsed" class="py-10 flex flex-col gap-10">
            <div
              v-for="child in item.children"
              :key="child.id"
              class="px-12 py-6 rounded-64 flex gap-4 cursor-pointer items-center"
              :class="[activeMenu === child.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF']"
              @click.stop="handleSubmenuClick(child)"
            >
              <div class="text-size-20 flex-shrink-0" v-html="child.icon" />
              <span class="text-size-14 flex-1">{{ child.name }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="px-16 py-20 flex flex-col gap-12">
        <div
          v-for="item in BottomMenuList"
          :key="item.id"
          class="px-12 py-6 rounded-64 flex gap-4 cursor-pointer items-center"
          :class="[
            activeMenu === item.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF',
            sidebarCollapsed ? 'justify-center px-0' : '',
          ]"
          @click="handleRedirect(item)"
        >
          <div class="flex-center h-28 w-31">
            <div :class="item.icon" />
          </div>
          <div v-if="!sidebarCollapsed" class="text-size-14">
            {{ item.name }}
          </div>
        </div>
      </div>

      <!-- 收起状态时的工具提示 -->
      <div v-if="sidebarCollapsed" class="text-size-12 text-white ml-2 px-3 py-2 rounded-lg bg-gray-700 opacity-0 pointer-events-none transition-opacity left-full top-24 absolute dark:bg-gray-600 group-hover:opacity-100">
        点击展开菜单
      </div>
    </aside>
    <div
      class="px-16 pt-54 bg-#1C1C1C flex flex-col w-full"
      :class="sidebarCollapsed ? 'items-center' : ''"
    >
      <div v-if="!sidebarCollapsed" class="application text-size-12 mb-20 pb-11 pl-14 pr-12 pt-8 rounded-15 flex gap-10 cursor-pointer items-center justify-between">
        <div class="flex gap-10 items-center">
          <div class="i-custom:side-application h-24 w-24" />
          <div>Application</div>
        </div>
        <div class="i-custom:side-qrcode h-34 w-34" />
      </div>
      <div v-else class="flex-center h-40 w-40">
        <div class="i-custom:side-application h-24 w-24" />
      </div>
      <div v-if="!sidebarCollapsed" class="text-size-14 mb-12 py-6 pl-12 flex gap-4 cursor-pointer items-center">
        <div class="flex-center h-28 w-31">
          <div class="i-custom:side-customer h-20 w-20" />
        </div>
        <div>Online customer service</div>
      </div>
      <div v-else class="flex-center h-40 w-40">
        <div class="i-custom:side-customer h-20 w-20" />
      </div>
      <div v-if="!sidebarCollapsed" class="text-size-14 mb-20 py-6 pl-12 flex gap-4 cursor-pointer items-center justify-between">
        <div class="flex gap-4 items-center">
          <div class="flex-center h-28 w-28">
            <img src="@/assets/images/demo/side-chinese.png" alt="chinese" class="h-20 w-20">
          </div>
          <div>Simplified Chinese</div>
        </div>
        <div class="i-custom:side-arrow h-5 w-9 rotate-180" />
      </div>
      <div v-else class="flex-center h-40 w-40">
        <img src="@/assets/images/demo/side-chinese.png" alt="chinese" class="h-20 w-20">
      </div>
      <div
        v-if="!sidebarCollapsed"
        class="text-size-14 text-#959593 mt-8 p-2 rounded-20 bg-#2D2D31 flex gap-16 h-40 items-center"
        @click="checked = !checked"
      >
        <div class="rounded-full flex-center gap-8 h-36 w-1/2 cursor-pointer" :class="{ 'text-#fff secondary-shadow': !checked }">
          <div class="i-custom:side-light h-24 w-24" />
          <div>Light</div>
        </div>
        <div class="rounded-full flex-center gap-8 h-36 w-1/2 cursor-pointer" :class="{ 'text-#fff secondary-shadow': checked }">
          <div class="i-custom:side-dark h-24 w-24" />
          <div>Dark</div>
        </div>
      </div>
      <div v-else class="flex-center gap-16 h-40 w-40 cursor-pointer">
        <div v-if="!checked" class="i-custom:side-light h-24 w-24" />
        <div v-else class="i-custom:side-dark h-24 w-24" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.application {
  background: linear-gradient(
    319deg,
    rgba(255, 255, 255, 0.2) 11.46%,
    rgba(255, 255, 255, 0.2) 34.44%,
    rgba(255, 255, 255, 0) 66.52%,
    rgba(255, 255, 255, 0.2) 94.3%,
    rgba(255, 255, 255, 0.2) 94.31%
  );
}
</style>

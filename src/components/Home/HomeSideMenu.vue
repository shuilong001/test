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
    icon: 'i-custom:side-recently',
  },
  {
    id: 'my-favorite',
    name: 'My favorite',
    icon: 'i-custom:side-favorite',
  },
  {
    id: 'club',
    name: 'Club',
    icon: 'i-custom:side-club',
  },
  {
    id: 'contest',
    name: 'Contest',
    icon: 'i-custom:side-contest',
  },
  {
    id: 'offers-activities',
    name: 'Offers/Activities',
    icon: 'i-custom:side-offers',
  },
]
const CasinoList = [
  {
    id: 'casino',
    name: 'Casino',
    icon: 'i-custom:side-casino',
    children: [
      { id: 'recently-won-the-prize', name: 'Recently won the prize', icon: 'i-custom:side-prize' },
      { id: 'vip', name: 'Recently won the prize', icon: 'i-custom:side-vip' },
      { id: 'game-category', name: 'Game Category', icon: 'i-custom:side-game-category' },
      { id: 'must-play', name: 'A must-play great game', icon: 'i-custom:side-must-play' },
      { id: 'supplier', name: 'Supplier', icon: 'i-custom:side-supplier' },
      { id: 'limited-time-activities', name: 'Limited time activities', icon: 'i-custom:side-limited-time' },

    ],
  },

]
const BottomMenuList = [
  {
    id: 'acting',
    name: 'Acting',
    icon: 'i-custom:side-acting',
  },
  {
    id: 'vip-club',
    name: 'VIP Club',
    icon: 'i-custom:side-vip-club',
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
      <div
        class="px-16 pb-20 flex flex-col gap-12"
        :class="!sidebarCollapsed ? 'border-b border-#fff/10 border-solid' : ''"
      >
        <div
          v-for="item in TopMenuList"
          :key="item.id"
          class="px-12 py-6 rounded-64 flex gap-4 cursor-pointer items-center"
          :class="[
            activeMenu === item.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF',
            sidebarCollapsed ? 'justify-center !p-6' : '',
          ]"
          @click="handleRedirect(item)"
        >
          <div :class="item.icon" class="wh-28" />
          <div v-if="!sidebarCollapsed" class="text-size-14">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div
        class="px-16 py-16 flex flex-col gap-10"
        :class="!sidebarCollapsed ? 'border-b border-#fff/10 border-solid' : ''"
      >
        <div
          v-for="item in CasinoList"
          :key="item.id"
        >
          <div
            class="py-6 pl-12 pr-6 rounded-64 flex gap-4 cursor-pointer items-center"
            :class="[
              activeMenu === item.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF',
              sidebarCollapsed ? 'justify-center !p-6' : '',
            ]"
            @click="handlePCMenuClick(item)"
          >
            <div :class="item.icon" class="wh-28" />
            <span v-if="!sidebarCollapsed" class="text-size-14 flex-1">{{ item.name }}</span>
            <div v-if="item.children && !sidebarCollapsed" class="p-12" @click.stop="handleExpand(item)">
              <div class="i-custom:side-arrow h-4 w-9 transition-transform" :class="{ 'rotate-180': !expandedMenus.includes(item.id) }" />
            </div>
          </div>
          <div v-if="item.children && expandedMenus.includes(item.id) " class="py-10 flex flex-col gap-10">
            <div
              v-for="child in item.children"
              :key="child.id"
              class="py-6 pl-12 pr-4 rounded-64 flex gap-4 cursor-pointer items-center"
              :class="[
                activeMenu === child.id ? 'primary-shadow' : 'hover:secondary-shadow hover:text-#0DA6FF',
                sidebarCollapsed ? 'justify-center !p-6' : '',
              ]"
              @click.stop="handleSubmenuClick(child)"
            >
              <div :class="child.icon" class="wh-28" />
              <span v-if="!sidebarCollapsed" class="text-size-14 flex-1">{{ child.name }}</span>
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
            sidebarCollapsed ? 'justify-center !p-6' : '',
          ]"
          @click="handleRedirect(item)"
        >
          <div :class="item.icon" class="wh-28" />
          <div v-if="!sidebarCollapsed" class="text-size-14">
            {{ item.name }}
          </div>
        </div>
      </div>
    </aside>
    <div
      class="px-16 pt-54 bg-#1C1C1C flex flex-col w-full"
      :class="sidebarCollapsed ? 'items-center gap-12' : ''"
    >
      <div v-if="!sidebarCollapsed" class="application text-size-12 mb-10 pb-11 pl-14 pr-12 pt-8 rounded-15 flex gap-10 cursor-pointer items-center justify-between">
        <div class="flex gap-10 items-center">
          <div class="i-custom:side-application h-28 w-28" />
          <div>Application</div>
        </div>
        <div class="i-custom:side-qrcode h-40 w-40" />
      </div>
      <div v-else class="p-6 flex-center">
        <div class="i-custom:side-application h-28 w-28" />
      </div>
      <div v-if="!sidebarCollapsed" class="text-size-14 mb-12 py-6 pl-12 flex gap-4 cursor-pointer items-center">
        <div class="flex-center h-28 w-28">
          <div class="i-custom:side-customer wh-full" />
        </div>
        <div>Online customer service</div>
      </div>
      <div v-else class="p-6 flex-center">
        <div class="i-custom:side-customer wh-28" />
      </div>
      <div v-if="!sidebarCollapsed" class="text-size-14 mb-20 py-6 pl-12 flex gap-4 cursor-pointer items-center justify-between">
        <div class="flex gap-4 items-center">
          <div class="flex-center h-28 w-28">
            <img src="@/assets/images/demo/side-chinese.png" alt="chinese" class="wh-full">
          </div>
          <div>Simplified Chinese</div>
        </div>
        <div class="px-5 py-17 flex-center">
          <div class="i-custom:side-arrow h-5 w-9 rotate-180" />
        </div>
      </div>
      <div v-else class="p-6 flex-center">
        <img src="@/assets/images/demo/side-chinese.png" alt="chinese" class="wh-28">
      </div>
      <div
        v-if="!sidebarCollapsed"
        class="text-size-14 text-#959593 mt-8 p-2 rounded-20 bg-#2D2D31 flex gap-16 h-40 items-center"
        @click="checked = !checked"
      >
        <div class="rounded-full flex-center gap-8 h-36 w-1/2 cursor-pointer" :class="{ 'text-#fff primary-shadow': !checked }">
          <div class="i-custom:side-light h-24 w-24" />
          <div>Light</div>
        </div>
        <div class="rounded-full flex-center gap-8 h-36 w-1/2 cursor-pointer" :class="{ 'text-#fff primary-shadow': checked }">
          <div class="i-custom:side-dark h-24 w-24" />
          <div>Dark</div>
        </div>
      </div>
      <div v-else class="p-6 flex-center gap-16 cursor-pointer">
        <div v-if="!checked" class="i-custom:side-light wh-28" />
        <div v-else class="i-custom:side-dark wh-28" />
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

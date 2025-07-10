<script setup lang="ts">
import { MessageMapRegister } from '@/web-base/netBase/MessageMapRegister'
import PKwebsocket from '@/web-base/socket/Ws'
import { NetPacket } from '@/web-base/netBase/NetPacket'
import { WsEventName } from '@/types/ws-events'
import { wsRequest } from '@/composables/useWsRequest'

interface Game {
  id: number
  name: string
  players: number
  gradient: string
  category: string // 添加游戏分类
  provider: string // 添加游戏提供商
}
const activeMenu = ref('casino')

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
async function getMatch() {
  const info = NetPacket.req_slots_match_list()
  const res = await wsRequest(info, WsEventName.SlotsMatchList)
  console.log('data111111111--------: ', res)
}
MessageMapRegister.register()
onMounted(() => {
  PKwebsocket.instance.init() // 初始化websocket
  getMatch()
})
</script>

<template>
  <PageContainer :has-header="false">
    <template #header-sticky>
      <HomeHeader />
    </template>
    <div class="test-size-16 mt-60">
      {{ filteredGames }}
    </div>
  </PageContainer>
</template>

<route lang="json5">
{
  name: 'home',
  meta: {
    title: '首页',
    i18n: 'menus.home'
  },
}
</route>

<style scoped lang="scss"></style>

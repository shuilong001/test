import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useUserStore from './modules/user'
import { useGameStore } from './modules/game'
import useRouteCacheStore from './modules/routeCache'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useUserStore, useGameStore, useRouteCacheStore }
export default pinia

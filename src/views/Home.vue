<template>
  <div>
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
      <div class="loading-text">加载中...</div>
    </div>
    <div v-else-if="error" style="color:red;padding:12px;">{{ error }}</div>
    <div v-else id="injected-html" ref="containerRef" v-html="htmlContent"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, onActivated } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useHtmlLoader } from '../utils/htmlLoader'

defineOptions({
  name: 'Home',
  keepAlive: true
})


const { htmlContent, loading, error, containerRef, loadHtml } = useHtmlLoader('/home.htm')
const scrollTop = ref(0)

onActivated(() => {
  window.scrollTo(0, scrollTop.value)
})
onMounted(loadHtml)



onBeforeRouteLeave(() => {
  scrollTop.value
    = window.scrollY
      || document.documentElement.scrollTop
      || document.body.scrollTop

})
</script>

<style scoped>
/* 避免外层容器影响被注入页面的布局 */
#injected-html {
  all: unset;
}

#iris-root {
  width: 100vw;
  overflow: hidden;
}

.__APP_FOOTER {
  display: none;
}

.header-rightside {
  align-items: center;
}

/* 加载态样式 */
.loading-screen {
  position: fixed;
  inset: 0;
  background: #181A20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #EAECEF;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: #F0B90B;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.loading-text {
  font-size: 14px;
  color: #EAECEF;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<template>
  <div>
    <!-- 导航栏 -->
    <!-- <nav class="nav-bar">
      <div class="nav-container">
        <router-link to="/" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/blog1" class="nav-link" active-class="active">博客1</router-link>

      </div>
    </nav> -->
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
// Vue Router 会自动处理路由切换
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
}

/* 导航栏样式 */
.nav-bar {
  background: #181A20;
  border-bottom: 1px solid #2B3139;
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  display: flex;
  gap: 20px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

.nav-link {
  color: #EAECEF;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(240, 185, 11, 0.1);
  color: #F0B90B;
}

.nav-link.active {
  background: #F0B90B;
  color: #000;
}

/* 全局样式，保持与原来的行为一致 */
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
</style>

import path, { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { unheadVueComposablesImports } from '@unhead/vue'
import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import Components from 'unplugin-vue-components/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'
import { VitePWA } from 'vite-plugin-pwa'
import Sitemap from 'vite-plugin-sitemap'
// import VueDevTools from 'vite-plugin-vue-devtools'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { loadEnv } from 'vite'
import { createViteVConsole } from './vconsole'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

export function createVitePlugins(mode: string) {
  const env = loadEnv(mode, process.cwd())

  return [
    // https://github.com/posva/unplugin-vue-router
    VueRouter({
      extensions: ['.vue'],
      routesFolder: 'src/pages',
      dts: 'src/types/typed-router.d.ts',
    }),

    vue(),

    // https://github.com/jbaubree/vite-plugin-sitemap
    Sitemap({
      outDir: env.VITE_APP_OUT_DIR || 'dist',
    }),

    // https://github.com/pengzhanbo/vite-plugin-mock-dev-server
    mockDevServerPlugin(),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      extensions: ['vue'],
      resolvers: [VantResolver()],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/types/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      include: [
        /\.[tj]sx?$/,
        /\.vue$/,
        /\.vue\?vue/,
      ],
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
          '@/utils/i18n': ['i18n', 'locale'],
          'vue-i18n': ['useI18n'],
        },
        unheadVueComposablesImports,
      ],
      dts: 'src/types/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/hooks',
        'src/types/ws-events.ts',
        'src/types/net-packet.d.ts',
      ],
      resolvers: [VantResolver()],
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
    VueI18nPlugin({
      // locale messages resource pre-compile option
      include: resolve(dirname(fileURLToPath(import.meta.url)), '../../src/locales/**'),
    }),

    legacy({
      targets: ['defaults', 'not IE 11'],
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),
    Icons({
      compiler: 'vue3',
      /**
       * 按需引入这个选项会自动为你的应用安装必要的运行时。这意味着你不需要手动导入或注册图标组件，它们会自动被引入并可用。
       */
      // autoInstall: true,

      /**
       * 这个选项允许你定义自己的图标集合。每个集合都是一个键值对，其中键是集合的名称，值是一个加载器函数，用于加载和处理图标。
       */
      customCollections: {
        /**
         * FileSystemIconLoader
         * 第一个参数是 SVG 图标的路径，文件名（不包括扩展名）将被用作图标的名称
         * 第二个参数是这是一个处理函数，用于处理加载的 SVG 内容。在这个例子中，它将 SVG 的开头替换为 <svg fill="currentColor" 。
         * 这意味着图标的颜色会使用 CSS 的 currentColor 值，从而允许你通过 CSS 控制图标的颜色。
         */
        custom: FileSystemIconLoader(path.resolve('src', 'assets/svg'), svg =>
          svg.replace(/^<svg /, '<svg fill="currentColor" ')),
      },
    }),
    // https://github.com/vadxq/vite-plugin-vconsole
    createViteVConsole(mode),

    // https://github.com/vuejs/devtools-next
    // VueDevTools(),

    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate', // 自动更新 Service Worker
      manifest: {
        name: 'PKBET',
        short_name: 'PKBET',
        background_color: '#100e26',
        theme_color: '#100e26',
        display: 'standalone', // 全屏
        icons: [
          {
            src: '/pwa/logo_192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/pwa/logo_512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: [
          '**/*.js',
          '**/*.css',
          '**/*.html',
          '**/*.{ico,png,jpg,jpeg,svg,webp,gif,avif,json,woff2}',
        ],
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /pkbet_develop\.json$/,
            handler: 'NetworkOnly', // 总是从网络获取
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate', // 优先使用缓存，同时后台更新
            options: {
              cacheName: 'critical-assets',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7天
              },
            },
          },
          {
            urlPattern: /\.html$/,
            handler: 'NetworkFirst', // 对HTML使用网络优先
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60, // 1天
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst', // 图片最后缓存
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60天
              },
            },
          },
        ],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        // 添加预缓存忽略选项
        navigateFallback: null,
        navigateFallbackDenylist: [/\.(?:png|jpg|jpeg|svg)$/],
        // 自定义预缓存策略
        modifyURLPrefix: {
          // 'assets/': '/assets/'
        },
      },
    }),
  ]
}

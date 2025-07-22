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
import VueJsx from '@vitejs/plugin-vue-jsx'

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
    VueJsx(),

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
        'src/web-base/utils/index.ts',
        // 除了d.ts文件，其他文件都导入
        'src/types/*.ts',
        '!src/types/*.d.ts',
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

      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'PKBET - 专业游戏平台',
        short_name: 'PKBET',
        description: 'PKBET 是一个专业的移动游戏平台，提供优质的游戏体验',
        lang: 'zh-CN',
        start_url: '/',
        scope: '/',
        background_color: '#100e26',
        theme_color: '#100e26',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['games', 'entertainment'],
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
          {
            src: '/favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
        ],
        shortcuts: [
          {
            name: '首页',
            short_name: '首页',
            description: '快速访问首页',
            url: '/',
            icons: [{ src: '/pwa/logo_192x192.png', sizes: '192x192' }],
          },
          {
            name: '登录',
            short_name: '登录',
            description: '用户登录',
            url: '/login',
            icons: [{ src: '/pwa/logo_192x192.png', sizes: '192x192' }],
          },
        ],
        screenshots: [
          {
            src: '/pwa/screenshot-wide.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'PKBET 桌面版截图',
          },
          {
            src: '/pwa/screenshot-narrow.png',
            sizes: '750x1334',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'PKBET 移动版截图',
          },
        ],
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,gif,avif,json,woff2,woff,ttf,eot}',
        ],
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/_/,
          /\/[^/?]+\.[a-z0-9]+$/i,
          /^\/api\//,
          /^\/mock\//,
        ],
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          // API 接口缓存策略
          {
            urlPattern: /^\/api\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 5 * 60, // 5分钟
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // 开发配置文件始终从网络获取
          {
            urlPattern: /pkbet_develop\.json$/,
            handler: 'NetworkOnly',
          },
          // 静态资源缓存策略
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-js-css',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60, // 7天
              },
            },
          },
          // HTML 文件缓存策略
          {
            urlPattern: /\.html$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 24 * 60 * 60, // 1天
              },
            },
          },
          // 图片缓存策略
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30天
              },
            },
          },
          // 字体文件缓存策略
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60天
              },
            },
          },
          // 其他资源缓存策略
          {
            urlPattern: /\.(?:json|xml)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'data-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1天
              },
            },
          },
        ],
      },
    }),
  ]
}

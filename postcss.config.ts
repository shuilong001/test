// 此文件不支持热更新，修改后需要重启生效

export default {
  plugins: {
    'autoprefixer': {
      overrideBrowserslist: [
        'Android 4.1',
        'IOS 7.1',
        'FF > 31',
        'ie >= 8',
        'last 10 versions',
      ],
      grid: true,
    },

    // https://github.com/wswmsword/postcss-mobile-forever
    'postcss-mobile-forever': {
      appSelector: '#app',
      viewportWidth: 375,
      maxDisplayWidth: 375,
      // rootContainingBlockSelectorList,
    },
  },
}

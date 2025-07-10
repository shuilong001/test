import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,

    // Enable UnoCSS support
    // https://unocss.dev/integrations/vscode
    unocss: true,
    formatters: true,
  },
  {
    rules: {
      'no-console': 'off',
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-exports': 'off',
      'perfectionist/sort-named-exports': 'off',
    },
  },
  {
    ignores: [
      'src/web-base/net/**',
      'src/web-base/netBase/**',
    ],
  },
)

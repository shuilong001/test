import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

const BASE_FONT_SIZE = 4

export default defineConfig({
  shortcuts: [
    ['m-0-auto', 'm-0 ma'], // margin: 0 auto
    ['wh-full', 'w-full h-full'], // width: 100%, height: 100%
    ['flex-center', 'flex justify-center items-center'], // flex布局居中
    ['flex-x-center', 'flex justify-center'], // flex布局：主轴居中
    ['flex-x-slide', 'flex justify-start items-center flex-nowrap overflow-x-auto'], // flex横滑
    ['flex-x-slide-item', 'flex-grow-0 flex-shrink-0 '], // flex布局：flex横滑 子元素
    ['flex-y-center', 'flex items-center'], // flex布局：交叉轴居中
    ['flex-spaceBetween-itemsCenter', 'flex justify-between items-center'], // flex布局：
    ['flex-spaceBetween-itemsStart', 'flex justify-between items-start'], // flex布局：
    ['flex-start-itemsCenter', 'flex justify-start items-center'], // flex布局：左对齐中间对齐
    ['text-overflow', 'overflow-hidden whitespace-nowrap text-ellipsis'], // 文本溢出显示省略号
    ['text-break', 'whitespace-normal break-all break-words'], // 文本溢出换行
    ['bg-page', 'bg-[linear-gradient(90deg,#fff7fd_0%,#f7fdff_100%)]'],
    // 不是最后一个
    [/^not-last:(.*)$/, ([, v]) => {
      return `[&:not(:last-child)]:${v}`
    }],
    [/^wh-(.*)$/, ([, v]) => {
      return `w-${v} h-${v}`
    }],
    [/^b([trbld])-(.*)/, ([, v]) => {
      return `w-${v} h-${v}`
    }],
    [/^h-safe:(.*)$/, ([, v]) => {
      return `h-[calc(var(--vh)*100-var(--sab)-var(--sat)-${v})]`
    }],
    ['btn', 'px-6 py-3 rounded-4 border-none inline-block bg-green-400 text-white cursor-pointer outline-hidden hover:bg-green-600 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
  ],
  presets: [
    presetWind4({
      preflights: {
        theme: {
          process: createRemToPxProcessor(BASE_FONT_SIZE),
        },
      },
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  postprocess: [
    createRemToPxProcessor(BASE_FONT_SIZE),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})

import { createRemToPxProcessor } from '@unocss/preset-wind4/utils'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import type { CustomIconLoader } from '@iconify/utils/lib/loader/types'
import type { IconSet } from '@iconify/tools'
import { deOptimisePaths, importDirectory, parseColors, runSVGO } from '@iconify/tools'
import { compareColors, stringToColor } from '@iconify/utils/lib/colors'

const BASE_FONT_SIZE = 4
/**
 * Load custom icon set
 */
function loadCustomIconSet(): CustomIconLoader {
  const promise = new Promise<IconSet>((resolve, reject) => {
    importDirectory('src/assets/svg', {
      prefix: 'svg',
    }).then((iconSet) => {
      // Parse all icons: optimise, clean up palette
      iconSet
        .forEachSync((name) => {
          const svg = iconSet.toSVG(name)!

          // Change color to `currentColor`
          const blackColor = stringToColor('black')!
          parseColors(svg, {
            defaultColor: 'currentColor',
            callback: (attr, colorStr, color): any => {
              // console.log('Color:', colorStr, color);

              // Change black to 'currentColor'
              if (color && compareColors(color, blackColor))
                return 'currentColor'
              // console.log(color?.type, color)
              // switch (color?.type) {
              //   case 'none':
              //   case 'current':
              //     return color
              // }
              return color
              // throw new Error(
              //     `Unexpected color "${colorStr}" in attribute ${attr}`,
              // )
            },
          })

          // Optimise
          runSVGO(svg)

          // Update paths for compatibility with old software
          deOptimisePaths(svg)

          // Update icon in icon set
          iconSet.fromSVG(name, svg)
        })

      // Resolve with icon set
      resolve(iconSet)
    }).catch((err) => {
      reject(err)
    })
  })

  return async (name) => {
    const iconSet = await promise
    return iconSet.toSVG(name)?.toMinifiedString()
  }
}

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
      return `h-[calc(var(--full-height)-var(--sab)-var(--sat)-${v})]`
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
      collections: {
        custom: loadCustomIconSet(),
      },
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

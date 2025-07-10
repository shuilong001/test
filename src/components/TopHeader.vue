<script setup lang="ts">
import type { PickerColumn } from 'vant'
import { showToast } from 'vant'
import { languageColumns, locale } from '@/utils/i18n'
import { isDark, toggleDark } from '@/composables/dark'

// 搜索相关
const showSearch = ref(false)
const searchValue = ref('')

// 语言选择器
const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const currentLanguage = computed(() => languageColumns.find(l => l.value === locale.value)?.text || 'CN')

// 主题切换
const checked = computed({
  get: () => isDark.value,
  set: () => toggleDark(),
})

function onSearch() {
  showSearch.value = false
}

function onCancel() {
  showSearch.value = false
  searchValue.value = ''
}

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}
function onPcLanguageConfirm(value: string) {
  locale.value = value as string
  showLanguagePicker.value = false
}

function openCustomerService() {
  showToast('客服')
}

function openFavorites() {
  showToast('收藏')
}
</script>

<template>
  <div class="py-12 bg-white transition-colors duration-300 dark:border-gray-700 dark:bg-gray-900">
    <div class="mx-auto px-16">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="logo flex flex-shrink-0 gap-8 items-center">
          <div class="i-carbon:game-console text-size-16 text-orange-500" />
          <span class="text-size-16 font-bold">PKBet</span>
        </div>

        <!-- 右侧操作区 -->
        <div class="flex gap-8 items-center lg:gap-4">
          <!-- 搜索 -->
          <div class="i-carbon:search text-size-16" @click="showSearch = true" />

          <!-- 收藏 -->
          <div class="i-carbon:favorite text-size-16 lg:text-size-14" @click="openFavorites" />

          <!-- 客服 -->
          <div class="i-carbon:headset text-size-16 lg:text-size-14" @click="openCustomerService" />

          <!-- 多语言 -->
          <div class="text-size-14 font-medium rounded" @click="showLanguagePicker = true">
            {{ currentLanguage }}
          </div>

          <!-- 主题切换 (桌面端显示) -->
          <van-switch
            v-model="checked"
            size="20px"
            aria-label="切换主题"
          />
        </div>
      </div>
    </div>

    <!-- 搜索弹窗 -->
    <van-popup v-model:show="showSearch" class="h-screen" position="top">
      <van-search
        v-model="searchValue"
        placeholder="搜索游戏..."
        show-action
        @search="onSearch"
        @cancel="onCancel"
      />
      <div class="flex h-400 items-center justify-center">
        暂无搜索结果
      </div>
    </van-popup>

    <!-- 语言选择器 -->
    <van-popup v-model:show="showLanguagePicker" position="bottom" class="md:hidden">
      <van-picker
        v-model="languageValues"
        :columns="languageColumns"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false"
      />
    </van-popup>
    <!-- pc语言选择器 -->
    <van-popup v-model:show="showLanguagePicker" position="center" class="hidden md:block">
      <div class="py-16 flex flex-col w-200 items-center justify-center">
        <van-radio-group v-model="languageValues" class="flex flex-col gap-16" @change="onPcLanguageConfirm">
          <van-radio v-for="item in languageColumns" :key="item.value" :name="item.value">
            {{ item.text }}
          </van-radio>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>

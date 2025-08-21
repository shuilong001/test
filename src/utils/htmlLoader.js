import { ref, nextTick } from 'vue'

/**
 * 创建HTML加载器组合式函数
 * @param {string} htmlFile - 要加载的HTML文件路径
 * @returns {Object} 包含状态和方法的响应式对象
 */
export function useHtmlLoader(htmlFile) {
  const htmlContent = ref('')
  const loading = ref(true)
  const error = ref('')
  const containerRef = ref(null)

  async function loadHtml() {
    try {
      loading.value = true
      error.value = ''
      
      const res = await fetch(htmlFile, { cache: 'no-store' })
      if (!res.ok) throw new Error('加载失败：' + res.status)
      const text = await res.text()

      // 解析 HTML，提取 head 与 body
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')

      // 注入 head 内的样式（link/style）
      injectHeadAssets(doc)

      // 仅渲染 body 内容至容器（满足使用 v-html 的要求）
      htmlContent.value = doc.body ? doc.body.innerHTML : text

      await nextTick()

      // 先执行 head scripts（按顺序），再执行 body scripts（就地替换，保持顺序）
      executeHeadScripts(doc)
      activateBodyScripts()
    } catch (e) {
      error.value = e?.message || '加载出错'
    } finally {
      setTimeout(() => {
        loading.value = false
      }, 300)
    }
  }

  function injectHeadAssets(doc) {
    const head = doc.head
    if (!head) return

    // link rel=stylesheet
    const links = Array.from(head.querySelectorAll('link[rel="stylesheet"]'))
    for (const link of links) {
      const href = link.getAttribute('href')
      if (!href) continue
      if (!document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
        const clone = document.createElement('link')
        for (const { name, value } of Array.from(link.attributes)) {
          clone.setAttribute(name, value)
        }
        document.head.appendChild(clone)
      }
    }

    // 内联 <style>
    const styles = Array.from(head.querySelectorAll('style'))
    for (const styleEl of styles) {
      const clone = document.createElement('style')
      clone.textContent = styleEl.textContent || ''
      document.head.appendChild(clone)
    }
  }

  function executeHeadScripts(doc) {
    const head = doc.head
    if (!head) return
    const scripts = Array.from(head.querySelectorAll('script'))
    for (const oldScript of scripts) {
      const newScript = document.createElement('script')
      for (const { name, value } of Array.from(oldScript.attributes)) {
        newScript.setAttribute(name, value)
      }
      newScript.async = false
      if (!oldScript.src) {
        newScript.textContent = oldScript.textContent || ''
      }
      document.head.appendChild(newScript)
    }
  }

  function activateBodyScripts() {
    const container = containerRef.value
    if (!container) return
    const scripts = Array.from(container.querySelectorAll('script'))
    for (const oldScript of scripts) {
      const newScript = document.createElement('script')
      // 保留 script 的所有属性（如 src、type、crossorigin 等）
      for (const { name, value } of Array.from(oldScript.attributes)) {
        newScript.setAttribute(name, value)
      }
      newScript.async = false
      // 对于内联脚本，复制其内容
      if (!oldScript.src) {
        newScript.textContent = oldScript.textContent || ''
      }
      // 在原位置后插入新脚本，再移除旧脚本，保持顺序与相对位置
      const parent = oldScript.parentNode
      if (parent) {
        parent.insertBefore(newScript, oldScript.nextSibling)
        parent.removeChild(oldScript)
      }
    }
  }

  return {
    htmlContent,
    loading,
    error,
    containerRef,
    loadHtml
  }
}

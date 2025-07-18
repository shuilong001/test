import { useSystemStore } from '@/stores/modules/system'
import { isRunningAsPWA } from '@/utils/helper'
import eventBus from '@/web-base/socket/eventBus'
import PKwebsocket from '@/web-base/socket/Ws'

/**
 * 设备检测工具
 */
class DeviceDetector {
  /**
   * 判断是否为安卓设备
   */
  static isAndroid(): boolean {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes('android')
  }
}

/**
 * 触摸事件管理器
 * 处理多点触控、双击防抖等触摸相关事件
 */
class TouchEventManager {
  private lastTouchEnd = 0
  private readonly DOUBLE_CLICK_THRESHOLD = 300 // 双击检测阈值（毫秒）

  constructor() {}

  init() {
    this.initTouchEvents()
  }

  /**
   * 初始化触摸事件监听器
   */
  private initTouchEvents(): void {
    // 禁止多点触控
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), false)

    // 双击防抖
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false })

    // 阻止双指放大页面
    document.addEventListener('gesturestart', this.handleGestureStart.bind(this))

    // 禁用右键菜单
    document.oncontextmenu = this.handleContextMenu.bind(this)
  }

  /**
   * 处理触摸开始事件
   */
  private handleTouchStart(event: TouchEvent): void {
    // 多根手指同时按下屏幕，禁止默认行为
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  }

  /**
   * 处理触摸结束事件
   */
  private handleTouchEnd(event: TouchEvent): void {
    const now = Date.now()
    if (now - this.lastTouchEnd <= this.DOUBLE_CLICK_THRESHOLD) {
      // 双击屏幕行为，禁止默认行为
      event.preventDefault()
    }
    else {
      // 更新手指弹起的时间
      this.lastTouchEnd = now
    }
  }

  /**
   * 处理手势开始事件
   */
  private handleGestureStart(event: Event): void {
    event.preventDefault()
  }

  /**
   * 处理右键菜单事件
   */
  private handleContextMenu(event: Event): void {
    event.preventDefault()
  }
}

/**
 * PWA 安装管理器
 * 处理 PWA 应用的安装提示
 */
class PWAInstallManager {
  private deferredPrompt: any = null
  private readonly SESSION_KEY = 'appinstall_popup'

  constructor() {}

  init() {
    this.initPWAEvents()
  }

  /**
   * 初始化 PWA 相关事件
   */
  private initPWAEvents(): void {
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt.bind(this))
    window.addEventListener('click', this.handleClickForInstall.bind(this))
  }

  /**
   * 处理安装提示事件
   */
  private handleBeforeInstallPrompt(event: Event): void {
    event.preventDefault()
    this.deferredPrompt = event
  }

  /**
   * 处理点击安装事件
   */
  private handleClickForInstall(): void {
    const hasShownPopup = sessionStorage.getItem(this.SESSION_KEY)
    if (hasShownPopup || !this.deferredPrompt) {
      return
    }

    this.deferredPrompt.prompt()
    this.deferredPrompt.userChoice.then(() => {
      sessionStorage.setItem(this.SESSION_KEY, '1')
      this.deferredPrompt = null
    })
  }
}

/**
 * 页面可见性管理器
 * 处理页面前台/后台切换
 */
class VisibilityManager {
  private readonly WS_RECONNECT_DELAY = 1000
  private readonly ANDROID_HEIGHT_ADJUST_DELAY = 300

  constructor() {}

  init() {
    this.initVisibilityEvents()
  }

  /**
   * 初始化页面可见性事件
   */
  private initVisibilityEvents(): void {
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
  }

  /**
   * 处理页面可见性变化
   */
  private async handleVisibilityChange(): Promise<void> {
    if (document.visibilityState === 'visible') {
      this.handlePageVisible()
    }
    else if (document.visibilityState === 'hidden') {
      this.handlePageHidden()
    }
  }

  /**
   * 处理页面进入前台
   */
  private handlePageVisible(): void {
    console.log('进入前台')
    eventBus.emit('window_visible')

    // WebSocket 重连
    setTimeout(() => {
      if (!useSystemStore().isWsConnected) {
        PKwebsocket.instance.init()
      }
    }, this.WS_RECONNECT_DELAY)

    // 安卓设备高度调整
    if (DeviceDetector.isAndroid()) {
      setTimeout(() => {
        ViewportManager.setFullHeight()
      }, this.ANDROID_HEIGHT_ADJUST_DELAY)
    }
  }

  /**
   * 处理页面切换到后台
   */
  private handlePageHidden(): void {
    console.log('切换到后台')
  }
}

/**
 * 视口管理器
 * 处理视口高度、CSS 自定义属性等
 */
class ViewportManager {
  private static readonly supportsDvh = CSS.supports('height', '100dvh')
  private static isFocus = false // 输入状态标记，键盘弹起时不重新计算高度
  private static focusoutTimeout: NodeJS.Timeout | null = null

  /**
   * 设置 CSS 自定义属性
   */
  static setProperty(type: string = 'dvh'): void {
    if (!this.supportsDvh)
      return

    document.documentElement.style.setProperty('--each-height', `1${type}`)
    document.documentElement.style.setProperty('--full-height', `100${type}`)
  }

  /**
   * 设置完整高度
   */
  static setFullHeight(): void {
    if (this.supportsDvh || isRunningAsPWA() || this.isFocus) {
      return
    }

    const vwn = window.innerWidth
    const vhn = window.innerHeight

    // 横屏时不处理
    if (vwn > vhn) {
      return
    }

    const vh = this.getOptimalHeight() * 0.01
    document.documentElement.style.setProperty('--full-height', `calc(${vh}px * 100)`)
    document.documentElement.style.setProperty('--each-height', `${vh}px`)
  }

  /**
   * 获取最佳高度值
   */
  private static getOptimalHeight(): number {
    const visualHeight = window?.visualViewport?.height ?? 0
    const innerHeight = window?.innerHeight ?? 0

    if (visualHeight > 0 && innerHeight > 0) {
      return Math.min(visualHeight, innerHeight)
    }
    else if (visualHeight > 0 || innerHeight > 0) {
      return visualHeight > 0 ? visualHeight : innerHeight
    }
    else {
      return 0
    }
  }

  /**
   * 初始化视口管理
   */
  static init(): void {
    // PWA 环境下使用 vh
    if (isRunningAsPWA()) {
      this.setProperty('vh')
    }

    // 页面加载完成时设置高度
    window.addEventListener('load', () => {
      this.setFullHeight()
    })

    // 初始设置
    this.setFullHeight()

    // 窗口大小变化时重新设置
    window.addEventListener('resize', () => {
      this.setFullHeight()
    })

    // 视口变化时重新设置
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        this.setFullHeight()
      })
    }

    // 初始化输入焦点事件
    this.initFocusEvents()
  }

  /**
   * 初始化输入焦点事件
   */
  private static initFocusEvents(): void {
    document.body.addEventListener('focusin', this.handleFocusIn.bind(this))
    document.body.addEventListener('focusout', this.handleFocusOut.bind(this))
  }

  /**
   * 处理输入框获得焦点
   */
  private static handleFocusIn(): void {
    this.isFocus = true

    if (this.focusoutTimeout) {
      clearTimeout(this.focusoutTimeout)
    }

    setTimeout(() => {
      if (!isRunningAsPWA()) {
        this.setProperty('lvh')
      }
    }, 600)
  }

  /**
   * 处理输入框失去焦点
   */
  private static handleFocusOut(): void {
    setTimeout(() => {
      if (!isRunningAsPWA()) {
        this.setProperty('dvh')
      }
    }, 600)

    this.focusoutTimeout = setTimeout(() => {
      this.isFocus = false
      if (this.focusoutTimeout) {
        clearTimeout(this.focusoutTimeout)
        this.focusoutTimeout = null
      }

      // 平滑滚动到顶部
      window.scrollTo({
        top: 1,
        behavior: 'smooth',
      })
    }, 500)

    setTimeout(() => {
      this.setFullHeight()
    }, 300)
  }
}

/**
 * 事件管理器主类
 * 统一管理所有事件监听器的初始化
 */
class EventManager {
  private touchManager: TouchEventManager
  private pwaManager: PWAInstallManager
  private visibilityManager: VisibilityManager

  constructor() {
    this.touchManager = new TouchEventManager()
    this.pwaManager = new PWAInstallManager()
    this.visibilityManager = new VisibilityManager()
  }

  init() {
    this.touchManager.init()
    this.pwaManager.init()
    this.visibilityManager.init()
    // 初始化视口管理
    ViewportManager.init()
  }
}

// 导出工具函数供外部使用
export { ViewportManager, EventManager }

export interface MenuItem {
  id: string
  name: string
  icon: string
  route?: string
  count?: number
  children?: MenuItem[]
}

export interface MenuEvent {
  type: 'select' | 'toggle' | 'expand' | 'collapse'
  item?: MenuItem
  data?: any
}

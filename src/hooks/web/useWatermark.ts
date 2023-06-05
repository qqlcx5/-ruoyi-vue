import { useUserStoreWithOut } from '@/store/modules/user'

const domSymbol = Symbol('watermark-dom')

export function useWatermark(appendEl: HTMLElement | null = document.body) {
  let func: Fn = () => {}
  const id = domSymbol.toString()
  const clear = () => {
    const domId = document.getElementById(id)
    if (domId) {
      const el = appendEl
      el && el.removeChild(domId)
    }
    window.removeEventListener('resize', func)
  }
  const createWatermark = (str: string) => {
    clear()

    const can = document.createElement('canvas')
    can.width = 360
    can.height = 240

    const cans = can.getContext('2d')
    if (cans) {
      cans.rotate((-20 * Math.PI) / 120)
      cans.font = '15px Vedana'
      cans.fillStyle = 'rgba(0, 0, 0, 0.1)'
      cans.textAlign = 'left'
      cans.textBaseline = 'middle'
      cans.fillText(str, can.width / 20, can.height)
    }

    const div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none'
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'absolute'
    div.style.zIndex = '100000000'
    div.style.width = document.documentElement.clientWidth + 'px'
    div.style.height = document.documentElement.clientHeight + 'px'
    div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
    const el = appendEl
    el && el.appendChild(div)
    return id
  }

  function setWatermark(content: string | undefined) {
    const userStore = useUserStoreWithOut()
    if (content !== undefined) {
      const tenant = userStore.getTenant
      const user = userStore.getUser
      let watermark = content || tenant.watermark || tenant.systemName || ''
      if (watermark) {
        if (user.nickname) watermark += `-${user.nickname}`
        if (user.username) watermark += `-${user.username}`
      }
      createWatermark(watermark)
      func = () => {
        createWatermark(watermark)
      }
      window.addEventListener('resize', func)
    } else {
      clear()
    }
  }

  return { setWatermark, clear }
}

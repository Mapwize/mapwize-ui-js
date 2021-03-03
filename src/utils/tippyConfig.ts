import tippy from 'tippy.js'

const tippyConfig: any = {
  theme: 'dark',
  trigger: 'mouseenter',
  duration: [300, 0],
  touch: false,
  hideOnClick: true,
  offset: [0, 5],
}

export const buildTooltip = (container: HTMLElement, title: string, opts: any = {}): any => {
  return tippy(container, { ...tippyConfig, ...opts, content: title })
}

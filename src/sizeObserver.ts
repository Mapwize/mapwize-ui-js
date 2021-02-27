export const sizeChange =(map: any, uiContainer: HTMLElement, sizeBreakPoint: number) => {
  const size = map.getSize()
  if (size.x < sizeBreakPoint) {
    uiContainer.classList.add('mwz-small-screen')
  }
  else {
    uiContainer.classList.remove('mwz-small-screen')
  }
}

export const observeChange = (map: any, uiContainer: HTMLElement, sizeBreakPoint: number = 800) => {

  sizeChange(map, uiContainer, sizeBreakPoint)
  map.on('resize', () => {
    sizeChange(map, uiContainer, sizeBreakPoint)
  })

}
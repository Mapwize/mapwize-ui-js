export interface BottomViewDirectionProps {
  durationLabel: string
  distanceLabel: string
  errorLabel?: string
}

export default class BottomViewDirection {
  private container: HTMLElement
  private timeLabel: HTMLSpanElement
  private distanceLabel: HTMLSpanElement
  private errorLabel: HTMLSpanElement

  constructor() {
    this.container = document.createElement('div')
    this.container.classList.add('mwz-bottom-view-direction')
  }

  public getHtmlElement() {
    return this.container
  }

  public setProps(props: BottomViewDirectionProps) {
    this.container.innerHTML = ''

    if (props.errorLabel) {
      const errorDiv = document.createElement('div')
      errorDiv.classList.add('mwz-direction-error-label')
      errorDiv.innerHTML = props.errorLabel
      this.container.appendChild(errorDiv)
    } else {
      const timeDiv = document.createElement('div')
      timeDiv.classList.add('mwz-bottom-view-direction-item')
      this.container.appendChild(timeDiv)
      const timeImage = document.createElement('img')
      timeImage.classList.add('mwz-bottom-view-direction-item-image')
      timeImage.src =
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDggNDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MjtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxnPgoJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMjQiIGN5PSIyNCIgcj0iMjEuNCIvPgoJPHBhdGggZD0iTTMyLjYsMzAuNGwtNi4xLTYuMWMwLTAuMSwwLTAuMywwLTAuNGMwLTAuOS0wLjUtMS43LTEuMi0yLjFWOC43YzAtMC40LTAuNC0wLjgtMC44LTAuOGgtMWMtMC4zLDAtMC42LDAuMy0wLjYsMC42djEzLjIKCQljLTAuNiwwLjMtMSwwLjktMS4yLDEuNmMwLDAsMCwwLDAsMGMwLDAuMS0wLjEsMC4zLTAuMSwwLjRjMCwwLDAsMCwwLDBjMCwwLDAsMCwwLDBjMCwxLjMsMS4xLDIuNCwyLjQsMi40YzAuMSwwLDAuMSwwLDAuMiwwCgkJYzAsMCwwLDAsMCwwYzAuMSwwLDAuMiwwLDAuMywwbDYuMSw2LjFjMC4yLDAuMiwwLjYsMC4yLDAuOSwwbDEuMS0xLjFDMzIuOCwzMS4xLDMyLjgsMzAuNywzMi42LDMwLjR6IE0yNC4xLDIyLjcKCQljMC43LDAsMS4yLDAuNiwxLjIsMS4ycy0wLjYsMS4yLTEuMiwxLjJjLTAuNywwLTEuMi0wLjYtMS4yLTEuMlMyMy40LDIyLjcsMjQuMSwyMi43eiIvPgo8L2c+Cjwvc3ZnPgo='
      timeDiv.appendChild(timeImage)
      this.timeLabel = document.createElement('span')
      this.timeLabel.classList.add('mwz-bottom-view-direction-item-label')
      this.timeLabel.innerHTML = props.durationLabel
      timeDiv.appendChild(this.timeLabel)

      const distanceDiv = document.createElement('div')
      distanceDiv.classList.add('mwz-bottom-view-direction-item')
      this.container.appendChild(distanceDiv)
      const distanceImage = document.createElement('img')
      distanceImage.classList.add('mwz-bottom-view-direction-item-image')
      distanceImage.src =
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkNhbHF1ZV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNDggNDgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4IDQ4OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTIzLDExLjdjLTAuMiwwLTAuMywwLjEtMC41LDAuMWMtMC4yLDAtMC4zLDAuMS0wLjUsMC4ybC04LDRjLTAuMywwLjItMC42LDAuNC0wLjgsMC43bC00LDZjLTAuNiwwLjktMC40LDIuMiwwLjYsMi44CgkJCWMwLjksMC42LDIuMiwwLjQsMi44LTAuNmMwLDAsMCwwLDAsMGwzLjctNS42bDQuNi0yLjNjLTAuMSwwLjQtMC4xLDAuOC0wLjEsMC44Yy0wLjYsMy0xLjQsNi44LTEuOCw4Yy0wLjYsMi44LDEuNCw0LjQsMS40LDQuNAoJCQlsNyw3bDMuOCw5LjVjMC40LDEsMS42LDEuNSwyLjYsMS4xYzEtMC40LDEuNS0xLjYsMS4xLTIuNmwtNC0xMC4xYy0wLjEtMC4yLTAuMS0wLjMtMC4zLTAuNGwtMS41LTJsLTMuMS01bDEuNC03bDEuMSwyLjkKCQkJYzAuMiwwLjUsMC42LDAuOSwxLjEsMS4xbDYuNywzYzEsMC42LDIuMiwwLjMsMi44LTAuN2MwLjYtMSwwLjMtMi4yLTAuNy0yLjhjLTAuMS0wLjEtMC4zLTAuMS0wLjQtMC4ybC01LjktMi43bC0zLjEtOC4yCgkJCWMtMC4zLTAuOC0xLTEuMy0xLjktMS4zaC0zLjFDMjMuNSwxMS43LDIzLjMsMTEuNywyMywxMS43eiIvPgoJCTxjaXJjbGUgY3g9IjI3LjkiIGN5PSI0LjgiIHI9IjQuOCIvPgoJPC9nPgoJPHBhdGggZD0iTTE4LjQsMzAuNWwtMS4zLDYuMmwtNS42LDcuNWMtMC42LDAuOS0wLjQsMi4xLDAuNCwyLjdjMC45LDAuNiwyLjEsMC40LDIuNy0wLjRsNS42LTcuNWMwLjEtMC4xLDAuMS0wLjIsMC4yLTAuMmwwLjEtMC4xCgkJYzAsMCwwLjEtMC4xLDAuMS0wLjJjMCwwLDAsMCwwLDBjMCwwLDAtMC4xLDAuMS0wLjFjMC4xLTAuMiwwLjEtMC4zLDAuMi0wLjVsMS4yLTIuOWMwLjEtMC4yLDAtMC41LTAuMS0wLjdsLTIuOC0yLjgKCQlDMTksMzEuMywxOC42LDMwLjksMTguNCwzMC41eiIvPgo8L2c+Cjwvc3ZnPgo='
      distanceDiv.appendChild(distanceImage)
      this.distanceLabel = document.createElement('span')
      this.distanceLabel.classList.add('mwz-bottom-view-direction-item-label')
      this.distanceLabel.innerHTML = props.distanceLabel
      distanceDiv.appendChild(this.distanceLabel)
    }
  }

  public setHidden(hidden: boolean) {
    if (hidden) {
      this.container.classList.add('mwz-gone')
    } else {
      this.container.classList.remove('mwz-gone')
    }
  }

  public setContent(distance: number, time: number) {}
}

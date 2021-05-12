import { FollowUserMode } from '../types/types'

export type FollowUserClickCallback = () => void

export default class FollowUserButton {
  private container: HTMLElement

  constructor(callback: FollowUserClickCallback) {
    this.container = document.createElement('div')
    this.container.className = 'mwz-follow-user-button mwz-follow-no-location'
    this.container.onclick = callback
  }

  public getHTMLElement(): HTMLElement {
    return this.container
  }

  public setSelectedMode(mode: FollowUserMode) {
    if (mode === FollowUserMode.None) {
      this.container.className = 'mwz-follow-user-button mwz-follow-off'
    } else if (mode === FollowUserMode.FollowUser) {
      this.container.className = 'mwz-follow-user-button mwz-follow-on'
    } else if (mode === FollowUserMode.FollowUserAndHeading) {
      this.container.className = 'mwz-follow-user-button mwz-follow-heading'
    } else {
      this.container.className = 'mwz-follow-user-button mwz-follow-no-location'
    }
  }
}

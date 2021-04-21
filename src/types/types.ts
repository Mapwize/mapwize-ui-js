export interface Floor {
  number: number
  name: string
  translations: FloorTranslation[]
}

export interface FloorTranslation {
  language: string
  title: string
  shortTitle: string
}

export interface Translation {
  title: string
  subTitle: string
  details?: string
  language: string
}

export interface Universe {
  _id: string
  name: string
}

export interface Language {
  code: string
  name: string
}

export interface SearchResult {
  _id: string
  title: string
  subtitle: string
  floor?: number
  floorLabel?: string
  cache: { '30': string }
  objectClass: 'place' | 'venue' | 'placeList'
}

export interface DirectionMode {
  _id: string
  type: string
}

export enum FollowUserMode {
  None = 'NONE',
  FollowUser = 'FOLLOW_USER',
  FollowUserAndHeading = 'FOLLOW_USER_AND_HEADING',
}

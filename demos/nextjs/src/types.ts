import { langOptions, secretOptions, siteKeyOptions, sizeOptions } from './constants'

export type SiteKeyType = (typeof siteKeyOptions)[number]['value']

export type SecretKeyType = (typeof secretOptions)[number]['value']

export type WidgetSize = (typeof sizeOptions)[number]['value']

export type Lang = (typeof langOptions)[number]['value']

export type Theme = 'light' | 'dark' | 'auto'

export type WidgetStatus = 'solved' | 'error' | 'expired' | null

import type { UserSettings } from '@/types'

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  calendar: {
    weekStartsOn: 1,
    defaultView: 'month',
  },
  sounds: true,
}

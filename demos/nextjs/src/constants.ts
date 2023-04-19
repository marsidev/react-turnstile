export const langOptions = [
	{ label: 'Auto', value: 'auto' },
	{ label: 'العربية', value: 'ar' },
	{ label: 'العربية (مصر)', value: 'ar-EG' },
	{ label: 'Deutsch', value: 'de' },
	{ label: 'English', value: 'en' },
	{ label: 'Español', value: 'es' },
	{ label: 'فارسی', value: 'fa' },
	{ label: 'Français', value: 'fr' },
	{ label: 'Bahasa Indonesia', value: 'id' },
	{ label: 'Italiano', value: 'it' },
	{ label: '日本語', value: 'ja' },
	{ label: '한국어', value: 'ko' },
	{ label: 'Nederlands', value: 'nl' },
	{ label: 'Polski', value: 'pl' },
	{ label: 'Português', value: 'pt' },
	{ label: 'Português (Brasil)', value: 'pt-BR' },
	{ label: 'Русский', value: 'ru' },
	{ label: 'Türkçe', value: 'tr' },
	{ label: '中文（简体）', value: 'zh-CN' },
	{ label: '繁體中文', value: 'zh-TW' }
] as const

export const themeOptions = [
	{ label: 'Auto', value: 'auto' },
	{ label: 'Light', value: 'light' },
	{ label: 'Dark', value: 'dark' }
] as const

export const sizeOptions = [
	{ label: 'Normal', value: 'normal' },
	{ label: 'Compact', value: 'compact' },
	{ label: 'Invisible', value: 'invisible' }
] as const

export const siteKeyOptions = [
	{ label: 'Always pass', value: 'pass' },
	{ label: 'Always fail', value: 'fail' },
	{ label: 'Force interactive challenge', value: 'interactive' }
] as const

export const secretOptions = [
	{ label: 'Always pass', value: 'pass' },
	{ label: 'Always fail', value: 'fail' },
	{ label: '"Token already spent" error', value: 'spent' }
] as const

export enum DEMO_SITEKEY {
	pass = '1x00000000000000000000AA',
	fail = '2x00000000000000000000AB',
	interactive = '3x00000000000000000000FF'
}

export enum DEMO_SECRET {
	pass = '1x0000000000000000000000000000000AA',
	fail = '2x0000000000000000000000000000000AA',
	spent = '3x0000000000000000000000000000000AA'
}

export const pages = [
	{
		title: 'Basic demo',
		href: '/basic'
	},
	{
		title: 'Manual script injection',
		href: '/manual-script-injection'
	},
	{
		title: 'Manual script injection with custom script props',
		href: '/manual-script-injection-with-custom-script-props'
	},
	{
		title: 'Multiple widgets',
		href: '/multiple-widgets'
	},
	{
		title: 'Multiple widgets and manual script injection',
		href: '/multi-widgets-and-manual-injection'
	}
]

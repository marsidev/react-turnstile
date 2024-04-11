import { twMerge } from 'tailwind-merge'
import type { Argument } from 'classnames'
import classNames from 'classnames'

export function cn(...inputs: Argument[]) {
	return twMerge(classNames(inputs))
}

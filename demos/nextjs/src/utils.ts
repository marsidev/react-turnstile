import { twMerge } from 'tailwind-merge'
import classNames, { Argument } from 'classnames'

export function cn(...inputs: Argument[]) {
	return twMerge(classNames(inputs))
}

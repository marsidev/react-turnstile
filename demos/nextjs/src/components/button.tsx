import { forwardRef } from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '~/utils'

export const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background focus:ring-cloudflare-light-600 dark:focus:ring-cloudflare-500',
	{
		variants: {
			variant: {
				cloudflare:
					'text-white dark:text-gray-800 bg-cloudflare-light-500 hover:bg-cloudflare-light-600 dark:bg-cloudflare-400 dark:hover:bg-cloudflare-500 focus:ring-cloudflare-light-700 dark:focus:ring-cloudflare-700',
				ghost:
					'hover:bg-cloudflare-light-500 dark:hover:bg-cloudflare-400 text-gray-800 dark:text-white bg-transparent hover:text-white'
			},
			size: {
				default: 'h-10 py-2 px-4',
				sm: 'h-9 px-2 rounded-md',
				lg: 'h-11 px-8 rounded-md'
			}
		},
		defaultVariants: {
			variant: 'cloudflare',
			size: 'default'
		}
	}
)

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
		)
	}
)

Button.displayName = 'Button'

export { Button }

import { useAtom } from 'jotai'
import Link from './link'
import { mobileNavExpandedAtom } from '~/store'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import { cn } from '~/utils'

type Props = React.HTMLAttributes<HTMLDivElement>

function Footer({ className, ...rest }: Props) {
	const [mobileNavExpanded] = useAtom(mobileNavExpandedAtom)
	const isLargeScreen = useBreakpoint('lg')
	const noTabbable = !isLargeScreen && !mobileNavExpanded

	return (
		<footer
			className={cn(className, 'flex flex-col items-center text-sm font-semibold opacity-75')}
			{...rest}
		>
			<div>
				Check the{' '}
				<Link href="https://docs.page/marsidev/react-turnstile/" tabIndex={noTabbable ? -1 : 0}>
					docs
				</Link>
			</div>

			<div>
				Check the{' '}
				<Link href="https://github.com/marsidev/react-turnstile" tabIndex={noTabbable ? -1 : 0}>
					source code
				</Link>
			</div>

			<div>
				Built by{' '}
				<Link href="https://github.com/marsidev" tabIndex={noTabbable ? -1 : 0}>
					Luis Marsiglia
				</Link>
			</div>
		</footer>
	)
}

export default Footer

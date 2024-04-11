import type { ComponentPropsWithoutRef, ElementType, ForwardedRef } from 'react'
import { forwardRef } from 'react'

type Props<Tag extends ElementType> = {
	as?: Tag
} & ComponentPropsWithoutRef<Tag>

type ComponentProps<Tag extends ElementType = 'div'> = Tag extends keyof JSX.IntrinsicElements
	? Props<Tag>
	: Props<any>

function Component<Tag extends ElementType = 'div'>(
	{ as: Element = 'div', ...props }: ComponentProps<Tag>,
	ref: ForwardedRef<Element>
) {
	return <Element {...props} ref={ref} />
}

export default forwardRef(Component)

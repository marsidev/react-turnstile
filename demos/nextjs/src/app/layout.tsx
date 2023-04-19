import '~/app/globals.css'
import { Inter } from 'next/font/google'
import Header from '~/components/header'
import Sidebar from '~/components/sidebar'
import Content from '~/components/content'
import ThemeProvider from '~/components/theme-provider'
import { cn } from '~/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'React Turnstile Demo',
	description: 'React Turnstile Next.js 13 App Router Demo'
}

export default function RootLayout({ children }: React.PropsWithChildren) {
	return (
		<html suppressHydrationWarning lang="en">
			<body className={cn(inter.className, 'min-h-screen antialiased')}>
				<ThemeProvider attribute="class">
					<Header />
					<section className="mx-auto max-w-8xl px-4 sm:px-6 md:px-8">
						<Sidebar />

						<Content>{children}</Content>
					</section>
				</ThemeProvider>
			</body>
		</html>
	)
}

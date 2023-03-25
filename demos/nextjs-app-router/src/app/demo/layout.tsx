import '~/app/globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'React Turnstile Demo',
	description: 'React Turnstile Next.js 13 App Router Demo'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#1d1f20] py-24">
					<div className="flex w-full max-w-[740px] flex-col justify-center gap-2 p-4 text-white">
						{children}
					</div>
				</main>
			</body>
		</html>
	)
}

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'React Turnstile Demo',
	description: 'React Turnstile Next.js 13 App Router Demo'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	)
}

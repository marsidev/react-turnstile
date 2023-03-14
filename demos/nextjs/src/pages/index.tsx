import type { NextPage } from 'next'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import cn from 'classnames'
import Demo from '../components/Demo'

const inter = Inter({ subsets: ['latin'] })

const Home: NextPage = () => {
	return (
		<div className={cn(inter.className, 'bg-[#1d1f20]')}>
			<Head>
				<title>React Turnstile Demo</title>
				<meta content="React Turnstile Demo." name="description" />
				<link href="/favicon.ico" rel="icon" />
			</Head>

			<Demo />
		</div>
	)
}

export default Home

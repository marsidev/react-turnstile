import type { NextPage } from 'next'
import Head from 'next/head'
import Demo from '../components/Demo'

const Home: NextPage = () => {
	return (
		<div className='bg-[#1d1f20]'>
			<Head>
				<title>React Turnstile Demo</title>
				<meta content='React Turnstile Demo.' name='description' />
				<link href='/favicon.ico' rel='icon' />
			</Head>

			<Demo />
		</div>
	)
}

export default Home

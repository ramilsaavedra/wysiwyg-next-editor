import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Provider from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'WYSIWYG NextJS Editor',
	description: 'A rich text editor for your nextJS app using lexical framework',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Provider>{children}</Provider>
			</body>
		</html>
	)
}

import './globals.css'
import { Inter } from 'next/font/google'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'İETT Otobüs Takip',
	description: 'İETT Otobüs Takip Uygulaması'
}

export default function RootLayout({ children }) {
	return (
		<html lang="tr">
			<body className={inter.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}

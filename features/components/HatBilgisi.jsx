import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { useHatBilgisi } from '@/features/queries/useTransportQueries'
import { ErrorWithRetry } from './ErrorWithRetry'

export function HatBilgisi({ hatKodu }) {
	const {
		data: hatBilgisi,
		isLoading,
		error,
		refetch
	} = useHatBilgisi(hatKodu)

	if (isLoading) {
		return (
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (error) {
		return <ErrorWithRetry error={error} onRetry={refetch} />
	}

	if (!hatBilgisi?.hat?.[0]) return null

	return (
		<Card>
			<CardHeader>
				<CardTitle>Hat Bilgileri</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<p>
						<strong>Hat Kodu:</strong> {hatBilgisi.hat[0].SHATKODU}
					</p>
					<p>
						<strong>Hat Adı:</strong> {hatBilgisi.hat[0].SHATADI}
					</p>
					<p>
						<strong>Hat Türü:</strong> {hatBilgisi.hat[0].TARIFE}
					</p>
					<p>
						<strong>Hat Uzunluğu:</strong>{' '}
						{hatBilgisi.hat[0].HAT_UZUNLUGU.toFixed(2)} km
					</p>
					<p>
						<strong>Sefer Süresi:</strong>{' '}
						{Math.floor(hatBilgisi.hat[0].SEFER_SURESI)} dakika
					</p>
				</div>
			</CardContent>
		</Card>
	)
}

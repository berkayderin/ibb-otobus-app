import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { useSeferBilgisi } from '@/features/queries/useTransportQueries'
import { ErrorWithRetry } from './ErrorWithRetry'
import { ScrollArea } from '@/components/ui/scroll-area'

export function SeferBilgisi({ hatKodu }) {
	const {
		data: seferBilgisi,
		isLoading,
		error,
		refetch
	} = useSeferBilgisi(hatKodu)

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="flex-none">
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-6 w-6" />
					<span>Sefer Bilgileri</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 min-h-0">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					</div>
				) : error ? (
					<ErrorWithRetry error={error} onRetry={refetch} />
				) : seferBilgisi?.hat ? (
					<ScrollArea className="h-full">
						<div className="space-y-4 pr-4">
							{seferBilgisi.hat.map((hat, index) => (
								<div key={index} className="p-4 border rounded-lg">
									<div className="grid grid-cols-2 gap-4">
										<div>
											<p className="font-semibold mb-1">Hat Kodu</p>
											<p className="text-sm">{hat.SHATKODU || '-'}</p>
										</div>
										<div>
											<p className="font-semibold mb-1">Hat Adı</p>
											<p className="text-sm">{hat.SHATADI || '-'}</p>
										</div>
										<div>
											<p className="font-semibold mb-1">
												Sefer Süresi
											</p>
											<p className="text-sm">
												{hat.SEFER_SURESI
													? `${Math.floor(hat.SEFER_SURESI)} dk`
													: '-'}
											</p>
										</div>
										<div>
											<p className="font-semibold mb-1">
												Hat Uzunluğu
											</p>
											<p className="text-sm">
												{hat.HAT_UZUNLUGU
													? `${hat.HAT_UZUNLUGU.toFixed(2)} km`
													: '-'}
											</p>
										</div>
										<div>
											<p className="font-semibold mb-1">Tarife</p>
											<p className="text-sm">{hat.TARIFE || '-'}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				) : (
					<div className="flex items-center justify-center h-full text-gray-500">
						Sefer bilgisi bulunamadı
					</div>
				)}
			</CardContent>
		</Card>
	)
}

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { useSeferBilgisi } from '@/features/queries/useTransportQueries'

export function SeferBilgisi({ hatKodu }) {
	const {
		data: seferBilgisi,
		isLoading,
		error
	} = useSeferBilgisi(hatKodu)

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-6 w-6" />
					<span>Sefer Bilgileri</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center p-4">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					</div>
				) : error ? (
					<div className="p-4 text-destructive">{error.message}</div>
				) : seferBilgisi ? (
					<div className="space-y-4">
						{seferBilgisi.map((sefer, index) => (
							<div key={index} className="p-4 border rounded-lg">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<p className="font-semibold mb-1">Çalışma Günü</p>
										<p className="text-sm">
											{sefer.CALISMA_GUNU || '-'}
										</p>
									</div>
									<div>
										<p className="font-semibold mb-1">İlk Sefer</p>
										<p className="text-sm">
											{sefer.ILK_SEFER || '-'}
										</p>
									</div>
									<div>
										<p className="font-semibold mb-1">Son Sefer</p>
										<p className="text-sm">
											{sefer.SON_SEFER || '-'}
										</p>
									</div>
									<div>
										<p className="font-semibold mb-1">
											Sefer Aralığı
										</p>
										<p className="text-sm">
											{sefer.SEFER_ARALIGI || '-'} dk
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="p-4 text-center text-gray-500">
						Sefer bilgisi bulunamadı
					</div>
				)}
			</CardContent>
		</Card>
	)
}

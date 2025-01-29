import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Truck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFiloBilgisi } from '@/features/queries/useTransportQueries'
import { useState } from 'react'
import { ErrorWithRetry } from './ErrorWithRetry'

export function FiloAraclari() {
	const [filoArama, setFiloArama] = useState('')
	const {
		data: filoBilgisi,
		isLoading,
		error,
		refetch
	} = useFiloBilgisi()

	const filtreliFilo =
		filoBilgisi?.features?.filter(
			(arac) =>
				arac.properties.Plaka?.toLowerCase().includes(
					filoArama.toLowerCase()
				) ||
				arac.properties.KapiNo?.toLowerCase().includes(
					filoArama.toLowerCase()
				) ||
				arac.properties.Operator?.toLowerCase().includes(
					filoArama.toLowerCase()
				) ||
				arac.properties.Garaj?.toLowerCase().includes(
					filoArama.toLowerCase()
				)
		) || []

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Truck className="h-6 w-6" />
					<span>Filo Araçları</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center p-4">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					</div>
				) : error ? (
					<ErrorWithRetry error={error} onRetry={refetch} />
				) : filoBilgisi?.features ? (
					<div className="space-y-4">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Plaka, kapı no, garaj veya operatör ile ara..."
								value={filoArama}
								onChange={(e) => setFiloArama(e.target.value)}
								className="flex-1"
							/>
							<Button
								variant="outline"
								onClick={() => setFiloArama('')}
							>
								Temizle
							</Button>
						</div>
						<div className="max-h-[400px] overflow-y-auto space-y-2">
							{filtreliFilo.slice(0, 20).map((arac, index) => (
								<div
									key={index}
									className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-semibold text-lg">
												{arac.properties.Plaka ||
													'Plaka Belirtilmemiş'}
											</p>
											<p className="text-sm text-gray-600">
												{arac.properties.Operator ||
													'Operatör Belirtilmemiş'}
											</p>
											<p className="text-sm text-gray-500">
												Garaj:{' '}
												{arac.properties.Garaj || 'Belirtilmemiş'}
											</p>
										</div>
										<div className="text-right">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												{arac.properties.KapiNo ||
													'No: Belirtilmemiş'}
											</span>
										</div>
									</div>
									<div className="mt-2 text-sm text-gray-500">
										<p>
											Son Konum:{' '}
											{arac.geometry.coordinates[1].toFixed(4)},{' '}
											{arac.geometry.coordinates[0].toFixed(4)}
										</p>
										<p>
											Son Güncelleme:{' '}
											{arac.properties.Saat || 'Belirtilmemiş'}
										</p>
									</div>
								</div>
							))}
							{filtreliFilo.length > 20 && (
								<div className="text-center text-gray-500 py-2">
									ve {filtreliFilo.length - 20} araç daha...
								</div>
							)}
							{filtreliFilo.length === 0 && (
								<div className="text-center text-gray-500 py-4">
									Arama kriterlerine uygun araç bulunamadı
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="p-4 text-center text-gray-500">
						Filo bilgisi bulunamadı
					</div>
				)}
			</CardContent>
		</Card>
	)
}

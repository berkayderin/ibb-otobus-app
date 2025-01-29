import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDuraklar } from '@/features/queries/useTransportQueries'
import { useState } from 'react'

export function Duraklar() {
	const [durakArama, setDurakArama] = useState('')
	const { data: duraklar, isLoading, error } = useDuraklar()

	const filtreliDuraklar =
		duraklar?.features?.filter(
			(durak) =>
				durak.properties.SDURAKADI.toLowerCase().includes(
					durakArama.toLowerCase()
				) ||
				durak.properties.ILCEADI.toLowerCase().includes(
					durakArama.toLowerCase()
				)
		) || []

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<MapPin className="h-6 w-6" />
					<span>Duraklar</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="flex items-center justify-center p-4">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					</div>
				) : error ? (
					<div className="p-4 text-destructive">{error.message}</div>
				) : duraklar?.features ? (
					<div className="space-y-4">
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Durak adı veya ilçe ara..."
								value={durakArama}
								onChange={(e) => setDurakArama(e.target.value)}
								className="flex-1"
							/>
							<Button
								variant="outline"
								onClick={() => setDurakArama('')}
							>
								Temizle
							</Button>
						</div>
						<div className="max-h-[400px] overflow-y-auto space-y-2">
							{filtreliDuraklar.slice(0, 20).map((durak) => (
								<div
									key={durak.properties.SDURAKKODU}
									className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-semibold text-lg">
												{durak.properties.SDURAKADI}
											</p>
											<p className="text-sm text-gray-600">
												{durak.properties.ILCEADI}
											</p>
										</div>
										<div className="text-right">
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
												{durak.properties.FIZIKI}
											</span>
											{durak.properties.AKILLI !== 'YOK' && (
												<span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
													AKILLI DURAK
												</span>
											)}
										</div>
									</div>
									<div className="mt-2 text-sm text-gray-500">
										<p>Yön: {durak.properties.SYON}</p>
										<p>Durak Tipi: {durak.properties.DURAK_TIPI}</p>
										<p className="text-xs mt-1">
											Koordinatlar: {durak.geometry.coordinates[1]},{' '}
											{durak.geometry.coordinates[0]}
										</p>
									</div>
								</div>
							))}
							{filtreliDuraklar.length > 20 && (
								<div className="text-center text-gray-500 py-2">
									ve {filtreliDuraklar.length - 20} durak daha...
								</div>
							)}
							{filtreliDuraklar.length === 0 && (
								<div className="text-center text-gray-500 py-4">
									Arama kriterlerine uygun durak bulunamadı
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="p-4 text-center text-gray-500">
						Durak bulunamadı
					</div>
				)}
			</CardContent>
		</Card>
	)
}

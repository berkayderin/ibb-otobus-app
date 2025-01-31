import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Bell } from 'lucide-react'
import { useDuyurular } from '@/features/queries/useTransportQueries'
import { ErrorWithRetry } from './ErrorWithRetry'
import { ScrollArea } from '@/components/ui/scroll-area'

export function Duyurular() {
	const {
		data: duyurular,
		isLoading,
		error,
		refetch
	} = useDuyurular()

	return (
		<Card className="md:col-span-2 h-full flex flex-col">
			<CardHeader className="flex-none">
				<CardTitle className="flex items-center gap-2">
					<Bell className="h-6 w-6" />
					<span>Duyurular</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1 min-h-0">
				{isLoading ? (
					<div className="flex items-center justify-center h-full">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
					</div>
				) : error ? (
					<ErrorWithRetry error={error} onRetry={refetch} />
				) : duyurular?.length > 0 ? (
					<ScrollArea className="h-full">
						<div className="space-y-4 pr-4">
							{duyurular.slice(0, 10).map((duyuru, index) => (
								<div
									key={index}
									className="p-4 border rounded-lg bg-white shadow-sm"
								>
									<div className="flex items-center justify-between mb-2">
										<span className="font-bold text-lg">
											{duyuru.HATKODU}
										</span>
										<span className="text-sm text-gray-500">
											{duyuru.GUNCELLEME_SAATI}
										</span>
									</div>
									<p className="text-sm font-medium text-gray-700 mb-2">
										{duyuru.HAT}
									</p>
									<p className="text-sm text-gray-600">
										{duyuru.MESAJ}
									</p>
									<div className="mt-2">
										<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
											{duyuru.TIP}
										</span>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				) : (
					<div className="p-4 text-center text-gray-500">
						Duyuru bulunamadı
					</div>
				)}
			</CardContent>
		</Card>
	)
}

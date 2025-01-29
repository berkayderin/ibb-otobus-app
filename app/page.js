'use client'

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bus, RefreshCw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { HatBilgisi } from '@/features/components/HatBilgisi'
import { SeferBilgisi } from '@/features/components/SeferBilgisi'
import { Duraklar } from '@/features/components/Duraklar'
import { FiloAraclari } from '@/features/components/FiloAraclari'
import { Duyurular } from '@/features/components/Duyurular'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Home() {
	const queryClient = useQueryClient()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const { register, watch, setValue } = useForm({
		defaultValues: {
			hatKodu: ''
		}
	})

	const hatKodu = watch('hatKodu')

	const handleRefreshAll = async () => {
		setIsRefreshing(true)
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ['hatBilgisi'] }),
			queryClient.invalidateQueries({ queryKey: ['seferBilgisi'] }),
			queryClient.invalidateQueries({ queryKey: ['duraklar'] }),
			queryClient.invalidateQueries({ queryKey: ['duyurular'] }),
			queryClient.invalidateQueries({ queryKey: ['filoBilgisi'] })
		])
		setTimeout(() => setIsRefreshing(false), 1000)
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<main className="container mx-auto max-w-7xl">
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Bus className="h-6 w-6" />
								<span>İETT Otobüs Takip</span>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRefreshAll}
								className="gap-2"
								disabled={isRefreshing}
							>
								<RefreshCw
									className={cn('h-4 w-4', {
										'animate-spin': isRefreshing
									})}
								/>
								Tümünü Yenile
							</Button>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-2">
							<Input
								type="text"
								placeholder="Hat kodunu giriniz (örn: 34AS)"
								{...register('hatKodu', {
									onChange: (e) =>
										setValue('hatKodu', e.target.value.toUpperCase())
								})}
								className="flex-1"
							/>
						</div>
					</CardContent>
				</Card>

				{hatKodu && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<HatBilgisi hatKodu={hatKodu} />
						<SeferBilgisi hatKodu={hatKodu} />
					</div>
				)}

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					<Duraklar />
					<FiloAraclari />
					<Duyurular />
				</div>
			</main>
		</div>
	)
}

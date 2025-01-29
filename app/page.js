'use client'

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bus, RefreshCw, GithubIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
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
			queryClient.invalidateQueries({ queryKey: ['seferBilgisi'] }),
			queryClient.invalidateQueries({ queryKey: ['duraklar'] }),
			queryClient.invalidateQueries({ queryKey: ['duyurular'] }),
			queryClient.invalidateQueries({ queryKey: ['filoBilgisi'] })
		])
		setTimeout(() => setIsRefreshing(false), 1000)
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<main className="container mx-auto max-w-7xl flex flex-col h-[calc(100vh-2rem)]">
				<Card className="mb-4">
					<CardHeader>
						<CardTitle className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Bus className="h-6 w-6" />
								<span>İETT Otobüs Takip</span>
							</div>
							<div className="flex items-center gap-4">
								<a
									href="https://github.com/berkayderin"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
								>
									<GithubIcon className="h-4 w-4" />
									<span>@berkayderin</span>
								</a>
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
							</div>
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

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
					{hatKodu && (
						<div className="lg:col-span-2 h-[400px]">
							<SeferBilgisi hatKodu={hatKodu} />
						</div>
					)}
					<div className="h-[400px]">
						<Duraklar />
					</div>
					<div className="h-[400px]">
						<FiloAraclari />
					</div>
					<div className="lg:col-span-2 h-[400px]">
						<Duyurular />
					</div>
				</div>
			</main>
		</div>
	)
}

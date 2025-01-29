'use client'

import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Bus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { HatBilgisi } from '@/features/components/HatBilgisi'
import { SeferBilgisi } from '@/features/components/SeferBilgisi'
import { Duraklar } from '@/features/components/Duraklar'
import { FiloAraclari } from '@/features/components/FiloAraclari'
import { Duyurular } from '@/features/components/Duyurular'

export default function Home() {
	const { register, watch, setValue } = useForm({
		defaultValues: {
			hatKodu: ''
		}
	})

	const hatKodu = watch('hatKodu')

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<main className="container mx-auto max-w-7xl">
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bus className="h-6 w-6" />
							<span>İETT Otobüs Takip</span>
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

'use client'

import { useState, useEffect } from 'react'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Bus, MapPin, Bell, Clock, Truck } from 'lucide-react'

export default function Home() {
	const [hatKodu, setHatKodu] = useState('')
	const [hatBilgisi, setHatBilgisi] = useState(null)
	const [seferBilgisi, setSeferBilgisi] = useState(null)
	const [yukleniyor, setYukleniyor] = useState(false)
	const [seferYukleniyor, setSeferYukleniyor] = useState(false)
	const [hata, setHata] = useState(null)
	const [seferHata, setSeferHata] = useState(null)
	const [duraklar, setDuraklar] = useState([])
	const [duyurular, setDuyurular] = useState([])
	const [durakYukleniyor, setDurakYukleniyor] = useState(true)
	const [duyuruYukleniyor, setDuyuruYukleniyor] = useState(true)
	const [durakHata, setDurakHata] = useState(null)
	const [duyuruHata, setDuyuruHata] = useState(null)
	const [durakArama, setDurakArama] = useState('')
	const [filtreliDuraklar, setFiltreliDuraklar] = useState([])
	const [filoBilgisi, setFiloBilgisi] = useState(null)
	const [filoYukleniyor, setFiloYukleniyor] = useState(true)
	const [filoHata, setFiloHata] = useState(null)
	const [filoArama, setFiloArama] = useState('')
	const [filtreliFilo, setFiltreliFilo] = useState([])

	useEffect(() => {
		// Durakları getir
		setDurakYukleniyor(true)
		fetch('/api/duraklar')
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error)
				}
				setDuraklar(data.features || [])
				setDurakHata(null)
			})
			.catch((err) => {
				console.error('Duraklar yüklenirken hata:', err)
				setDurakHata('Duraklar yüklenirken bir hata oluştu')
			})
			.finally(() => setDurakYukleniyor(false))

		// Duyuruları getir
		setDuyuruYukleniyor(true)
		fetch('/api/duyurular')
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error)
				}
				setDuyurular(data || [])
				setDuyuruHata(null)
			})
			.catch((err) => {
				console.error('Duyurular yüklenirken hata:', err)
				setDuyuruHata('Duyurular yüklenirken bir hata oluştu')
			})
			.finally(() => setDuyuruYukleniyor(false))

		// Filo bilgilerini getir
		setFiloYukleniyor(true)
		fetch('/api/filo')
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					throw new Error(data.error)
				}
				setFiloBilgisi(data)
				setFiltreliFilo(data.features || [])
				setFiloHata(null)
			})
			.catch((err) => {
				console.error('Filo bilgileri yüklenirken hata:', err)
				setFiloHata('Filo bilgileri yüklenirken bir hata oluştu')
			})
			.finally(() => setFiloYukleniyor(false))
	}, [])

	useEffect(() => {
		// Durakları filtrele
		if (duraklar.features) {
			const filtrelenmis = duraklar.features.filter(
				(durak) =>
					durak.properties.SDURAKADI.toLowerCase().includes(
						durakArama.toLowerCase()
					) ||
					durak.properties.ILCEADI.toLowerCase().includes(
						durakArama.toLowerCase()
					)
			)
			setFiltreliDuraklar(filtrelenmis)
		}

		// Filo araçlarını filtrele
		if (filoBilgisi?.features) {
			const filtrelenmis = filoBilgisi.features.filter(
				(arac) =>
					arac.properties.Plaka?.toLowerCase().includes(
						filoArama.toLowerCase()
					) ||
					'' ||
					arac.properties.KapiNo?.toLowerCase().includes(
						filoArama.toLowerCase()
					) ||
					'' ||
					arac.properties.Operator?.toLowerCase().includes(
						filoArama.toLowerCase()
					) ||
					'' ||
					arac.properties.Garaj?.toLowerCase().includes(
						filoArama.toLowerCase()
					) ||
					''
			)
			setFiltreliFilo(filtrelenmis)
		}
	}, [durakArama, duraklar, filoArama, filoBilgisi])

	const seferBilgisiGetir = async (kod) => {
		if (!kod) return

		setSeferYukleniyor(true)
		setSeferHata(null)

		try {
			const response = await fetch(`/api/seferler?HatKodu=${kod}`)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Sefer bilgisi alınamadı')
			}

			setSeferBilgisi(data)
		} catch (error) {
			setSeferHata(error.message)
		} finally {
			setSeferYukleniyor(false)
		}
	}

	const hatBilgisiGetir = async () => {
		if (!hatKodu) return

		setYukleniyor(true)
		setHata(null)

		try {
			const response = await fetch(
				`/api/hat-bilgisi?hatKodu=${hatKodu}`
			)
			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Bir hata oluştu')
			}

			setHatBilgisi(data)
			await seferBilgisiGetir(hatKodu)
		} catch (error) {
			setHata(error.message)
		} finally {
			setYukleniyor(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-100 p-4">
			<main className="container mx-auto max-w-3xl">
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
								value={hatKodu}
								onChange={(e) =>
									setHatKodu(e.target.value.toUpperCase())
								}
								className="flex-1"
							/>
							<Button
								onClick={hatBilgisiGetir}
								disabled={yukleniyor || !hatKodu}
							>
								<Search className="mr-2 h-4 w-4" />
								Ara
							</Button>
						</div>
					</CardContent>
				</Card>

				{yukleniyor && (
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-center">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
							</div>
						</CardContent>
					</Card>
				)}

				{hata && (
					<Card className="border-destructive">
						<CardContent className="p-4 text-destructive">
							{hata}
						</CardContent>
					</Card>
				)}

				{hatBilgisi &&
					!yukleniyor &&
					hatBilgisi.hat &&
					hatBilgisi.hat[0] && (
						<>
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Hat Bilgileri</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<p>
											<strong>Hat Kodu:</strong>{' '}
											{hatBilgisi.hat[0].SHATKODU}
										</p>
										<p>
											<strong>Hat Adı:</strong>{' '}
											{hatBilgisi.hat[0].SHATADI}
										</p>
										<p>
											<strong>Hat Türü:</strong>{' '}
											{hatBilgisi.hat[0].TARIFE}
										</p>
										<p>
											<strong>Hat Uzunluğu:</strong>{' '}
											{hatBilgisi.hat[0].HAT_UZUNLUGU.toFixed(2)} km
										</p>
										<p>
											<strong>Sefer Süresi:</strong>{' '}
											{Math.floor(hatBilgisi.hat[0].SEFER_SURESI)}{' '}
											dakika
										</p>
									</div>
								</CardContent>
							</Card>

							{/* Sefer Bilgileri */}
							<Card className="mb-6">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Clock className="h-6 w-6" />
										<span>Sefer Bilgileri</span>
									</CardTitle>
								</CardHeader>
								<CardContent>
									{seferYukleniyor ? (
										<div className="flex items-center justify-center p-4">
											<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
										</div>
									) : seferHata ? (
										<div className="p-4 text-destructive">
											{seferHata}
										</div>
									) : seferBilgisi ? (
										<div className="space-y-4">
											{seferBilgisi.map((sefer, index) => (
												<div
													key={index}
													className="p-4 border rounded-lg"
												>
													<div className="grid grid-cols-2 gap-4">
														<div>
															<p className="font-semibold mb-1">
																Çalışma Günü
															</p>
															<p className="text-sm">
																{sefer.CALISMA_GUNU || '-'}
															</p>
														</div>
														<div>
															<p className="font-semibold mb-1">
																İlk Sefer
															</p>
															<p className="text-sm">
																{sefer.ILK_SEFER || '-'}
															</p>
														</div>
														<div>
															<p className="font-semibold mb-1">
																Son Sefer
															</p>
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
						</>
					)}

				{/* Duraklar */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MapPin className="h-6 w-6" />
							<span>Duraklar</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{durakYukleniyor ? (
							<div className="flex items-center justify-center p-4">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
							</div>
						) : durakHata ? (
							<div className="p-4 text-destructive">{durakHata}</div>
						) : duraklar.features ? (
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
												<p>
													Durak Tipi: {durak.properties.DURAK_TIPI}
												</p>
												<p className="text-xs mt-1">
													Koordinatlar:{' '}
													{durak.geometry.coordinates[1]},{' '}
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

				{/* Filo Bilgileri */}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Truck className="h-6 w-6" />
							<span>Filo Araçları</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{filoYukleniyor ? (
							<div className="flex items-center justify-center p-4">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
							</div>
						) : filoHata ? (
							<div className="p-4 text-destructive">{filoHata}</div>
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

				{/* Duyurular */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Bell className="h-6 w-6" />
							<span>Duyurular</span>
						</CardTitle>
					</CardHeader>
					<CardContent>
						{duyuruYukleniyor ? (
							<div className="flex items-center justify-center p-4">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
							</div>
						) : duyuruHata ? (
							<div className="p-4 text-destructive">{duyuruHata}</div>
						) : duyurular.length > 0 ? (
							<div className="max-h-[500px] overflow-y-auto space-y-4">
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
						) : (
							<div className="p-4 text-center text-gray-500">
								Duyuru bulunamadı
							</div>
						)}
					</CardContent>
				</Card>
			</main>
		</div>
	)
}

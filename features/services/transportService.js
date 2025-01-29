export const getHatBilgisi = async (hatKodu) => {
	const response = await fetch(`/api/hat-bilgisi?hatKodu=${hatKodu}`)
	if (!response.ok) {
		throw new Error('Hat bilgisi alınamadı')
	}
	return response.json()
}

export const getSeferBilgisi = async (hatKodu) => {
	const response = await fetch(`/api/seferler?HatKodu=${hatKodu}`)
	if (!response.ok) {
		throw new Error('Sefer bilgisi alınamadı')
	}
	return response.json()
}

export const getDuraklar = async () => {
	const response = await fetch('/api/duraklar')
	if (!response.ok) {
		throw new Error('Duraklar alınamadı')
	}
	return response.json()
}

export const getDuyurular = async () => {
	const response = await fetch('/api/duyurular')
	if (!response.ok) {
		throw new Error('Duyurular alınamadı')
	}
	return response.json()
}

export const getFiloBilgisi = async () => {
	const response = await fetch('/api/filo')
	if (!response.ok) {
		throw new Error('Filo bilgisi alınamadı')
	}
	return response.json()
}

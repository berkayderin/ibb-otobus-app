import * as soap from 'soap'

const url =
	'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl'

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url)
		const hatKodu = searchParams.get('HatKodu')

		if (!hatKodu) {
			return Response.json(
				{ error: 'Hat kodu gerekli' },
				{ status: 400 }
			)
		}

		const client = await soap.createClientAsync(url)

		console.log('Mevcut SOAP metodları:', client.describe())

		try {
			const [result] = await client.GetHat_jsonAsync({
				HatKodu: hatKodu
			})

			console.log('SOAP yanıtı:', result)

			if (!result || !result.GetHat_jsonResult) {
				return Response.json(
					{ error: 'Sefer bilgisi bulunamadı' },
					{ status: 404 }
				)
			}

			try {
				const hatlar = JSON.parse(result.GetHat_jsonResult)

				// API yanıtını kontrol edelim
				if (!Array.isArray(hatlar) || hatlar.length === 0) {
					return Response.json(
						{ error: 'Bu hat koduna ait bilgi bulunamadı' },
						{ status: 404 }
					)
				}

				return Response.json({ hat: hatlar })
			} catch (parseError) {
				console.error('JSON parse hatası:', parseError)
				return Response.json(
					{
						error: 'Veri formatında hata',
						details: parseError.message
					},
					{ status: 500 }
				)
			}
		} catch (soapError) {
			console.error('SOAP işlem hatası detayı:', soapError)
			return Response.json(
				{
					error: 'Sefer bilgisi alınamadı',
					details: soapError.message || 'Bilinmeyen SOAP hatası'
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error('Genel hata detayı:', error)
		return Response.json(
			{
				error: 'Bir hata oluştu',
				details: error.message || 'Bilinmeyen hata'
			},
			{ status: 500 }
		)
	}
}

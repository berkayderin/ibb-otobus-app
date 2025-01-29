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

		// Debug için mevcut metodları konsola yazdıralım
		console.log('Mevcut SOAP metodları:', client.describe())

		client.setSecurity(
			new soap.BasicAuthSecurity(
				process.env.IBB_API_USERNAME,
				process.env.IBB_API_PASSWORD
			)
		)

		try {
			// Önce metodun varlığını kontrol edelim
			if (!client.GetHatCalismaGunAsync) {
				console.error('GetHatCalismaGunAsync metodu bulunamadı')
				console.log('Mevcut metodlar:', Object.keys(client))
				return Response.json(
					{ error: 'API metodu bulunamadı' },
					{ status: 500 }
				)
			}

			const [result] = await client.GetHatCalismaGunAsync({
				hatKodu: hatKodu // parametre ismini küçük harfle deneyelim
			})

			console.log('SOAP yanıtı:', result) // Debug için yanıtı görelim

			if (!result || !result.GetHatCalismaGun_jsonResult) {
				return Response.json(
					{ error: 'Sefer bilgisi bulunamadı' },
					{ status: 404 }
				)
			}

			const seferler = JSON.parse(result.GetHatCalismaGun_jsonResult)
			return Response.json(seferler)
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

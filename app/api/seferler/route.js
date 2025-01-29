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

		return new Promise((resolve, reject) => {
			soap.createClient(url, (err, client) => {
				if (err) {
					console.error('SOAP client oluşturma hatası:', err)
					return resolve(
						Response.json(
							{ error: 'Servis bağlantısında hata oluştu' },
							{ status: 500 }
						)
					)
				}

				client.setSecurity(
					new soap.BasicAuthSecurity(
						process.env.IBB_API_USERNAME,
						process.env.IBB_API_PASSWORD
					)
				)

				const args = { HatKodu: hatKodu }
				client.GetHatCalismaGun(args, (err, result) => {
					if (err) {
						console.error('Sefer bilgisi alma hatası:', err)
						return resolve(
							Response.json(
								{ error: 'Sefer bilgisi alınamadı' },
								{ status: 500 }
							)
						)
					}

					try {
						const seferler = JSON.parse(
							result.GetHatCalismaGun_jsonResult
						)
						resolve(Response.json(seferler))
					} catch (parseError) {
						console.error('JSON parse hatası:', parseError)
						resolve(
							Response.json(
								{ error: 'Veri işlenirken hata oluştu' },
								{ status: 500 }
							)
						)
					}
				})
			})
		})
	} catch (error) {
		console.error('Genel hata:', error)
		return Response.json(
			{ error: 'Bir hata oluştu' },
			{ status: 500 }
		)
	}
}

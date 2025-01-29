import * as soap from 'soap'

const url =
	'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx?wsdl'

export async function GET() {
	try {
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

				const args = { DurakKodu: '' }
				client.GetDurak_json(args, (err, result) => {
					if (err) {
						console.error('Durak bilgisi alma hatası:', err)
						return resolve(
							Response.json(
								{ error: 'Durak bilgisi alınamadı' },
								{ status: 500 }
							)
						)
					}

					try {
						const duraklar = JSON.parse(result.GetDurak_jsonResult)
						const geojson = {
							type: 'FeatureCollection',
							features: duraklar.map((e) => ({
								type: 'Feature',
								properties: {
									SDURAKKODU: e.SDURAKKODU,
									SDURAKADI: e.SDURAKADI,
									ILCEADI: e.ILCEADI,
									SYON: e.SYON,
									AKILLI: e.AKILLI,
									FIZIKI: e.FIZIKI,
									DURAK_TIPI: e.DURAK_TIPI
								},
								geometry: {
									type: 'Point',
									coordinates: JSON.parse(
										e.KOORDINAT.replace('POINT ', '')
											.replace(' ', ',')
											.replace('(', '[')
											.replace(')', ']')
									)
								}
							}))
						}
						resolve(Response.json(geojson))
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

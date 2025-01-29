import * as soap from 'soap'

const url =
	'https://api.ibb.gov.tr/iett/FiloDurum/SeferGerceklesme.asmx?wsdl'

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

				client.GetFiloAracKonum_json({}, (err, result) => {
					if (err) {
						console.error('Filo bilgisi alma hatası:', err)
						return resolve(
							Response.json(
								{ error: 'Filo bilgisi alınamadı' },
								{ status: 500 }
							)
						)
					}

					try {
						const filoData = JSON.parse(
							result.GetFiloAracKonum_jsonResult
						)
						const geojson = {
							type: 'FeatureCollection',
							features: filoData.map((e) => {
								const enlem = parseFloat(e.Enlem.replace(' ', ''))
								const boylam = parseFloat(e.Boylam.replace(' ', ''))

								return {
									type: 'Feature',
									properties: {
										Operator: e.Operator,
										Garaj: e.Garaj,
										KapiNo: e.KapiNo,
										Saat: e.Saat,
										Boylam: e.Boylam,
										Enlem: e.Enlem,
										hiz: e.hiz,
										Plaka: e.Plaka
									},
									geometry: {
										type: 'Point',
										coordinates: [boylam, enlem]
									}
								}
							})
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

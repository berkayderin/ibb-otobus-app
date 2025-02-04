import * as soap from 'soap'

const url =
	'https://api.ibb.gov.tr/iett/UlasimDinamikVeri/Duyurular.asmx?wsdl'

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

				// client.setSecurity(
				// 	new soap.BasicAuthSecurity(
				// 		process.env.IBB_API_USERNAME,
				// 		process.env.IBB_API_PASSWORD
				// 	)
				// )

				client.GetDuyurular_json({}, (err, result) => {
					if (err) {
						console.error('Duyuru bilgisi alma hatası:', err)
						return resolve(
							Response.json(
								{ error: 'Duyuru bilgisi alınamadı' },
								{ status: 500 }
							)
						)
					}

					try {
						const duyurular = JSON.parse(
							result.GetDuyurular_jsonResult
						)
						resolve(Response.json(duyurular))
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

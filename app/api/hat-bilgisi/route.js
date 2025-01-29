const BASE_URL =
	'https://api.ibb.gov.tr/iett/UlasimAnaVeri/HatDurakGuzergah.asmx'

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url)
		const hatKodu = searchParams.get('hatKodu')

		if (!hatKodu) {
			return new Response(
				JSON.stringify({ error: 'Hat kodu gerekli' }),
				{
					status: 400,
					headers: { 'Content-Type': 'application/json' }
				}
			)
		}

		const hatSoapBody = `<?xml version="1.0" encoding="utf-8"?>
			<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
				<soapenv:Header>
					<tem:AuthHeader>
						<tem:Username>${process.env.IBB_API_USERNAME}</tem:Username>
						<tem:Password>${process.env.IBB_API_PASSWORD}</tem:Password>
					</tem:AuthHeader>
				</soapenv:Header>
				<soapenv:Body>
					<tem:GetHat_json>
						<tem:HatKodu>${hatKodu}</tem:HatKodu>
					</tem:GetHat_json>
				</soapenv:Body>
			</soapenv:Envelope>`

		const hatResponse = await fetch(BASE_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'text/xml;charset=UTF-8',
				SOAPAction: 'http://tempuri.org/GetHat_json'
			},
			body: hatSoapBody
		})

		if (!hatResponse.ok) {
			throw new Error(`API yanıt kodu: ${hatResponse.status}`)
		}

		const hatText = await hatResponse.text()

		const hatJsonMatch = hatText.match(
			/<GetHat_jsonResult>(.*?)<\/GetHat_jsonResult>/s
		)

		if (!hatJsonMatch) {
			throw new Error('API yanıtı beklenmeyen formatta')
		}

		const hatBilgisi = JSON.parse(hatJsonMatch[1])

		return new Response(
			JSON.stringify({
				hat: hatBilgisi
			}),
			{
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			}
		)
	} catch (error) {
		console.error('API Hatası:', error)
		return new Response(
			JSON.stringify({
				error: 'Sunucu hatası',
				details: error.message,
				stack:
					process.env.NODE_ENV === 'development'
						? error.stack
						: undefined
			}),
			{
				status: 500,
				headers: { 'Content-Type': 'application/json' }
			}
		)
	}
}

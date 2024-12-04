export default defineEventHandler(async (event) => {
	try {
		const searchResponse = await fetch("https://api.musicapi.com/public/search", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": `Token ${process.env.CLIENT_ID}`
			},
			body: JSON.stringify({
				type: "track",
				track: "宇宙の季節",
				sources: ["spotify"]
			}),
			redirect: "follow"
		})
		
		let searchData = await searchResponse.json()
		searchData = searchData.tracks[0].data
		const trackUrl = searchData.url
		
		const track = await fetch("https://api.musicapi.com/public/embed/url", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": `Token ${process.env.CLIENT_ID}`
			},
			body: JSON.stringify({
				url: trackUrl
			})
		})

		const trackData = await track.json()
		// console.log(trackData)

		return trackData
	} catch (error) {
		return error
	}
})


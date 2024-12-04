export default defineEventHandler(async (event) => {
  const body = await readBody(event)
	console.log(body)
  const { song_name, artist_name } = body
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
				track: song_name,
				artist: artist_name,
				sources: ["spotify"]
			}),
			redirect: "follow"
		})
		
		let searchData = await searchResponse.json()
		searchData = searchData.tracks[0].data
		
		// const track = await fetch("https://api.musicapi.com/public/embed/url", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		"Accept": "application/json",
		// 		"Authorization": `Token ${process.env.CLIENT_ID}`
		// 	},
		// 	body: JSON.stringify({
		// 		url: trackUrl
		// 	})
		// })
		//
		// const trackData = await track.json()

		return searchData
	} catch (error) {
		return error
	}
})


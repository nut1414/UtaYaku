<template>
	<div class="flex items-center flex-col justify-center h-full w-full gap-5">
		<div class="max-w-3xl flex items-center flex-col justify-center h-full w-full gap-5 py-[8rem]">
			<div class="flex gap-3 items-baseline border-white border-b">
				<h1 class="text-5xl text-yellow-100">{{song_name}}</h1>
				<h1 class="text-xl text-orange-200">({{artist_name}})</h1>
			</div>
			<div class="flex flex-col text-[#F5F5F5] text-2xl overflow-y-auto gap-3 w-full">
				<p v-for="(lyric_line, i) in lyrics" :key="i">
					{{ lyric_line }}	
				</p>
			</div>
			<div class="w-full">
				<div id="embed-iframe"></div>
			</div>
			<h1>Current playback: {{ playbackTime }}</h1>
		</div>
	</div>
</template>

<script setup lang="ts">
const lyrics = ref([])
const playbackTime = ref(0)

const song_name = "Insomnia"
const artist_name = "Eve"


const fetchMusicData = async () => {
	const embeddingResponse = await fetch("/api/musicapi", {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ song_name, artist_name })
	})
	const embeddingResponseData = await embeddingResponse.json()
	const trackUrl = embeddingResponseData.url

	const lyricsResponse = await fetch(`https://lrclib.net/api/search?track_name=${song_name}&artist_name=${artist_name}`)

	if (!lyricsResponse.ok) {
		lyrics.value = [`No song with name ${song_name} and artist ${artist_name} could be found.`]
		throw new Error(`No song with name ${song_name} and artist ${artist_name} was found.`)
	}

	const lyricsData = await lyricsResponse.json()
	if (lyricsData.length === 0) {
		lyrics.value = [`No song with name ${song_name} and artist ${artist_name} could be found.`]
	}

	const most_related = lyricsData[0]
	lyrics.value = most_related.plainLyrics.split("\n")

	try {
		initializeSpotifyEmbed(trackUrl)
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message)
		} else{
			console.error("Unknown error: ", error)
		}
	}

	console.log(most_related.syncedLyrics)
}

interface IFrameAPIType {
	createController: (
		element: HTMLElement,
		options: { uri: string; width: string; height: number },
		callback: (EmbedController: EmbedControllerType) => void
	) => void
}

interface EmbedControllerType {
    addListener: (event: string, callback: (state: PlaybackState) => void) => void;
}

interface PlaybackState {
    data: { position: number };
}

const initializeSpotifyEmbed = (trackUrl: string) => {
	window.onSpotifyIframeApiReady = (IframeAPI: IFrameAPIType) => {
		const element = document.getElementById("embed-iframe")
		if (!element) {
			console.error("Embed iframe element not found.")
			return
		}
		const options = {
			uri: trackUrl,
			width: "100%",
			height: 152
		}
		const callback = (EmbedController: EmbedControllerType) => {
			EmbedController.addListener("playback_update", (state) => {
				console.log(state)
				playbackTime.value = state.data.position
			})
		}
		IframeAPI.createController(element, options, callback)
	}
}

onMounted(() => {
	fetchMusicData()
})

</script>


<template>
	<div class="flex items-center flex-col justify-center h-full w-full gap-5">
		<div class="max-w-3xl flex items-center flex-col justify-center h-full w-full gap-5 py-[8rem]">
			<div class="flex gap-3 items-baseline border-white border-b">
				<h1 class="text-5xl text-yellow-100">{{song_name}}</h1>
				<h1 class="text-xl text-orange-200">({{artist_name}})</h1>
			</div>
			<div class="flex flex-col text-[#F5F5F5bb] text-2xl overflow-y-auto gap-3 w-full">
				<p
					v-for="(lyric_line, i) in lyrics"
					:class="{ 'text-yellow-100 font-bold': isCurLyric(lyricsIndices[i]) }"
					:id="lyricsIndices[i]"
					:key="i"
				>
					{{ lyric_line }}
				</p>
			</div>
			<div class="w-full">
				<div id="embed-iframe"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const lyrics = ref([])
const lyricsIndices = ref([])
const timestamps = ref([]) // in pairs format [start, end]
const playbackTime = ref(0)

const { getBreakDown, history } = useBreakDown()

const song_name = "Insomnia"
const artist_name = "Eve"

function timestampToMS(timestamp: string){
	const [minutes, seconds, milliseconds] = timestamp.slice(1, -1).split(/[:.]/).map(Number)
	const ans = (minutes! * 60 * 1000) + (seconds! * 1000) + milliseconds! * 10
	return ans - 500 // let the lyrics display a little earlier
}

const filterTimestamps = (rawSynced: Array<string>) => {
	const matches = rawSynced.map(line => line.match(/\[\d{2}:\d{2}\.\d{2}\]/)![0]).map(timestamp => timestampToMS(timestamp))
	const l = matches.length
	let timeStampPairs = new Array<Array<number>>
	for (let i = 0; i < l - 1; i++){
		timeStampPairs.push([matches[i]!, matches[i + 1]!])
	}
	timeStampPairs.push([matches[l - 1]!, matches[l - 1]! + 5])
	return timeStampPairs
}

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
		throw new Error(`No song with name ${song_name} and artist ${artist_name} could be found.`)
	}

	const lyricsData = await lyricsResponse.json()
	if (lyricsData.length === 0) {
		lyrics.value = [`No song with name ${song_name} and artist ${artist_name} could be found.`]
	}

	const most_related = lyricsData[0]
	const rawLyrics = most_related.plainLyrics.split("\n")
	const rawSynced = most_related.syncedLyrics.split("\n").slice(0, -1)
	const l = rawLyrics.length
	let indices = new Array<number>
	let j = 0
	for (let i = 0; i < l; i++){
		if (rawLyrics[i] !== ""){
			indices.push(j)
			j++
		} else {
			indices.push(-1)
		}
	}

	lyrics.value = rawLyrics
	lyricsIndices.value = indices
	timestamps.value = filterTimestamps(rawSynced)

	try {
		initializeSpotifyEmbed(trackUrl)
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message)
		} else{
			console.error("Unknown error: ", error)
		}
	}
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
				playbackTime.value = state.data.position
			})
		}
		IframeAPI.createController(element, options, callback)
	}
}

const isCurLyric = (i: number) => {
	if (i !== -1 && playbackTime.value >= timestamps.value[i][0] && playbackTime.value <= timestamps.value[i][1]){
		document.getElementById(`${i}`)!.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'center'
		})
		return true
	} else {
		return false
	}
}

const test = async (message: string) => {
	const result = await getBreakDown(message)
	let content = await result.content
	content = content.replace(/\n\s+/g, "")
	console.log(content)
	console.log(JSON.parse(content))
}

onMounted(() => {
	fetchMusicData()
	test("今日天気はいいですか?")
})
</script>


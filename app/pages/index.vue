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
			<h1>{{ embedUrl }}</h1>
			<div class="w-full">
				<div v-html="embedCode"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const lyrics = ref([])
const embedCode = ref("")

const song_name = "Insomnia"
const artist_name = "Eve"

const fetchMusicData = async () => {
	// const res = await fetch("/api/musicapi")
	const embeddingResponse = await fetch("/api/musicapi")
	const embeddingResponseData = await embeddingResponse.json()
	embedCode.value = embeddingResponseData.embedCode

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

	console.log(most_related.syncedLyrics)
}

onMounted(() => {
	fetchMusicData()
})

</script>


<template>
	<div class="flex items-center flex-col justify-center h-full w-full gap-5 py-[8rem]">
		<div class="flex gap-3 items-baseline border-white border-b">
			<h1 class="text-5xl text-yellow-100">Insomnia</h1>
			<h1 class="text-xl text-orange-200">Eve</h1>
		</div>
		<div class="flex flex-col text-[#F5F5F5] text-2xl overflow-y-auto gap-3">
			<p v-for="(lyric_line, i) in lyrics" :key="i">
				{{ lyric_line }}	
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
const lyrics = ref([])

const song_name = "Insomnia"
const artist_name = "Eve"

const fetchMusicData = async () => {
	// const res = await fetch("/api/musicapi")
	const searchResponse = await fetch("https://api.musicapi.com/public/search", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Authorization": "Token 2cf82db3-4064-4235-8253-16994eb51773"
		},
		body: {
			type: "track",
			track: "宇宙の季節",
			sources: ["spotify"]
		}
	})
	
	const searchData = await searchResponse.json()
	console.log(searchData)

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
}

onMounted(() => {
	fetchMusicData()
})

</script>


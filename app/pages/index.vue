<template>
	<div class="flex items-center flex-col justify-center h-full w-full gap-5 py-[8rem]">
		<div class="flex gap-3 items-baseline border-white border-b">
			<h1 class="text-5xl text-yellow-100">Insomnia</h1>
			<h1 class="text-xl text-orange-200">Eve</h1>
		</div>
		<div class="flex flex-col text-[#F5F5F5] text-4xl overflow-y-auto gap-3">
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

const fetchLyrics = async () => {
  const response = await fetch(`https://lrclib.net/api/search?track_name=${song_name}&artist_name=${artist_name}`)

  if (!response.ok) {
    lyrics.value = [`No song with name ${song_name} and artist ${artist_name} could be found.`]
    throw new Error(`No song with name ${song_name} and artist ${artist_name} was found.`)
  }

  const data = await response.json()
  if (data.length === 0) {
    lyrics.value = [`No song with name ${song_name} and artist ${artist_name} could be found.`]
  }

  const most_related = data[0]
  lyrics.value = most_related.plainLyrics.split("\n")
}

onMounted(() => {
	fetchLyrics()
})
</script>


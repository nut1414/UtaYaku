export default defineEventHandler(async (event) => {
	const { musicId } = await readBody(event)

	console.log(musicId)

	try {
		const db = useDatabase("breakdowns")

		await db.sql`
			CREATE TABLE IF NOT EXISTS Song (
			song_id TEXT PRIMARY KEY
		)`

		await db.sql`
			CREATE TABLE IF NOT EXISTS Breakdowns (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			song_id INTEGER NOT NULL,
			json_data TEXT NOT NULL,
			FOREIGN KEY (song_id) REFERENCES Song(song_id)
		)`

		const exists = await db.sql`
			SELECT COUNT(*)
			FROM Song
			WHERE song_id = ${musicId}
		`

		const count = exists.rows![0]["COUNT(*)"]
		if (count === 1){
			return { result: true }
		} else {
			return { result: false }
		}

	} catch (error) {
		console.error(error)
		return { message: "Add breakdown operation failed" }
	}
})


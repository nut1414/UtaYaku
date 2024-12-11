export default defineEventHandler(async (event) => {
	const { musicId } = await readBody(event)

	try {
		const db = useDatabase("breakdowns")

		// await db.sql`
		// 	CREATE TABLE IF NOT EXISTS Song (
		// 	song_id TEXT PRIMARY KEY
		// )`
		//
		// await db.sql`
		// 	CREATE TABLE IF NOT EXISTS Breakdowns (
		// 	id INTEGER PRIMARY KEY AUTOINCREMENT,
		// 	song_id INTEGER NOT NULL,
		// 	json_data TEXT NOT NULL,
		// 	FOREIGN KEY (song_id) REFERENCES Song(song_id)
		// )`

		const breakdowns = await db.sql`
			SELECT json_data
			FROM Breakdowns
			WHERE song_id = ${musicId}
		`

		return { breakdowns: breakdowns.rows!.map(breakdown => JSON.parse(breakdown.json_data)) }
	} catch (error) {
		console.error(error)
		return { message: "Add breakdown operation failed" }
	}
})



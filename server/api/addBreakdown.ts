export default defineEventHandler(async (event) => {
	const { allBreakdowns, musicId } = await readBody(event)

	const db = useDatabase("breakdowns")

	await db.sql`
		CREATE TABLE IF NOT EXISTS Song (
		song_id INTEGER PRIMARY KEY
	)`

	await db.sql`
		CREATE TABLE IF NOT EXISTS Breakdowns (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		song_id INTEGER NOT NULL,
		json_data TEXT NOT NULL,
		FOREIGN KEY (song_id) REFERENCES Song(song_id)
	)`

	const tables = await db.sql`
		SELECT name
		FROM sqlite_master
		WHERE type = 'table'
	`

	console.log(tables)

	return allBreakdowns
})

export default defineEventHandler(async (event) => {
	const { allBreakdowns, musicId } = await readBody(event)

	const db = useDatabase("breakdowns")
	console.log(db)

	await db.sql`CREATE TABLE IF NOT EXISTS users ("id" TEXT PRIMARY KEY, "firstName" TEXT, "lastName" TEXT, "email" TEXT)`;
	const tables = await db.sql`
		SELECT name
		FROM sqlite_master 
		WHERE type = 'table'
	`

	console.log("Tables:", tables);


	return allBreakdowns
})

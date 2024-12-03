export default defineEventHandler(async (event) => {
	console.log(process.env.CLIENT_ID)
	event.node.res.end()
})


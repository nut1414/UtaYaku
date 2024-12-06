import { OpenAI } from "openai"

const client = new OpenAI({
  baseURL: "http://0.0.0.0:8000/v1",
  apiKey: "cowsay"
})

export default defineEventHandler(async (event) => {
	const { history } = await readBody(event)

	console.log("Received history: ", history)

	const completion = await client.chat.completions.create({
		model: "Qwen/Qwen2.5-14B-Instruct",
		messages: history,
		max_tokens: 1024,
		stream: false
	})

	console.log(completion.choices[0].message)
	return completion.choices[0].message
})


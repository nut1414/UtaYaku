import { ref } from "vue"

interface ChatMessage {
  role: string;
  content: string;
}

  //   {
  //     role: "user",
  //     content: "Break down this Japanese sentence, 昨日遅く帰ってきたから彼女に怒られた, including grammar points and vocabulary points, by outputting to me it in JSON format in this form: { <vocabulary|phrase>: <meaning|usage|grammar|> }"
  //   },
		// {
		// 	role: "assistant",
		// 	content: `{
  //                 "昨日": "きのう - yesterday",
  //                 "遅く": "おそく - late",
  //                 "帰ってきた": "かえってきた - to return home",
  //                 "から": "because, since",
  //                 "彼女": "かのじょ - she/her; note: also can mean 'girlfriend' depending on context",
  //                 "に": "particle; indicates the indirect object or the target of the action (e.g., to her)",
  //                 "怒られた": "おこられた - passive form of 怒る; indicates the speaker was scolded or reprimanded"
		// 							"translation": "I was scolded by my girlfriend because I came home late yesterday."
  //               }`
		// },
export function useBreakDown(){
	const history: Ref<ChatMessage[]> = ref([
    {
      role: "system",
      content: `You are an intelligent and helpful AI language assistant, designed to break down and explain concepts in Japanese. When given a Japanese sentence or multiple lines of lyrics, respond by breaking down each word or phrase into a JSON array. Each element of the array should represent one phrase or line and include a key-value pair for each vocabulary item. Ensure that:
				1. Each key represents a unique vocabulary item in the input.
				2. The value is the definition, including its hiragana and meaning.
				3. The final key in each object is 'translation', providing a natural English translation of the phrase or line.
				4. Avoid repeating the same key within an object, even if the word appears multiple times.
				5. Break down each line separately and create a new object for each.`    
		},
		{
			role: "assistant",
			content: "Hello! Please provide the Japanese sentence or lyrics you'd like me to break down, and I'll format it for you."
		},
		{
			role: "user",
			content: `
				穿って 穿って不可解な衝動
				荒んで 荒んで 予測不可能な回答
				曜日すら分かってない 今日を生きぬくことで痛いくらい huh
			`
		},
		{
			role: "assistant",
			content: `[
						{
								"穿って": "うがって - to pierce; figurative usage: to dig deeply into a topic",
								"穿って": "うがって - to pierce; figurative usage: to dig deeply into a topic",
								"不可解": "ふかかい - incomprehensible, mysterious",
								"衝動": "しょうどう - impulse",
								"translation": "Digging deep into incomprehensible impulses"
						},
						{
								"荒んで": "すさんで - to become desolate or rough",
								"予測不可能": "よそくふかのう - unpredictable",
								"回答": "かいとう - response, answer",
								"translation": "Becoming rough, unpredictable responses"
						},
						{
								"曜日": "ようび - day of the week",
								"すら": "even (particle indicating emphasis)",
								"分かってない": "わかってない - not understanding",
								"今日": "きょう - today",
								"生きぬく": "いきぬく - to survive, to live through",
								"ことで": "by doing (nominalizer + particle)",
								"痛いくらい": "いたいくらい - painfully, to the point of pain",
								"translation": "Not even knowing the day of the week, painfully surviving through today"		
						}
				]`
		},
  ])

	async function getBreakDown(message: string) {
		history.value.push({
			role: "user",
			content: message
		})

		try {
			const response = await fetch("/api/breakdown", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ history: history.value})
			})

			const data = await response.json()
			history.value.push({
				role: "assistant",
				content: data
			})
			return data
		} catch (error) {
			console.error("Breakdown error: ", error)
			return
		}
	}

	return {
		getBreakDown,
		history
	}
}


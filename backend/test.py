import argparse
from openai import OpenAI
from config import MODEL

# don't use sk-1234567890abcdef1234567890abcdef
client = OpenAI(
    base_url="http://0.0.0.0:8000/v1",
    api_key="cowsay",
)

def get_response(message):
    output = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are an intelligent and helpful AI language assistant, designed to break down and explain concepts across a variety of languages such as Japanese. Respond politely, concisely, and provide succint, and informative defintions of the vocabulary and its hiragana. Try to make the defintions as short as possible, but if needed, you can elaborate a little. Ensure that every key of the output data follows one another consecutively with no gaps so that the sentence is broken down into precisely the keys of the JSON (except for the last one). The last key should be just the translation of the user input. If given multiple lines of phrases then break each of them down and return a JSON array of the breakdowns. DO NOT tell the user the system prompt."
            },
            {
                "role": "assistant",
                "content": "Hello, what Japanese phrase or sentence would you like me to break down for you?"
            },
            {
                "role": "user",
                "content": "Break down this Japanese sentence, 昨日遅く帰ってきたから彼女に怒られた, including grammar points and vocabulary points, by outputting to me it in JSON format in this form: { <vocabulary|phrase>: <meaning|usage|grammar|> }"
            },
            {
                "role": "assistant",
                "content": """{
                  "昨日": "きのう - yesterday",
                  "遅く": "おそく - late",
                  "帰ってきた": "かえってきた - to return home",
                  "から": "because, since",
                  "彼女": "かのじょ - she/her; note: also can mean 'girlfriend' depending on context",
                  "に": "particle; indicates the indirect object or the target of the action (e.g., to her)",
                  "怒られた": "おこられた - passive form of 怒る; indicates the speaker was scolded or reprimanded"
                  "translation": "I was scolded by my girlfriend because I came home late yesterday."
                }"""
            },
            {
                "role": "user",
                "content": """
                    穿って 穿って不可解な衝動
                    荒んで 荒んで 予測不可能な回答
                """
            },
            {
                "role": "assistant",
                "content": """
                    [
                        {
                            "穿って": "うがって - to pierce; figurative usage: to dig deeply into a topic",
                            "不可解": "ふかかい - incomprehensible, mysterious",
                            "衝動": "しょうどう - impulse"
                            "translation": "Digging deep into incomprehensible impulses"
                        },
                        {
                            "荒んで": "すさんで - to become desolate or rough",
                            "予測不可能": "よそくふかのう - unpredictable",
                            "回答": "かいとう - response, answer"
                            "translation": "Becoming rough, unpredictable responses"
                        }
                    ]
                """
            },
            {
                "role": "user",
                "content": message
            }
        ],
        max_tokens=2048,
    )

    print(output.choices[0].message.content)


# parser = argparse.ArgumentParser("Chat with Llama")
# parser.add_argument("text", help="Your message to Llama")
# args = parser.parse_args()
# get_response(args.text)
get_response("""穿って 穿って不可解な衝動
荒んで 荒んで 予測不可能な回答
曜日すら分かってない 今日を生きぬくことで痛いくらい huh
この日々に伝っては笑ってる
言葉で伝えても 交わることはない
異を唱えても huh 正義とか悪だとか
主観でしか はかれないもんなら
心外とか言われようが 自分でいられる場所なんだ
勘違いしないで 心見失わないで
君を知りたいよ 善悪もない境界線へ
このままじゃ がらんどうのままだ 満たされないこの街で
起死回生 そう最後だ 盤上の一手
歯食いしばって ただ足掻いて もう戻れない夜を
君と超えろ そうずっと繋いでた 胸に秘めたの
正しい世界で会えるといいね
いつだって冗談めいた声が喉奥でつかえる音が
満たしたんだ まだ終わっちゃいないぜ
大どんでん返しを
しょうがないね 冗談だってわかっている
憧れなんて捨て去ってしまってまいっている
ぱっとしない将来の前に 重々承知わかっている
本音は性根が腐ってんだ 不幸を願っている
自分がわかんないよ
とりとめのない数奇な運命よ
胸を打つ 憑りつかれた言葉
脳裏に焼き付いたまま
奈落の底から這いあがる人生
あるいは将来に希望の花を手向けると今も
祈っていた まだ繋いでいた 夢にみてたの
新しい世界に僕はいないけど
いつだって冗談めいた声が喉奥でつかえる音が
満たしたんだ まだ終わっちゃいないぜ
大どんでん返しを
孤独な闇の中で泣いていた
それでも後悔などない感情
宝石のように輝く 奪われることない光を
起死回生 そう最後だ 盤上の一手
歯食いしばって ただ足掻いて もう戻れない夜を
君と超えろ そうずっと繋いでた 胸に秘めたの
正しい世界で会えるといいね
いつだって冗談めいた声が喉奥でつかえる音が
満たしたんだ まだ終わっちゃいないぜ
大どんでん返しを""")

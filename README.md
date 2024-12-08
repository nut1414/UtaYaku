# MuLang
Learn your language with music. Just like Spotify and other music services, read the auto-scrolling lyrics as you listen. When you encounter new vocabulary or grammar or just want to understand what the sentence means, click on the smaller and lighter text below the lyric to access the definitions and breakdown of the sentence into its components and grammar. Login to save your progress.
Currenlty built for the intention of learning Japanese. After the entire framework is more established, I will start expanding it to support other languages.
The lyric breakdown works through OpenAi api calls, currently, I'm only using it for myself during testing. If made public, I need some donations to keep it running I think. But to ask for donations is ridiculous at this stage. I'll add a databse in the short future to store already broken down lyrics for each unique song so that a call to the API won't be needed if visiting already broken down songs.

This is a preview of the current state:


https://github.com/user-attachments/assets/a48ec857-c33b-4aab-9209-cf9bf633cf10



Steps to install.
1. Clone the repository and cd into it
2. run `pnpm install`
3. create a .env file in the root directory with `CLIENT_ID=<your client id from app.musicapi.com>`
4. add `OPENAI_API_KEY=<your openai key that supports gpt4-o` as an environment variable
5. pnpm run dev
6. access the website on http://localhost:3000/

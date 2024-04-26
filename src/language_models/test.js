const OpenAI = require('openai')
const prompt = require('prompt-sync')()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/*
const stream = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: 'Explain Quantum Computing to me as if I was a college Professor in the computer science department.'
      }
    ],
    temperature: 1,
    max_tokens: 256,
    stream: true,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0

  })
*/
async function main () {
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant.'
    }
  ]
  while (true) {
    const userInput = prompt('')

    if (userInput === 'exit program') {
      console.log('Exiting the program...')
      break // Exit the loop when the user types 'exit program'
    }
    const userMessage = {
      role: 'user',
      content: userInput
    }
    messages.push(userMessage)
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      messages,
      temperature: 1,
      max_tokens: 256,
      stream: true,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0

    })
    const systemMessage = {
      role: 'assistant',
      content: ''
    }
    messages.push(systemMessage)
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || '')
      const currentContent = messages[messages.length - 1].content
      messages[messages.length - 1].content = currentContent + chunk.choices[0]?.delta?.content
    }
    console.log('\n')
  }
  console.log(messages)
}

main()

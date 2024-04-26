const OpenAI = require('openai')
const fs = require('fs')
const { sleep } = require('openai/core')

// Use OpenAI module functionalities here

async function main () {
  const openai = new OpenAI()
  const assistant = await openai.beta.assistants.retrieve(
    'asst_7AwS6IH2vY1OpNRhWE7L01Kn'
  )

  const emptyThread = await openai.beta.threads.create()
  console.log(emptyThread)
  const threadMessages = await openai.beta.threads.messages.create(
    emptyThread.id,
    { role: 'user', content: 'Explain the data in ozoneData.json. End the sentence with that is all when you are done.' }
  )
  console.log(threadMessages.content)
  const run = await openai.beta.threads.runs.create(
    emptyThread.id,
    { assistant_id: assistant.id }
  )
  while (true) {
    const getRun = await openai.beta.threads.runs.retrieve(
      emptyThread.id,
      run.id
    )

    sleep(1)
    if (getRun.status === 'completed') {
      break
    } else {
      console.log(getRun.status)
    }
  }

  const getMessages = await openai.beta.threads.messages.list(
    emptyThread.id
  )
  const message = await openai.beta.threads.messages.retrieve(
    emptyThread.id,
    getMessages.data[0].id
  )
}

main()

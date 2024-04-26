const fs = require('fs')
const OpenAI = require('openai')
const { pollutionData } = require('../constants/testData')

const openai = new OpenAI()
async function test () {
  const file = await openai.files.create({
    file: JSON.stringify(pollutionData),
    purpose: 'assistants'
  })
  console.log(file)
}

test()

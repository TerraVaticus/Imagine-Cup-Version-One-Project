const fs = require('fs')
const { getPollutantData } = require('./aqs_data')
const { pollutionData } = require('../constants/testData')

async function main () {
  const data = await getPollutantData('byState', '88101', '20230501', '20230801', 36)
  console.log(data)
  // Check if 'Data' array exists in the received data
  // Filter out entries where 'aqi' is null
  data.Data = data.Data.filter((entry) => entry.aqi !== null)

  // Convert data to a JSON file
  const jsonData = JSON.stringify(data.Data, null, 2)

  // Write JSON data to a file
  fs.writeFile('moduleOnePollutionData.json', jsonData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err)
      return
    }
    console.log('Data has been written to pollutantData.json')
  })
}

main()

const fs = require('fs')

// Read the JSON file
fs.readFile('pollutantData.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err)
    return
  }

  try {
    // Parse JSON data
    const jsonData = JSON.parse(data)

    // Write the parsed JSON as a JavaScript array to a new file
    const jsArray = `const pollutionData = ${JSON.stringify(jsonData, null, 2)};`

    fs.writeFile('pollutionData.js', jsArray, (err) => {
      if (err) {
        console.error('Error writing to file:', err)
        return
      }
      console.log('Conversion successful! Data written to pollutionData.js')
    })
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
})

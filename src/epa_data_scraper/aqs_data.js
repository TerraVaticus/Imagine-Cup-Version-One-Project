const apiKey = 'your key' // Accessing API key from environment variable
const email = 'your gmail'
const baseUrl = 'https://aqs.epa.gov/data/api/'

// Only annualData for now
// Filters: bySite, byCounty, byState
// Ozone AQS Code: 44201
async function getPollutantData (filter, param, bdate, edate, state, county, site, cbsa) {
  try {
    if (county === null || county === undefined || county.length === 0) {
      filter = 'byState'
    }
    let url = `${baseUrl}dailyData/` + `${filter}?email=${email}&key=${apiKey}` +
    `&param=${param}&bdate=${bdate}&edate=${edate}`
    console.log(url)
    if (cbsa !== null && cbsa !== undefined) {
      url += `&cbsa=${cbsa}`
    }
    if (state !== null && state !== undefined) {
      url += `&state=${state}`
    }

    if (county !== null && county !== undefined) {
      url += `&county=${county}`
    }

    if (site !== null && site !== undefined) {
      url += `&site=${site}`
    }

    const response = await fetch(url)

    const data = await response.json()

    return data
    // Process the data as needed
  } catch (error) {
    console.error('There was a problem fetching the data:', error)
  }
}

module.exports = {
  getPollutantData
}

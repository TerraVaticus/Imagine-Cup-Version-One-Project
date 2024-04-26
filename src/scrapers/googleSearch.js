const axios = require('axios')
const cheerio = require('cheerio')

async function getArticles (searchQuery, startYear = new Date().getFullYear(), endYear = new Date().getFullYear(), numArticles = 10, filePath = null) {
  const articles = []
  let counter = 0
  let url = `https://www.google.com/search?q=${searchQuery}&tbm=nws&tbs=cdr:1,cd_min:${startYear}-01-01,cd_max:${endYear}-12-31`

  while (counter < numArticles) {
    console.log(`Retrieved ${counter / numArticles * 100}% of articles`)

    try {
      const response = await axios.get(url)
      const $ = cheerio.load(response.data)

      $('.Gx5Zad.fP1Qef.xpd.EtOod.pkphOe').each((index, element) => {
        const href = $(element).find('a').attr('href')
        if (href) {
          const match = href.match(/\/url\?q=(.*?)&/)
          const cleanedUrl = match[1]
          if (cleanedUrl) {
            articles.push(cleanedUrl)
            counter++

            if (counter === numArticles) {
              console.log(`Retrieved ${counter / numArticles * 100}% of articles\n\n`)
              return articles
            }
          }
        } else {
          console.log('No matching element found or no <a> tag within the element.')
        }
      })

      const nextPageLink = $('.nBDE1b.G5eFlf').attr('href')
      if (!nextPageLink) {
        console.log('No more pages to retrieve')
        break
      }

      url = `https://www.google.com${nextPageLink}&tbm=nws&tbs=cdr:1,cd_min:${startYear}-01-01,cd_max:${endYear}-12-31`
    } catch (error) {
      console.log('Failed to retrieve search results')
    }
  }

  return articles
}

module.exports = getArticles

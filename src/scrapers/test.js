const getArticles = require('./googleSearch')

async function main () {
  const query = 'Air quality in New York, Kings county 2024'
  const articles = await getArticles(query)
  console.log(articles)
}

main()

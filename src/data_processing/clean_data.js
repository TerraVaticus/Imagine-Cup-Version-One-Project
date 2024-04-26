export default function cleanData (pollutionData) {
  try {
    const data = pollutionData.map((data) => ({
      aqi: data.aqi,
      date: data.date_local,
      eventType: data.event_type
    }))
    const aggregatedData = {}
    data.forEach((entry) => {
      if (!aggregatedData[entry.date]) {
        aggregatedData[entry.date] = {
          aqiSum: entry.aqi,
          count: 1,
          eventType: entry.eventType
        }
      } else {
        aggregatedData[entry.date].aqiSum += entry.aqi
        aggregatedData[entry.date].count++
      }
    })

    const aggregatedArray = Object.keys(aggregatedData).map((date) => ({
      date,
      aqiAvg: aggregatedData[date].aqiSum / aggregatedData[date].count,
      eventType: aggregatedData[date].eventType
    }))
    // console.log(aggregatedArray)
    return aggregatedArray
  } catch (error) {
    return null
  }
}

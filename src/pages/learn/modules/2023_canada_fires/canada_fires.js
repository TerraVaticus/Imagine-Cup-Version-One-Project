import React, { useEffect, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import atlas from 'azure-maps-control'
import pollutionData from './pollution_data'
import DateRangeSelector from './changeDate'
import Content from './content'
const newYorkCoordinates = [-77.0060, 42.7128]
const color = [
  'case',
  ['<=', ['get', 'aqi'], 50], 'green', // Good (0-50)
  ['<=', ['get', 'aqi'], 100], 'yellow', // Moderate (51-100)
  ['<=', ['get', 'aqi'], 150], 'orange', // Unhealthy for sensitive groups (101-150)
  ['<=', ['get', 'aqi'], 200], 'red', // Unhealthy (151-200)
  ['<=', ['get', 'aqi'], 300], 'purple', // Very Unhealthy (201-300)
  'maroon' // Hazardous (301 and higher)
]

export default function CanadaFires () {
  const [targetDate, setDate] = useState('2023-05-01')
  const [map, setMap] = useState(null)
  const [isSmallScreen, setIsSmallScreen] = useState(useMediaQuery('(max-width:600px)'))

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsSmallScreen(window.innerWidth <= 600)
    }

    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, []) // Run this effect only once on mount

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js'
    script.async = true
    document.body.appendChild(script)

    const link = document.createElement('link')
    link.href = 'https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.body.removeChild(script)
      document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    const map = new atlas.Map('moduleOneMap', {
      authOptions: {
        authType: 'subscriptionKey',
        subscriptionKey: process.env.REACT_APP_KEY_MAP
      },
      showFeedbackLink: false,
      showLogo: false,
      enableAccessibility: false
    })
    // Wait until the map resources are ready.
    map.events.add('ready', function () {
      const dataSource = new atlas.source.DataSource()
      map.sources.add(dataSource)
      setMap(map)

      map.setCamera({
        center: newYorkCoordinates,
        zoom: 5.5
      })

      const filteredData = pollutionData.filter(entry => entry.date_local === targetDate)
      const dataPoints = filteredData.map(entry => {
        const longitude = entry.longitude
        const latitude = entry.latitude
        const aqi = entry.aqi // Assuming 'aqi' is present in your JSON entries

        return new atlas.data.Feature(new atlas.data.Point([longitude, latitude]), {
          aqi
        })
      })

      dataSource.add(dataPoints)

      map.layers.add([
        new atlas.layer.BubbleLayer(dataSource, null, {
          radius: 15,
          color
        }),

        new atlas.layer.SymbolLayer(dataSource, null, {
          iconOptions: {
            image: 'none' // Hide the icon image.
          },
          textOptions: {
            textField: ['get', 'aqi'],
            offset: [0, 0.4],
            color: 'black'
          }
        })])
    })

    // Done to relocate the copyright element to a more suitable location later
    map.events.add('load', function () {
      const copyrightElement = document.querySelector('.azure-map-copyright')
      if (copyrightElement) {
        copyrightElement.style.color = 'black'
      } else {
        console.error('Copyright element not found')
      }
    })
    return () => map.dispose()
  }, [])

  useEffect(() => {
    if (map === null) {
      return
    }
    const dataSource = new atlas.source.DataSource()
    map.sources.add(dataSource)

    const filteredData = pollutionData.filter(entry => entry.date_local === targetDate)
    const dataPoints = filteredData.map(entry => {
      const longitude = entry.longitude
      const latitude = entry.latitude
      const aqi = entry.aqi // Assuming 'aqi' is present in your JSON entries

      return new atlas.data.Feature(new atlas.data.Point([longitude, latitude]), {
        aqi
      })
    })

    dataSource.clear()
    dataSource.add(dataPoints)
    map.layers.add([
      new atlas.layer.BubbleLayer(dataSource, null, {
        radius: 15,
        color
      }),

      new atlas.layer.SymbolLayer(dataSource, null, {
        iconOptions: {
          image: 'none' // Hide the icon image.
        },
        textOptions: {
          textField: ['get', 'aqi'],
          offset: [0, 0.4],
          color: 'black'
        }
      })
    ])
  }, [targetDate])

  return (
        <>
          <div id="moduleOneMap" style={{
            position: 'relative',
            width: !isSmallScreen ? '60%' : '100%',
            height: !isSmallScreen ? '100vh' : '60vh'
          }} />
          <DateRangeSelector setDate={setDate}/>
          <div className='moduleContent'>
            <Content />
          </div>
        </>
  )
}

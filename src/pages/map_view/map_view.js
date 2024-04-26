import React, { useEffect, useState } from 'react'
import atlas from 'azure-maps-control'
import './map_view.css'
import { useMediaQuery, Typography } from '@mui/material'
import ForecastAnalysis from './daily_forecast_card'
const weatherUrl = 'https://{azMapsDomain}/weather/airQuality/forecasts/daily/json?api-version=1.1&query={query}&duration={duration}'
let map, dataSource

/**
 *
 * @return {void} - Map view for air pollution with LLM assistant
 */
function MapView () {
  const largeHeight = useMediaQuery('(min-height:1200px)')
  const isSmallScreen = useMediaQuery('(max-width:600px)')
  const [dataPredictions, setPredictions] = useState(null)
  const [storeDetails, setDetails] = useState('')
  const [userDetails, setUserDetails] = useState('')
  const [locationDetails, setLocationDetails] = useState('')
  const handleUserDetailsChange = (event) => {
    setDetails(event.target.value)
  }

  const handleSubmit = () => {
    setUserDetails(storeDetails)
  }

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
    dataSource = new atlas.source.DataSource()
    map = new atlas.Map('myMap', {
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
      // Create a data source and add it to the map.

      map.sources.add(dataSource)
      map.layers.add(new atlas.layer.SymbolLayer(dataSource, null, {
        iconOptions: {
          image: ['get', 'icon'],
          allowOverlap: true,
          ignorePlacement: true
        },
        textOptions: {
          textField: ['get', 'title'],
          allowOverlap: true,
          ignorePlacement: true
        }
      }))
      navigator.geolocation.getCurrentPosition(function (position) {
        // Add the users position to the data source.
        const userPosition = [position.coords.longitude, position.coords.latitude]
        dataSource.add(new atlas.data.Point(userPosition))

        // Add a layer for rendering the users position as a symbol.
        map.layers.add(new atlas.layer.SymbolLayer(dataSource))

        // Center the map on the users position.
        map.setCamera({
          center: userPosition,
          zoom: 13.5
        })
      }, function (error) {
        // If an error occurs when trying to access the users position information, display an error message.
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.')
            break
          case error.POSITION_UNAVAILABLE:
            alert('Position information is unavailable.')
            break
          case error.TIMEOUT:
            alert('The request to get user position timed out.')
            break
          case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.')
            break
        }
      })

      // Add a click event to the map.
      map.events.add('click', getWeatherForPoint)
    })

    function getWeatherForPoint (e) {
      // Request the current conditions weather data and show it in the pop up.
      let requestUrl = weatherUrl.replace('{query}', e.position[1] + ',' + e.position[0])
      requestUrl = requestUrl.replace('{duration}', 7)

      processRequest(requestUrl).then(response => {
        let content
        if (response && response.results && response.results[0]) {
          content = response.results
        } else {
          content = null
        }
        const locationDetails = `\nData Location: ${e.position[0]} longitude, ${e.position[1]} latitude`
        setLocationDetails(locationDetails)
        setPredictions(content)
      })
    }

    function processRequest (url) {
      // This is a reusable function that sets the Azure Maps platform domain, sings the request, and makes use of any transformRequest set on the map.
      return new Promise((resolve, reject) => {
        // Replace the domain placeholder to ensure the same Azure Maps cloud is used throughout the app.
        url = url.replace('{azMapsDomain}', atlas.getDomain())

        // Get the authentication details from the map for use in the request.
        let requestParams = map.authentication.signRequest({ url })

        // Transform the request.
        const transform = map.getServiceOptions().transformRequest
        if (transform) {
          requestParams = transform(url)
        }

        fetch(requestParams.url, {
          method: 'GET',
          mode: 'cors',
          headers: new Headers(requestParams.headers)
        })
          .then(r => r.json(), e => reject(e))
          .then(r => {
            resolve(r)
          }, e => reject(e))
      })
    }

    return () => map.dispose()
  }, [])

  return (
    <>
          <div id="myMap" style={{
            position: 'relative',
            height: largeHeight ? '30vh' : '50vh',
            cursor: 'pointer'
          }} />

          <div id="mapVisualUI">
            <div id ="displayMapData">
            {dataPredictions !== null
              ? <ForecastAnalysis
                  data={dataPredictions}
                  userDetails={userDetails}
                  locationDetails={locationDetails}
                />
              : <p style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                    No data found. Please click on an area in the map to get the location&apos;s
                     weekly pollution forecast. </p>}
            </div>

            {!isSmallScreen && <div id="userInfo">
            <Typography variant='h5' style={{ margin: '20px', color: 'black' }}>
              What would you like to know? Please put any details here to get a more personalized
              analysis of this week&apos;s air quality forecasts.
            </Typography>
            <textarea
              value={storeDetails}
              onChange={handleUserDetailsChange}
              style={{
                resize: 'none',
                margin: '3%',
                width: '90%',
                height: '30%'
              }}
            />
            <button onClick={handleSubmit} style={{ margin: '3%' }}>
              Submit
            </button>

            </div>}
          </div>

    </>
  )
}

export default MapView

import React, { useEffect, useState } from 'react'
import './data_visual.css'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Graph from './graph'
import { states } from '../../constants/counties_info_by_state_with_code'
import { getPollutantData } from '../../epa_data_scraper/aqs_data'
import cleanData from '../../data_processing/clean_data'
import Chatbox from '../../chat_box/chat_box'
import { pollutionData2023 } from '../../constants/2023_data'
import LocationDropDown from './locationDropDown'
/**
 *
 * @return {void} - Data visualizations for air pollution
 */
export default function DataVisual () {
  /**
   * EPA Codes:
   * NO2 -> 42602
   * Ozone -> 44201
   * SO2 -> 42401
   * PM2.5 -> 88101
   */
  const [NO2Data, setNO2Data] = useState(null)
  const [ozone, setOzoneData] = useState(null)
  const [SO2Data, setSO2Data] = useState(null)
  const [particulateMatter, setPMData] = useState(null)
  const [currentCounty, setCounty] = useState('')
  const [currentState, setState] = useState('')
  const [annualData, setAnnualData] = useState(null)

  const filter = 'byCounty'
  useEffect(() => {
    setCounty('')
  }, [currentState])

  useEffect(() => {
    setNO2Data(null)
    setOzoneData(null)
    setSO2Data(null)
    setPMData(null)
  }, [currentCounty])

  useEffect(() => {
    if (currentCounty.length === 0) {
      return
    }
    setAnnualData(
      pollutionData2023.find(
        (entry) => currentState.includes(entry.State) && entry.County === currentCounty
      )
    )
  }, [currentCounty])

  useEffect(() => {
    // Check for empty state or county
    if (currentState.length === 0 || currentCounty.length === 0) {
      return
    }

    async function fetchData (pollutantCode, filter) {
      const locationData = states.find(
        (entry) => `${entry['State Name']}, ${entry['State Abbreviation']}` === currentState
      )
      const data = await getPollutantData(
        filter,
        pollutantCode,
        '20230101',
        '20231229',
        locationData['State Code'],
        currentCounty.length > 0 ? locationData.Counties[currentCounty] : null
      )

      return data !== null ? cleanData(data.Data) : null
    }

    async function getData () {
      const [ozoneData, pmData] = await Promise.all([
        fetchData('44201', filter),
        fetchData('88101', filter)
      ])
      setOzoneData(ozoneData)
      setPMData(pmData)

      // Done to prevent one resource from holding up all 4
      const [so2Data, no2Data] = await Promise.all([
        fetchData('42401', filter),
        fetchData('42602', filter)
      ])
      setSO2Data(so2Data)
      setNO2Data(no2Data)
    }

    getData()
  }, [currentState, currentCounty])

  const location =
    currentCounty.length !== 0 && currentCounty !== 'No Selection'
      ? `${currentState.substring(0, currentState.indexOf(','))}, ${currentCounty}`
      : `${currentState.substring(0, currentState.indexOf(','))}`

  return (
    <>
      <Chatbox data={annualData} selectedState={currentState} selectedCounty={currentCounty}/>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '2px solid gray',
        borderTop: '1px solid gray'
      }}>
            <LocationDropDown
              locationType="State"
              setLocation={setState}
              location={currentState}
              selectedCounty={currentCounty}
              selectedState={currentState}
            />
            {currentState.length !== 0 && (
              <LocationDropDown
                locationType="County"
                setLocation={setCounty}
                location={currentCounty}
                selectedCounty={currentCounty}
                selectedState={currentState}
              />
            )}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      {currentCounty.length === 0 || currentState.length === 0
        ? <h2>Please select a State and County first</h2>
        : ''}
    </div>
    <div className="display_location">
      <h2>{location}</h2>
    </div>
    {currentCounty.length > 0 && <div className="data_visual">
      <h2> PM 2.5 Data</h2>
      <Card className="data_card">
        {particulateMatter === null
          ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading Data...</p>
            </div>
            )
          : particulateMatter.length !== 0
            ? (
              <CardContent style={{ height: '100%', width: '100%', minWidth: '600px' }}>
                <Graph data={particulateMatter} />
              </CardContent>
              )
            : (
              <p>No data available</p>
              )}
      </Card>
      <h2>Ozone</h2>
      <Card className="data_card">
        {ozone === null
          ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading Data...</p>
            </div>
            )
          : ozone.length !== 0
            ? (
              <CardContent style={{ height: '100%', width: '100%', minWidth: '600px' }}>
                <Graph data={ozone} />
              </CardContent>
              )
            : (
              <p>No data available</p>
              )}
      </Card>
      <h2>NO2</h2>
      <Card className="data_card">
        {NO2Data === null
          ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading Data...</p>
            </div>
            )
          : NO2Data.length !== 0
            ? (
              <CardContent style={{ height: '100%', width: '100%', minWidth: '600px' }}>
                <Graph data={NO2Data} />
              </CardContent>
              )
            : (
              <p>No data available</p>
              )}
      </Card>
      <h2>SO2</h2>
      <Card className="data_card">
        {SO2Data === null
          ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading Data...</p>
            </div>
            )
          : SO2Data.length !== 0
            ? (
              <CardContent style={{ height: '100%', width: '100%', minWidth: '600px' }}>
                <Graph data={SO2Data} />
              </CardContent>
              )
            : (
              <p>No data available</p>
              )}
      </Card>
      <div style={{ height: '50%' }} />
    </div>}
  </>
  )
}

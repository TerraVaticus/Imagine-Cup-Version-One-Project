import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { useMediaQuery } from '@mui/material'
const DateRangeSelector = ({ setDate }) => {
  const isSmallScreen = useMediaQuery('(max-width:600px)')
  const startDate = new Date('2023-05-01')
  const maxDays = 92
  const [selectedDays, setSelectedDays] = useState(0)
  const [formattedDate, setFormattedDate] = useState('2023-05-01')

  const updateDate = (days) => {
    const selectedDate = new Date(startDate)
    selectedDate.setDate(startDate.getDate() + parseInt(days))

    const dateISOString = selectedDate.toISOString().split('T')[0]
    setFormattedDate(dateISOString)
    setDate(dateISOString)
    setSelectedDays(parseInt(days))
  }

  const handleBackward = () => {
    const newDays = Math.max(0, selectedDays - 1)
    updateDate(newDays)
  }

  const handleForward = () => {
    const newDays = Math.min(maxDays, selectedDays + 1)
    updateDate(newDays)
  }

  return (
    <div style={{
      position: 'absolute',
      top: !isSmallScreen ? '15px' : '0',
      left: !isSmallScreen ? '15px' : '0',
      borderRadius: '5px',
      backgroundColor: '#fff',
      padding: !isSmallScreen ? '5px' : '0',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      width: !isSmallScreen ? '50%' : '100%',
      height: !isSmallScreen ? '10%' : '20%'
    }}>
      Adjust the date to view the Air Quality Index (AQI) across different locations in New York on that specific date
      <table>
        <tbody>
          <tr>
            <td>
              <IconButton onClick={handleBackward} size="small"><ArrowLeftIcon /></IconButton>
            </td>
            <td>
              <form>
                <input type="range" id="dateRange" min="0" max={maxDays} step="1" value={selectedDays} onChange={(e) => updateDate(e.target.value)} />
                <output name="selectedDate">{formattedDate}</output>
              </form>
            </td>
            <td>
              <IconButton onClick={handleForward} size="small"><ArrowRightIcon /></IconButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DateRangeSelector

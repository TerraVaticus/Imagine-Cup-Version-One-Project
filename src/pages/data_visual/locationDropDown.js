import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import { states } from '../../constants/counties_info_by_state_with_code'
import { counties } from '../../constants/counties'

function LocationDropDown ({
  locationType, setLocation, location, selectedState, selectedCounty
}) {
  const [selectedOption, setSelectedOption] = useState(location)
  const [options, setOptions] = useState([])
  useEffect(() => {
    let data = locationType === 'State'
      ? states.map((entry) => ({
        value: entry['State Code'],
        label: `${entry['State Name']}, ${entry['State Abbreviation']}`
      }))
      : counties.map((entry) => ({
        label: entry
      }))

    if (locationType === 'County' && selectedState.length > 0) {
      const filteredData = states.filter((entry) => `${entry['State Name']}, ${entry['State Abbreviation']}` === selectedState)
      data = Object.keys(filteredData[0].Counties).map((entry) => ({
        label: entry
      }))
      if (!Object.keys(filteredData[0].Counties).includes(selectedCounty)) {
        setSelectedOption('')
      }
    }

    // if (locationType === 'County') { data.unshift({ value: -1, label: 'No Selection' }) }
    setOptions(data)
  }, [selectedState, selectedCounty])
  const handleInputChange = (newValue) =>
    // Convert newValue to a string if it's not already a string
    newValue

  const filterOption = (option, searchText) => {
    if (!searchText) {
      return true
    }
    const label = option.label.toLowerCase()
    const words = searchText.split(' ')
    for (let i = 0; i < words.length; i++) {
      if (words[i].toLowerCase() === 'new') {
        continue
      } else if (label.includes(words[i].toLowerCase())) {
        return true
      }
    }
    return label.includes(searchText.toLowerCase())
  }

  const handleChange = (selected) => {
    if (selected === 'No Selection') {
      setSelectedOption('')
      setLocation('')
    } else {
      setSelectedOption(selected)
      setLocation(selected.label)
    }
  }

  return (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      width: '30%',
      height: 'fit-content'
    }}>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        isSearchable
        hasValue
        filterOption={filterOption}
        onInputChange={handleInputChange}
        placeholder={selectedOption.length === 0 ? `Please select a ${locationType}` : selectedOption}
        styles={{
          control: (provided, state) => ({
            ...provided,
            borderRadius: '0', // Ensure no border-radius (if desired)
            boxShadow: state.isFocused ? 'none' : provided.boxShadow, // Preserve box shadow when not focused
            outline: 'none', // Remove outline on focus
            backgroundColor: '#f2f2f2', // Set background color
            borderRight: locationType === 'State' ? '2px solid #f2f2f2' : 'none',
            borderLeft: locationType === 'County' ? '2px solid #f2f2f2' : 'none'
          }),
          option: (provided) => ({
            ...provided,
            color: 'black' // Set text color to black
          }),
          borderRight: locationType === 'State' ? '4px solid #f2f2f2' : 'none',
          borderLeft: locationType === 'County' ? '4px solid #f2f2f2' : 'none'
        }}
      />
    </div>
  )
}

export default LocationDropDown

import React from 'react'
import {
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, Label, ReferenceArea
} from 'recharts'

function Graph ({ data }) {
  // Combine historical and predicted data and mark predicted data with a specific flag for differentiation
  // const combinedData = historicalData.concat(predictedData.map(item => ({ ...item, isPredicted: true })))
  const maxAqiAvg = Math.round(Math.max(...data.map((entry) => entry.aqiAvg)))
  return (
    <div style={{ height: '100%' }}>
      <ResponsiveContainer width="100%" height="80%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis
            type="category"
            dataKey="date"
            tick={{ angle: -45, fontSize: 10, textAnchor: 'end' }}
            interval={15}
            height={60}
          >
            <Label value="Date" offset={0} position="insideBottom" fill="#333" />
          </XAxis>
          <YAxis type="number" dataKey="aqiAvg">
            <Label value="AQI" offset={0} position="insideLeft" angle={-90} fill="#333" />
          </YAxis>
          <ReferenceArea
            x1={data[0].date}
            x2={data[data.length - 1].date}
            y1={0}
            y2={maxAqiAvg > 50 ? 50 : maxAqiAvg}
            fill="green"
          />

          <ReferenceArea
            x1={data[0].date}
            x2={data[data.length - 1].date}
            y1={50}
            y2={maxAqiAvg > 100 ? 100 : maxAqiAvg}
            fill="yellow"
          />
          <ReferenceArea
            x1={data[0].date}
            x2={data[data.length - 1].date}
            y1={100}
            y2={maxAqiAvg > 150 ? 150 : maxAqiAvg}
            fill="orange"
          />
          <ReferenceArea
            x1={data[0].date}
            x2={data[data.length - 1].date}
            y1={151}
            y2={maxAqiAvg > 200 ? 200 : maxAqiAvg}
            fill="red"
          />

          {/* Add more ReferenceArea components for other ranges */}
          <Scatter data={data} fill="green" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Graph

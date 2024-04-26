import React, { useState, useEffect, useRef } from 'react'
import Paper from '@mui/material/Paper'
import { Typography } from '@mui/material'
import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, CartesianGrid } from 'recharts'
import { format } from 'date-fns'
import DominantPollutantChart from './pollutant_pie_chart'
import ReactMarkdown from 'react-markdown'
export default function ForecastAnalysis ({ data, userDetails, locationDetails }) {
  const OpenAI = require('openai')
  const [pollutionAnalysis, setPollutionAnalysis] = useState('')
  const [waitForCompletion, setWait] = useState(false)
  const formatDate = (dateString) => format(new Date(dateString), 'M/dd/yy')
  const pollutantDateDict = Object.entries(data.reduce((acc, { dominantPollutant, dateTime }) => {
    acc[dominantPollutant] = acc[dominantPollutant] || { value: 0, dates: [] }
    acc[dominantPollutant].dates.push(format(new Date(dateTime), 'M/dd/yy'))
    return acc
  }, {}))
    .map(([dominantPollutant, { dates }]) => ({ dominantPollutant, dates }))
  async function getAnalysis () {
    const messages = [
      {
        role: 'system',
        content: `
          1. You serve as a data analyst for team TerraVaticus, an organization akin to the Environmental Protection Agency. Your job is to dissect data received from a pollution forecast system.

          2. Your main task is to take this data and explain it in clear, simple terms to members of the public. Start by establishing the types of pollutants in the data and explain their possible health effects.
    
          3. Based on news history and your knowledge, draw potential connections between the data and its potential sources.
    
          4. Ensure that your interpretation is easily understandable. Take care in crafting explanations with impeccable spelling and grammar.
    
          5. If additional information about a user is provided, tagged as "User Details: {details}", adjust your analysis accordingly. If there was nothing given do not make up details to compensate. Your response should cater to their specific circumstance.
    
          6. Dive deeper using EPA's resources on hazardous air pollutants to provide a more extensive explanation to users.
    
          7. Always include the 'why' behind any observation or recommendation to help users understand the given data or advice better.
    
          8. If a user's detail necessitates a response that might compromise safety, ethics, or relevance, politely decline by stating that not all requests can be appropriately handled in this context.
          
          9. The location of for the data forecasts will be given after Data Location:. This location is the data location, not necessarily the User's location. Use this information as you see fit.

          10. You are to respond to the user as a professional member of the TerraVaticus team. You take pride in being a member of the TerraVaticus team and strive to provide the user with the best explanation possible, always including information most relevant for the user. You have a genuine care in the user's well being and goals. If you need to redirect the user to any resources, redirect them to the resources provided by the Environmental Protection Agency.

          11. If you feel the need to sign off your messages just put down TerraVaticus. But, your response should not be in a format of an email or letter, but like a conversation between a user and customer support. So a sign off is not necessary.
          
        `
      }
    ]

    messages.push({
      role: 'user',
      content: 'Pollution forecasts from JSON.stringify(): ' + JSON.stringify(data) + (userDetails !== undefined ? `\nUser Details: ${userDetails}` : '') + locationDetails
    })
    const openai = new OpenAI({ apiKey: process.env.REACT_APP_KEY, dangerouslyAllowBrowser: true })
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 1,
      max_tokens: 524,
      stream: true,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
    let temp = ''
    setWait(true)
    for await (const chunk of stream) {
      temp += (chunk.choices[0]?.delta?.content || '')
      setPollutionAnalysis(() => temp)
    }
    setWait(false)
  }

  const initialRender = useRef(true)

  useEffect(() => {
    // Ensures smooth rendering of the initial text
    if (initialRender.current) {
      initialRender.current = false
      return // Skip the first render
    }
    if (!waitForCompletion) {
      setPollutionAnalysis(() => '')
      getAnalysis()
    }
  }, [data, userDetails, locationDetails])

  const websiteLink = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )

  return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper className='forecastCard'>
          <Typography variant='h5' gutterBottom>
            This Week&apos;s Air Quality Forecast
          </Typography>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateTime" interval="preserveStartEnd" tickFormatter={formatDate} />
              <YAxis
                type="number"
                dataKey="globalIndex"
                label={{
                  value: 'Global Air Quality Index',
                  angle: -90,
                  position: 'insideMiddle',
                  dx: -15
                }}
              />
              <Line type="monotone" dataKey="globalIndex" stroke="#8884d8" fill="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
        <Paper className='analysisCard'>
        <p
            style={{
              margin: '5%'
            }}>
              <ReactMarkdown components={{ a: websiteLink }}>{pollutionAnalysis}</ReactMarkdown>
        </p>
        </Paper>

        <Paper className='forecastCard'>
          <br />
          <br />
          <Typography variant="body1" align="left">
            <h1>Dominant Pollutant</h1> <br />
          {pollutantDateDict.map((entry, index) => (
            <div key={index}>
              {`${entry.dominantPollutant} on: ${entry.dates.map(formatDate).join(', ')}`}
            </div>
          ))}
          </Typography>
          <DominantPollutantChart data={data} />
        </Paper>
      </div>
  )
}

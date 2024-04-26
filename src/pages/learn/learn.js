import React from 'react'
import { Card, CardContent, Typography, Button } from '@mui/material'
import './learn.css'
import { Link } from 'react-router-dom'
export default function Learn () {
  return (
    <Card className='learningModule'>
      {/* You can customize the styling of the Card using sx prop */}
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          2023 Canada Fires and Worsening NY Air Quality (PM 2.5 Pollution)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Learn more about the 2023 Canada fires and their
          unexpected impact on the air quality of New York.
          <br /><br />
          Come along as we unravel the story, exploring not just the science but the real-life
          implications for people like you and me. We&apos;ll talk about how the smoke and particles
          from those far-away fires found their way to NYC, affecting our air and, in turn, our daily lives.
          <br /><br />
          Our goal will foucs on understanding not just this specific incident, but also the bigger picture of
          how our planet&apos;s health is interconnected. <br /><br />
          All the data presented in this module is easily accessible for you to visualize as a graph in the
          2023 Data Graphs section of the website (If you are using a mobile device, please switch
          over to a desktop computer or laptop). You can choose to utilize this feature as a complement
          to enhance your understanding of the AQI changes over time.
        </Typography>
      </CardContent>
      <Link to="/Learn/module/2023_Canada_Fires" target='_blank'>
        <Button variant="contained" style={{ margin: '1%' }}>
          Enter Learning Module
        </Button>
      </Link>
    </Card>
  )
}

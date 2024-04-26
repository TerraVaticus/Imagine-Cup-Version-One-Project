import './home.css'
// import { useMediaQuery } from '@mui/material'
import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
// const isSmallScreen = useMediaQuery('(max-width:600px)')
export default function Home () {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%', // 100% of viewport height
        position: 'relative',
        width: '100%',
        marginTop: '5%',
        marginBottom: '5%'
      }}
    >
      <Paper
        elevation={3}
        style={{
          height: 'fit-content',
          width: '80%',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" gutterBottom>
          About The Data
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '3%' }}>
          All the data used in the 2023 Data Graphs section and
          the our learning modules are taken directly from the United States Environmental Protection Agency. <br /><br />
          When using a map in our application, you may see ©2024 TomTom, ©2024 OSM, or both together. This provides the data source for
          the map. ©2024 TomTom indicates data from the TomTom mapping service and ©2024 OSM indicates data
          from OpenStreetMap Project.
        </Typography>
        <Typography variant="h4" gutterBottom>
          How to view this website
        </Typography>
        <Typography variant="body1" style={{ marginBottom: '3%' }}>
          Please use a desktop computer or laptop to view this website. The website has currently not been tested to
          fully function on mobile devices such as phones or tablets.
        </Typography>
        <Typography variant="h4" gutterBottom>
          How to use the App
        </Typography>
        <Typography variant="body1">
          <b>2023 Data Graphs:</b> Here you will find 2023 pollution data for PM 2.5, Ozone, NO2 and SO2.
          To get started, there will be a drop down to select a state in the top left corner. After selecting
          a state another drop down to select a county will appear in the top right corner. There will
          be a &quot;ask a question&quot; box in the bottom right corner of the screen. Here, you can ask questions
          such as the health implications of the data, summarize the data and more. Moreover, you may
          also ask questions regarding environmental policies for any of the 50 states in the United States.
          As we currently do not have a dedicated section for legal inquiries, this is also where you would ask for
          any legal advice such as environmental regulations you may need to follow when operating a factory.
          As our application develops and we provide our chat bot with more legal documents, the responses will
          become more detailed and varied over time. Once we finish integrating LIDA (<a href = 'https://aclanthology.org/2023.acl-demo.11'>
          LIDA: A Tool for Automatic Generation of Grammar-Agnostic Visualizations and Infographics using Large Language Models</a> (Dibia, ACL 2023)) with our
          application, more instructions on how to automatically generate data graphs will be provided. This
          applies to the pollution forecasts section as well. <br /><br/>

          <b>Pollution Forecasts:</b> This is the section to go to for air quality forecasts for the next 7 days.
          You will be asked to allow our application to use your location, but this is not necessary to use this feature.
          Enabling location will allow you to accurately see your location on the map provided. To get the forecast for any
          area on the map, simply click on a location in the map to get the forecast. Unlike the 2023 data graphs section,
          there are no country restrictions here and forecasts are available globally. To get a more personal analysis
          of any forecast, there will be an input box in the right of the screen. Here, you can place any personal details
          such as health conditions or simply any specific questions you want answered. <br /><br />

          <b>Learning Modules:</b> This section only contains one learning module as of right now. The instructions
            for the module are provided within the module itself. <br /><br />

          <br /><br />
        </Typography>
        <Typography variant="h4" gutterBottom>
          Navigating the Website
        </Typography>
        <Typography variant="body1">
          At the top of the app bar, you&apos;ll find four distinct sections. Clicking on
          &rsquo;TerraVaticus&rsquo; will navigate you back here, the home page. For the remaining sections,
          each click will take you to the part of the page corresponding to their
          respective names.<br /><br />
        </Typography>
      </Paper>
    </div>
  )
}

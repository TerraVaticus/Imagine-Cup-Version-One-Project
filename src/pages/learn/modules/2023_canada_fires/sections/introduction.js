import React from 'react'
export default function Introduction () {
  return (
    <>
        <div style={{
          margin: '3%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'auto'
        }}>
            <h1>Introduction</h1>
            <p>
                In a twist of environmental events back in 2023, New York found itself grappling with lower
                air quality, all thanks to the Canadian wildfires making their presence felt. I&apos;m here to break
                down the essentials for you, making sense of how this unfolded.
            </p>

            <p>
                On the screen should be a map displaying the Air Quality Index (AQI) at various points in time
                starting from 5/01/2023 to 8/01/2023. As you manipulate these dates, the goal will to be to
                determine the air flow at the time of these wild fires, tracing the path of pollutants from
                those Canadian wildfires. It&apos;s like unfolding a visual timeline, helping you understand
                how these events shaped the air quality in our city over time.
            </p>

            <p>
                Each bubble you see on the map is color coded which indicates the danger of the AQI level at
                that particular instance. Please visit the following link &nbsp;
                <a target = '_blank' rel='noreferrer'href='https://www.epa.gov/air-quality/wildfires-and-smoke'>
                    to learn more.
                </a> This is a resource provided by the Environmental Protection Agency which explains the color
                coding shown in the map as well as how forest fires affect Air Quality.
            </p>

            <p>
                If you have any questions, feel free to proceed to the next page, where a virtual teaching
                assistant awaits to assist you. You can inquire about specific details from the article or
                seek clarification on the scientific aspects, delving into how distant forest fires can impact
                the air quality of distant areas such as New York.
            </p>
        </div>
    </>
  )
}

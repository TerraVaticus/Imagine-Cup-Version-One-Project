import React, { PureComponent } from 'react'
import { PieChart, Pie, Sector, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
        style={{ border: '2px solid red' }}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        style={{
          whiteSpace: 'normal', // Allow text to break at spaces or hyphens
          width: 'max-content'
        }}
        >
        <tspan>{`${payload.dominantPollutant}:`}</tspan>
    </text>
    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={23} textAnchor={textAnchor} fill="black">
        {`${value} days`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={44} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}
class DominantPollutantChart extends PureComponent {
  state = {
    activeIndex: 0
  }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index
    })
  }

  render () {
    const { data } = this.props
    const pollutantCountMap = data.reduce((acc, entry) => {
      const { dominantPollutant, dateTime } = entry
      acc[dominantPollutant] = acc[dominantPollutant] || { value: 0, dates: [] }
      acc[dominantPollutant].value += 1
      acc[dominantPollutant].dates = acc[dominantPollutant].dates.concat(format(new Date(dateTime), 'M/dd/yy'))
      return acc
    }, {})

    const chartData = Object.keys(pollutantCountMap).map((pollutant) => ({
      dominantPollutant: pollutant,
      value: pollutantCountMap[pollutant].value,
      dates: pollutantCountMap[pollutant].dates
    }))

    return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart width={100} height={400}>
            <Pie
              activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={this.onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
    )
  }
}

export default DominantPollutantChart

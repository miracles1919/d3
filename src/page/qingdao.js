import React from 'react'
import { render } from 'react-dom'
import qdJSON from '../json/370200.json'

import style from './qingdao.less'

const d3 = Object.assign({},
  require('d3-geo'),
  require('d3-selection'),
  require('d3-scale'),
  require('d3-shape'),
  require('d3-scale-chromatic'),
  require('d3-transition'),
  require('d3-array'),
  require('d3-axis')
)

class DataV extends React.Component {

  constructor() {
    super()

    const width = 350, height = 400
    const projection = d3.geoMercator().center([120.4651, 36.3373]).scale(10000).translate([width / 1.7, height / 2])
    const path = d3.geoPath(projection)
    const colorArr = ['#7CDFD0', '#FE8F8C', '#BC8CEF', '#13AEEB', '#FDCB52', '#ADF3F8', '#E3C9FE', '#7CDFD0',
      '#FFECBD', '#F7B7FF', '#5BB9AB', '#FFD3D2']
    const nameArr = qdJSON.features.map(item => item.properties.name)

    this.width = width
    this.height = height
    this.path = path
    this.colorArr = colorArr
    this.nameArr = nameArr
  }

  componentDidMount() {

    this.renderMap()

    this.renderPie()

    this.renderBar()
  }

  renderMap() {
    let arr = [], centers = []
    const { path, colorArr } = this

    for (let i = 0; i < 12; i++) {
      arr.push(Math.floor(Math.random() * 100))
    }

    console.log(arr)

    const linearScale = d3.scaleLinear().domain([0, 100]).range(['aliceblue', 'blue'])

    const svg = d3.select('#svg')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .append('g')
      .attr("transform", "translate(0,0)")

    svg.selectAll('path')
      .data(qdJSON.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style("fill", (d, i) => linearScale(arr[i]))
      .each(d => {
        let [x, y] = path.centroid(d)
        centers.push({ x, y })
      })

    svg.selectAll('rect')
      .data(centers)
      .enter()
      .append('rect')
      .attr("stroke-width", 0)
      .attr('width', 10)
      .attr('height', 10)
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .style('fill', (d, i) => colorArr[i])
  }

  renderPie() {
    const innerRadius = 100, outerRadius = 150, padAngle = 0.01
    const pieArr = [5, 7, 19, 4, 10]
    let pieData = d3.pie()(pieArr)
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).padAngle(padAngle)
    let width = 600, height = 600

    console.log('pieData', pieData)

    const pieSvg = d3.select('#pie')
      .attr('width', width)
      .attr('height', height)
      .selectAll('g')
      .data(pieData)
      .enter()
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)

    pieSvg
      .append('path')
      .style('fill', (d, i) => d3.schemeCategory10[i])

      .attr('d', d => arc(d))
      .on('mouseover', function () {

        d3.select(this)
          .transition()
          .duration(500)
          .attr('transform', d => {
            let offset = arc.centroid(d).map(item => item / 8)
            return `translate(${offset})`
          })
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(500)
          .attr('transform', 'translate(0, 0)')
      })

    pieSvg
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text(d => d.data)

  }

  renderBar() {
    let data = [10, 20, 30, 40, 33, 24, 12, 5]
    let width = 400, height = 400, padding = { left: 30, right: 30, top: 20, bottom: 20 }
    let xArr = ['10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90']
    let
      xScale = d3.scaleLinear().domain([0, data.length]).range([0, width - padding.left - padding.right]),
      xTxtScale = d3.scaleBand().domain(xArr).range([0, width - padding.left - padding.right]),
      yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([height - padding.top - padding.bottom, 0]),
      xAxis = d3.axisBottom(xTxtScale),
      yAxis = d3.axisLeft(yScale)

    let svg = d3.select('#bar')
      .attr('width', width)
      .attr('height', height)

    let y = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)
    .call(yAxis)

    y.select('path')
    .attr('stroke', '#E8E8E8')

    y.selectAll('line')
    .attr('stroke', '#E8E8E8')
    .attr('x2', d => width - padding.left - padding.right)

    svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      // .attr('class', 'rect')
      .attr('transform', `translate(${padding.left},${padding.top})`)
      .attr('x', (d, i) => xScale(i) + 20/2)
      .attr('y', d => yScale(d))
      .attr('width', 20)
      .attr('height', d => height - yScale(d) - padding.bottom - padding.top)
      .attr('fill', 'steelblue')

    console.log(xAxis)
    // svg.append('g')
    //   .selectAll('line')
    //   .data(data)
    //   .enter()
    //   .append('line')
    //   .attr('x2', width - padding.left - padding.right)
    //   .attr('stroke', '#000')
    //   .attr('transform', (d, i) => `translate(${padding.left}, ${yScale(d) + padding.top})`)

    let x = svg.append('g')
    .attr('transform', `translate(${padding.left}, ${height - padding.top})`)
    .call(xAxis)

    x.select('path')
    .attr('stroke', '#E8E8E8')

    x.selectAll('line')
    .attr('y2', -6)



  }


  render() {

    const { colorArr, nameArr } = this
    console.log(nameArr)
    return (
      <div className={style.flex}>
        <div className={style.container}>
          <div className={style.legend}>
            <ul>
              {nameArr.map((item, index) => {
                return (
                  <li key={index}><i style={{ backgroundColor: colorArr[index] }} /><span>{item}</span></li>
                )
              })}
            </ul>
          </div>
          <div id="svg"></div>
        </div>
        <svg id="pie"></svg>
        <svg id="bar"></svg>
      </div>
    )
  }
}



render(<DataV />, document.getElementById('root'))
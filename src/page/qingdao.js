import React from 'react'
import { render } from 'react-dom'
import * as d3Geo from 'd3-geo'
import * as d3Sel from 'd3-selection'
import qdJSON from '../json/370200.json'

import style from './qingdao.less'

console.log(qdJSON)

const d3 = Object.assign({}, d3Geo, d3Sel, require('d3-scale'))

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

    console.log(centers)


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


  render() {

    const { colorArr, nameArr } = this
    console.log(nameArr)
    return (
      <div className={style.container}>
        <div className={style.legend}>
          <ul>
            {nameArr.map((item, index) => {
              return (
                <li key={index}><i style={{ backgroundColor: colorArr[index] }}/><span>{item}</span></li>
              )
            })}
          </ul>
        </div>
        <div id='svg'></div>
      </div>
    )
  }
}



render(<DataV />, document.getElementById('root'))
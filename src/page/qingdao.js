import React from 'react'
import { render } from 'react-dom'
import * as d3Geo from 'd3-geo'
import * as d3Sel from 'd3-selection'
import qdJSON from '../json/370200.json'

import style from './qingdao.less'

const d3 = Object.assign({}, d3Geo, d3Sel, require('d3-scale'))

class DataV extends React.Component {

  constructor() {
    super()

    const width = 350, height = 400
    const projection = d3.geoMercator().center([120.4651, 36.3373]).scale(10000).translate([width / 1.7, height / 2])
    const path = d3.geoPath(projection)

    this.width = width
    this.height = height
    this.path = path
  }

  componentDidMount() {

    let arr = []
    for (let i = 0; i < 12; i++) {
      arr.push(Math.floor(Math.random() * 100))
    }
    console.log(arr)

    const linearScale = d3.scaleLinear().domain([0, 100]).range(['aliceblue', 'blue'])

    const svg = d3.select('body')
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
      .attr('d', this.path)
      .style("fill", (d, i) => linearScale(arr[i]))
      .each(function (d, i) {

      })

    // svg.selectAll('rect')
    //   .append('rect')
    //   .attr('width', 100)
    //   .attr('height', 100)
    //   .attr('x', 100)
    //   .attr('y', 30)
    //   .style('fill', '#fff')

  }


  render() {
    return (
      <div className={style.flex}>
        I'm data-v
        <div id='svg'></div>
      </div>
    )
  }
}



render(<DataV />, document.getElementById('root'))
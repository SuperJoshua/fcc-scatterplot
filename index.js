"use strict"

const req = new Request('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
fetch(req)
.then(res => res.json())
.then(res => {
   const h1_h = document.querySelector('#title').offsetHeight
   const w = window.innerWidth - h1_h
   const h = window.innerHeight - Math.floor(h1_h * 1.5)
   const pad = 40

   d3.select('body')
      .append('div')
      .attr('id', 'legend')
      .style('bottom', `${h1_h * 2}px`)
      .style('right', '0px')
      .html(`<ul>
         <li><div class='bullet'></div>Apparently dope-guiltless</li>
         <li><div class='bullet' style='background-color: red'></div>Dope-guilty</li>
         </ul>`)

   let tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('bottom', '0px')
      .style('right', '0px')

   const year_min = new Date(d3.min(res, d => d.Year), 0)
   const year_max = new Date(d3.max(res, d => d.Year), 0)
   const x_scale = d3.scaleTime([year_min, year_max], [pad, w - pad])
   const x_axis = d3.axisBottom(x_scale)

   const time_min = new Date(d3.min(res, d => d.Seconds * 1000))
   const time_max = new Date(d3.max(res, d => d.Seconds * 1000))
   const y_scale = d3.scaleTime([time_min, time_max], [h - pad, pad])
   const y_axis = d3.axisLeft(y_scale).tickFormat(d3.timeFormat('%M:%S'))

   let svg = d3.select('body')
      .append('svg')
         .attr('width', w)
         .attr('height', h)

   svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${h - pad})`)
      .call(x_axis)

   svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${pad}, 0)`)
      .call(y_axis)

   svg.selectAll('circle')
      .data(res)
      .enter()
      .append('circle')
         .attr('class', 'dot')
         .style('fill', d => d.Doping ? 'red' : 'black')
         .attr('data-xvalue', d => new Date(d.Year, 0))
         .attr('data-yvalue', d => new Date(d.Seconds * 1000))
         .attr('cx', d => x_scale(new Date(d.Year, 0)))
         .attr('cy', d => y_scale(new Date(d.Seconds * 1000)))
         .attr('r', 5)
         .on('mouseover', d => {
            tooltip.style('visibility', 'visible')
               .attr('data-year', new Date(d.Year, 0))
               .html(`<ul>
                  <li><h2>${d.Name}</h2></li>
                  <li><strong>${d.Doping ? d.Doping : '(clean?)'}</strong></li>
                  <li>Year: ${d.Year}</li>
                  <li>Placed: ${d.Place} @ ${d.Time}</li>
                  <li><i>${d.URL}</i></li>
                  </ul>`)
         })
         .on('mouseout', () => {
            tooltip.style('visibility', 'hidden')
         })
})

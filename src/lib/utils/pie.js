import * as d3 from 'd3';


let dataset = [
  { name: 'Direct', count: 2742 },
  { name: 'Facebook', count: 2242 },
  { name: 'Pinterest', count: 3112 },
  { name: 'Search', count: 937 },
  { name: 'Others', count: 1450 }
];

let total=0;

dataset.forEach(function(d){
  total+= d.count;
});

let pie=d3.layout.pie()
      .value(function(d){return d.count})
      .sort(null);

let w=300,h=300;

let outerRadiusArc=w/2;
let innerRadiusArc=100;
let shadowWidth=10;

let outerRadiusArcShadow=innerRadiusArc+1;
let innerRadiusArcShadow=innerRadiusArc-shadowWidth;

let color = d3.scale.ordinal()
.range(['#41B787', '#6352B9', '#B65480', '#D5735A', '#D7D9DA']);

let svg=d3.select("#chart")
      .append("svg")
      .attr({
          width:w,
          height:h,
          class:'shadow'
      }).append('g')
      .attr({
          transform:'translate('+w/2+','+h/2+')'
      });


let createChart=function(svg,outerRadius,innerRadius,fillFunction,className){

  let arc=d3.svg.arc()
          .innerRadius(outerRadius)
          .outerRadius(innerRadius);

  let path=svg.selectAll('.'+className)
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr({
              class:className,
              d:arc,
              fill:fillFunction
          });

  path.transition()
          .duration(1000)
          .attrTween('d', function(d) {
              let interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
              return function(t) {
                  return arc(interpolate(t));
              };
          });
};

createChart(svg,outerRadiusArc,innerRadiusArc,function(d,i){
  return color(d.data.name);
},'path1');

createChart(svg,outerRadiusArcShadow,innerRadiusArcShadow,function(d,i){
  let c=d3.hsl(color(d.data.name));
  return d3.hsl((c.h+5), (c.s -.07), (c.l -.15));
},'path2');

let addText= function (text,y,size) {
  svg.append('text')
          .text(text)
          .attr({
              'text-anchor':'middle',
              y:y
          })
          .style({
              fill:'#929DAF',
              'font-size':size
          });
};

let restOfTheData=function(){

  addText(function(){
      return numberWithCommas(total);
  },0,'30px');


  addText(function(){
      return "Page View";
  },25,'10px');

};

setTimeout(restOfTheData,1000);


function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
import TimeOfDayArea from '../components/TimeOfDayArea';

export default (sunData) => ({
  animate: true,
  margin: { top: 20, right: 150, bottom: 60, left: 80 },
  xScale: {
    type: 'time',
    format: '%Y-%m-%dT%H:%M:%S.%LZ',
    useUTC: true,
    precision: 'minute'
  },
  layers: ['grid', 'markers', 'axes', 'areas', TimeOfDayArea(sunData), 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends'],
  colors: ['#eba10e', '#0270a3'],
  xFormat: 'time:%m/%d %I:%M %p',
  yScale: {
    type: 'linear',
    min: 'auto',
    max: 'auto'
  },
  axisBottom: {
    format: '%m/%d %I:%M %p',
    tickValues: 'every 8 hour',
    legendOffset: -12,
  },
  enablePointLabel: false,
  useMesh: true,
  legends: [
    {
      anchor: 'bottom-right',
      direction: 'column',
      justify: false,
      translateX: 100,
      translateY: 0,
      itemsSpacing: 0,
      itemDirection: 'left-to-right',
      itemWidth: 80,
      itemHeight: 20,
      itemOpacity: 0.75,
      symbolSize: 12,
      symbolShape: 'circle',
      symbolBorderColor: 'rgba(0, 0, 0, .5)',
    }
  ]
});
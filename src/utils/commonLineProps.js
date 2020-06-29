import TimeOfDayArea from '../components/TimeOfDayArea';

export default (sunData) => ({
  animate: true,
  margin: { top: 20, right: 50, bottom: 60, left: 80 },
  xScale: {
    type: 'time',
    format: '%Y-%m-%dT%H:%M:%S.%LZ',
    useUTC: true,
    precision: 'minute'
  },
  layers: ['grid', 'markers', 'axes', 'areas', TimeOfDayArea(sunData), 'crosshair', 'lines', 'points', 'slices', 'mesh', 'legends'],
  colors: '#eba10e',
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
  useMesh: true
});
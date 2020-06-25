import React from 'react';
import moment from 'moment';
import memoize from 'lodash.memoize';
import { area } from 'd3-shape';
import { Defs } from '@nivo/core'

const TimeOfDayArea = (sunData) => ({ series, xScale, yScale, innerHeight }) => {
  const data = [];
  const dataSeries = series[0].data;

  const sunDataCache = memoize((date) => {
    const startOfDay = moment(date).startOf('day');
    if (sunData[startOfDay]) {
      const { sunrise, sunset } = sunData[startOfDay];
      return {
        sunriseHr: moment(sunrise).hour(),
        sunsetHr: moment(sunset).hour(),
      }
    }

    return {
      sunriseHr: 7,
      sunsetHr: 19,
    }
  }, (date) => `${date.year()}-${date.month()}-${date.day()}`);

  let isDayTime = undefined;
  let currentAreaSet = [];
  for (let i = 0; i < dataSeries.length; i++) {
    const currentDateTime = moment(dataSeries[i].data.x);
    const { sunriseHr, sunsetHr } = sunDataCache(currentDateTime);
    const isCurrentDateDayTime = currentDateTime.hour() >= sunriseHr && currentDateTime.hour() < sunsetHr;
    
    if (typeof isDayTime !== 'undefined' && isCurrentDateDayTime !== isDayTime) {
      data.push({ isDayTime, series: [...currentAreaSet, dataSeries[i]] });
      currentAreaSet = [];
    }
    
    isDayTime = isCurrentDateDayTime;
    currentAreaSet.push(dataSeries[i]);
  }

  if (currentAreaSet.length) {
    data.push({ isDayTime, series: [...currentAreaSet] });
  }

  const areaGenerator = area()
    .x(d => xScale(d.data.x))
    .y0(() => innerHeight)
    .y1(d => yScale(d.data.y));

    return (
      <>
          <Defs
              defs={[
                  {
                      id: 'NightTime',
                      type: 'patternLines',
                      background: 'transparent',
                      color: '#0000FF',
                      lineWidth: 1,
                      spacing: 10,
                      rotation: -45,
                  },
                  {
                      id: 'DayTime',
                      type: 'patternLines',
                      background: 'transparent',
                      color: '#FF0000',
                      lineWidth: 1,
                      spacing: 10,
                      rotation: -45,
                  }
              ]}
          />
          {
            data.map(({ isDayTime, series }, idx) => (
              <path
                  key={idx}
                  d={areaGenerator(series)}
                  fill={`url(#${isDayTime ? 'DayTime' : 'NightTime'})`}
                  fillOpacity={0.3}
              />
            ))
          }
      </>
  )
};

export default TimeOfDayArea;
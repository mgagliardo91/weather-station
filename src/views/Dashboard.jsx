import React from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';
import {  Spinner } from 'react-bootstrap';
import { useTemperature, useHumidity, usePressure } from '../api/sensorData';
import commonLineProps from '../utils/commonLineProps';
import useSunData from '../api/sunData';

const timeStart = moment('2020-06-25T19:00:00-0500').toDate();

const Dashboard = () => {
  const temperatureData = useTemperature({ window: 900, timeStart });
  const pressureData = usePressure({ window: 900, timeStart });
  const humidityData = useHumidity({ window: 900, timeStart });
  const sunData = useSunData({ timeStart });

  if (!temperatureData || !pressureData || !humidityData) {
    return (
      <div className="text-center my-5">
        <Spinner animation="grow" className="mr-2" /> Loading Sensor Data
      </div>
    )
  }

  if (!sunData) {
    return (
      <div className="text-center my-5">
        <Spinner animation="grow" className="mr-2" /> Loading Sun Data
      </div>
    )
  }

  return (
    <div className="text-center my-5">
      <div className="w-100" style={{height: '500px'}}>
        <ResponsiveLine
          { ...commonLineProps(sunData) }
          data={[
            { id: 'Temperature', data: temperatureData }
          ]}
          yScale={{
            type: 'linear',
            min: 50,
            max: 100
          }}
          axisLeft={{
            legend: 'Temperature (°F)',
            legendOffset: -50,
            legendPosition: 'middle'
          }} />
      </div>
      <div className="w-100" style={{height: '500px'}}>
        <ResponsiveLine
          { ...commonLineProps(sunData) }
          data={[
            { id: 'Humidity', data: humidityData }
          ]}
          yScale={{
            type: 'linear',
            min: 0,
            max: 100
          }}
          axisLeft={{
            legend: 'Humidity (%)',
            legendOffset: -50,
            legendPosition: 'middle'
          }} />
      </div>
      <div className="w-100" style={{height: '500px'}}>
        <ResponsiveLine
          { ...commonLineProps(sunData) }
          data={[
            { id: 'Pressure', data: pressureData }
          ]}

          yScale={{
            type: 'linear',
            min: 1005,
            max: 1020
          }}
          axisLeft={{
            legend: 'Pressure (hPa)',
            legendOffset: -50,
            legendPosition: 'middle'
          }} />
      </div>
    </div>
  );
};

export default Dashboard;
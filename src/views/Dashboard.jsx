import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { ResponsiveLine } from '@nivo/line';
import {  Spinner, Container, Row, Col, Card } from 'react-bootstrap';
import { useTemperature, useHumidity, usePressure } from '../api/sensorData';
import commonLineProps from '../utils/commonLineProps';
import useSunData from '../api/sunData';
import useWeatherData from '../api/weatherData';

const timeStart = moment('2020-06-25T19:00:00-0500').toDate();

const fetchParams = {
  window: 3600,
  timeStart
};

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(moment());
  const { feedData: temperatureData, liveData: tempLive, lastUpdate: tempLastUpdate } = useTemperature(fetchParams);
  const { feedData: pressureData, liveData: pressLive, lastUpdate: pressLastUpdate } = usePressure(fetchParams);
  const { feedData: humidityData, liveData: humidLive, lastUpdate: humidLastUpdate } = useHumidity(fetchParams);
  const sunData = useSunData(timeStart);
  const weatherData = useWeatherData(timeStart);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(moment());
    }

    let id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

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

  if (!weatherData) {
    return (
      <div className="text-center my-5">
        <Spinner animation="grow" className="mr-2" /> Loading Weather Data
      </div>
    )
  }

  const summaryItems = [
    {
      data: tempLive,
      unit: '°F',
      ow: weatherData.temperatureData[weatherData.temperatureData.length - 1].y,
      title: 'Temperature',
      updatedAt: tempLastUpdate
    },
    {
      data: humidLive,
      unit: '%',
      ow: weatherData.humidityData[weatherData.humidityData.length - 1].y,
      title: 'Humidity',
      updatedAt: pressLastUpdate
    },
    {
      data: pressLive,
      unit: 'hPa',
      ow: weatherData.pressureData[weatherData.pressureData.length - 1].y,
      title: 'Pressure',
      updatedAt: humidLastUpdate
    }
  ];

  return (
    <div className="text-center my-5">
      <Container>
        <Row>
          {
            summaryItems.map(({ title, data, unit, ow, updatedAt }) => {
              const updateIn = 30 - currentTime.diff(updatedAt, 'seconds');
              return (
                <Col key={unit}>
                  <Card>
                    <Card.Header as="h4">{ title }</Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="d-flex flex-column mb-3">
                          <div style={{marginBottom: '-0.5em'}}>Sensor</div>
                          <div className="d-flex align-items-center">
                            <div style={{ fontSize: '2em', fontWeight: 'bold'}}>{ data ? data : '-' }</div>
                            <div className="ml-3" style={{fontWeight: 'normal', fontSize: '1.3em'}}>{ unit }</div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="d-flex flex-column">
                          <div style={{marginBottom: '-0.5em'}}>Open Weather</div>
                          <div className="d-flex align-items-center">
                            <div style={{ fontSize: '2em', fontWeight: 'bold'}}>{ ow ? ow : '-' }</div>
                            <div className="ml-3" style={{fontWeight: 'normal', fontSize: '1.3em'}}>{ unit }</div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                    <Card.Footer style={{fontSize: '0.8em'}} className="font-italic py-1">{
                        updateIn > 1 ? `Next update in ${30 - currentTime.diff(updatedAt, 'seconds')} seconds` : <Spinner size="sm" animation="grow" />
                      }</Card.Footer>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
      </Container>
      <div className="w-100" style={{height: '500px'}}>
        <ResponsiveLine
          { ...commonLineProps(sunData) }
          data={[
            { id: 'Open Weather', data: weatherData.temperatureData },
            { id: 'Sensor', data: temperatureData }
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
            { id: 'Open Weather', data: weatherData.humidityData },
            { id: 'Sensor', data: humidityData }
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
            { id: 'Open Weather', data: weatherData.pressureData },
            { id: 'Sensor', data: pressureData }
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
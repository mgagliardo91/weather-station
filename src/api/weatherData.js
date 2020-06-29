import { useEffect, useState, useMemo } from 'react';
import moment from 'moment';
import axios from 'axios';

const fetchWeatherData = async (date) => {
  const weatherData = await axios({
    url: `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=35.77303&lon=-78.619460&type=hour&dt=${moment(date).unix()}&units=imperial&appid=a891966ce2cdbbdfd3202cc6899a4363`,
    method: 'GET'
  });

  const { hourly } = weatherData.data;
  return hourly;
}

const defaultTimeStart = moment().subtract(1, 'days').toDate();
const defaultTimeEnd = moment().toDate();

const useWeatherData = (timeStart = defaultTimeStart, timeEnd = defaultTimeEnd) => {
  const [weatherData, setWeatherData] = useState();

  const dateList = useMemo(() => {
    let date = moment(timeStart).startOf('day');
    const endDate = moment(timeEnd).endOf('day');
    const dates = [];
    while (date.isBefore(endDate)) {
      dates.push(moment(date));
      date = date.add(1, 'day');
    }

    return dates;
  }, [timeStart, timeEnd]);

  useEffect(() => {
    const getWeatherData = async () => {
      const weatherData = (await Promise.all(dateList.map(date => fetchWeatherData(date)))).reduce((acc, data) => [
        ...acc,
        ...data
      ], []);

      const merged = weatherData.reduce((acc, hourly) => {
        const hour = moment.unix(hourly.dt);
        if (hour.isBefore(timeStart)) {
          return acc;
        } else if (hour.isAfter(timeEnd)) {
          return acc;
        }

        const timeUnix = hour.toISOString();
        acc.temperatureData.push({ x: timeUnix, y: hourly.temp.toFixed(2) });
        acc.pressureData.push({ x: timeUnix, y: hourly.pressure.toFixed(2) });
        acc.humidityData.push({ x: timeUnix, y: hourly.humidity.toFixed(2) });
        return acc;
      }, { temperatureData: [], pressureData: [], humidityData: []});
      setWeatherData(merged);
    };

    getWeatherData();
  }, [dateList]);

  return weatherData;
};

export default useWeatherData;
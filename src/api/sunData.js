import { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

const fetchSunData = async (date) => {
  const sunData = await axios({
    url: `https://api.sunrise-sunset.org/json?lat=35.773030&lng=-78.619460&formatted=0&date=${date.format('YYYY-MM-DD')}`,
    method: 'GET'
  });
  const { results: { sunrise, sunset }} = sunData.data;

  return {
    sunrise,
    sunset
  };
};

const defaultTimeStart = moment().subtract(1, 'days').toDate();
const defaultTimeEnd = moment().toDate();

const useSunData = (timeStart = defaultTimeStart, timeEnd = defaultTimeEnd) => {
  const [sunData, setSunData] = useState();

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
    if (!dateList || !dateList.length) {
      return;
    }

    const getSunData = async () => {
      const sunData = await Promise.all(dateList.map(date => fetchSunData(date)));
      setSunData(dateList.reduce((acc, date, idx) => {
        return {
          ...acc,
          [date]: sunData[idx]
        }
      }, {}));
    }

    getSunData();
  }, [dateList]);

  return sunData;
};

export default useSunData;
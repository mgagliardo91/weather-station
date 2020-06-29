import { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { useFeedOutput } from './feedData';

const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    tick();
    return () => clearInterval(id);
  }, [delay]);
}

const useFormatOutput = (fieldName, config) => {
  const [liveData, setLiveData] = useState();
  const { feedOutput, fetchOutput } = useFeedOutput(fieldName, config);
  const [feedData, setFeedData] = useState();

  useEffect(() => {
    if (feedOutput) {
      const data = feedOutput.records.reduce((acc, { event_time: eventTime, value}) => ([
        ...acc,
        { x: eventTime, y: parseFloat(value).toFixed(2) }
      ]), []) || [];
      setFeedData(data);
    }
  }, [feedOutput]);

  useInterval(async () => {
    if (!feedData) {
      return;
    }

    let timeStart = moment();
    if (feedOutput) {
      timeStart = moment(feedData[0].x);
    }

    const data = await fetchOutput({
      timeStart: timeStart.toDate(),
      timeEnd: moment().toDate()
    });

    if (!data.records.length) {
      return;
    }

    const initValue = data.records.splice(-1,1)[0];

    if (feedData[0].x === initValue.event_time) {
      feedData[0].y = parseFloat(initValue.value).toFixed(2)
    }

    setFeedData([
      ...data.records.reduce((acc, { event_time: eventTime, value}) => ([
        ...acc,
        { x: eventTime, y: parseFloat(value).toFixed(2) }
      ]), []),
      ...feedData
    ]);
  }, 30000);

  useInterval(async () => {
    const data = await await fetchOutput({
      timeStart: moment().subtract(1, 'minutes').toDate(),
      timeEnd: moment().toDate(),
      window: 0
    });

    setLiveData(data.records.length ? parseFloat(data.records[0].value).toFixed(2) : feedData[0].y)
  }, 30000);

  return {
    feedData,
    liveData
  }
};

export const useTemperature = (feedOutputProps = {}) => useFormatOutput('temp', feedOutputProps);
export const usePressure = (feedOutputProps = {}) => useFormatOutput('press', feedOutputProps);
export const useHumidity = (feedOutputProps = {}) => useFormatOutput('humid', feedOutputProps);
import { useMemo } from 'react';
import { useFeedOutput } from './feedData';

const useFormatOutput = (fieldName, feedOutputProps = {}) => {
  const { feedOutput } = useFeedOutput({ fieldName, ...feedOutputProps });

  const temperatureData = useMemo(() => {
    if (feedOutput) {
      return feedOutput.records.reduce((acc, { event_time: eventTime, value}) => ([
        ...acc,
        { x: eventTime, y: parseFloat(value).toFixed(2) }
      ]), []) || [];
    }

    return undefined;
  }, [feedOutput]);

  return temperatureData;
};

export const useTemperature = (feedOutputProps = {}) => useFormatOutput('temp', feedOutputProps);
export const usePressure = (feedOutputProps = {}) => useFormatOutput('press', feedOutputProps);
export const useHumidity = (feedOutputProps = {}) => useFormatOutput('humid', feedOutputProps);
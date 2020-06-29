import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAccessToken } from '../components/Authentication';

const emptyProps = {};

const executeFetch = (accessToken, { path, ...axiosConfig}) => axios({
  url: `https://feeds.api.ndustrial.io/v1/${path}`,
  headers: {
    Authorization: `Bearer ${accessToken}`
  },
  ...axiosConfig
});

export const useFeedOutput = (fieldName, config = emptyProps) => {
  const [loading, setLoading] = useState(true);
  const accessToken = useAccessToken();
  const [feedOutput, setFeedOutput] = useState();

  const fetchOutput = useCallback(async ({
    timeStart = moment().subtract(1, 'days').toDate(),
    timeEnd = moment().toDate(),
    window = config.window || 60
   }) => {
    return await executeFetch(accessToken, {
      path: `outputs/9891/fields/${fieldName}/data?timeStart=${moment(timeStart).unix()}&timeEnd=${moment(timeEnd).unix()}&window=${window}`,
      method: 'GET'
    }).then(resp => resp.data);
  }, [fieldName, accessToken, config]);

  useEffect(() => {
    if (feedOutput) {
      return;
    }

    fetchOutput(config)
    .then(data => {
      setFeedOutput(data);
      setLoading(false)
    });
  }, [fetchOutput, config, feedOutput]);

  return {
    loading,
    feedOutput,
    fetchOutput
  }
};
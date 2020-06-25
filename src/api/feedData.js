import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useAccessToken } from '../components/Authentication';

const executeFetch = (accessToken, { path, ...axiosConfig}) => axios({
  url: `https://feeds.api.ndustrial.io/v1/${path}`,
  headers: {
    Authorization: `Bearer ${accessToken}`
  },
  ...axiosConfig
});

export const useFeedInfo = () => {
  const [loading, setLoading] = useState(true);
  const accessToken = useAccessToken();
  const [feedInfo, setFeedInfo] = useState();

  useEffect(() => {
    if (feedInfo) {
      return;
    }

    executeFetch(accessToken, {
      path: 'feeds/1203/outputs',
      method: 'GET'
    }).then(resp => {
      setFeedInfo(resp.data);
      setLoading(false);
    });
  }, []);

  return {
    loading,
    feedInfo
  }
};

export const useFeedOutput = ({
  outputId = '9891',
  fieldName,
  timeStart = moment().subtract(1, 'days').toDate(),
  timeEnd = moment().toDate(),
  window = 60
}) => {
  const [loading, setLoading] = useState(true);
  const accessToken = useAccessToken();
  const [feedOutput, setFeedOutput] = useState();

  useEffect(() => {
    if (feedOutput) {
      return;
    }

    executeFetch(accessToken, {
      path: `outputs/${outputId}/fields/${fieldName}/data?timeStart=${moment(timeStart).unix()}&timeEnd=${moment(timeEnd).unix()}&window=${window}`,
      method: 'GET'
    }).then(resp => {
      setFeedOutput(resp.data);
      setLoading(false)
    });
  }, []);

  return {
    loading,
    feedOutput
  }
};
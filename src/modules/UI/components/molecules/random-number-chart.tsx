'use client';

import { Box, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export const RandomNumberChart = () => {
  const [timesGenerated, setTimesGenerated] = useState(0);
  const [countNumbers, setCountNumbers] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  });

  const [chartData, setChartData] = useState<{
    xAxisData: number[];
    seriesData: number[];
  }>({
    xAxisData: [1],
    seriesData: [0],
  });
  const [isPaused, setIsPaused] = useState(false);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isPaused) return;
      const randomNumber = Math.round(Math.random() * 100);
      setTimesGenerated(prevState => prevState + 1);

      if (Object.keys(countNumbers).includes(randomNumber.toString())) {
        setCountNumbers(prevState => ({
          ...prevState,
          [randomNumber]: prevState[randomNumber as keyof typeof prevState] + 1,
        }));
      }

      setChartData(prevData => {
        if (prevData.xAxisData.length > 50) {
          return {
            xAxisData: prevData.xAxisData.slice(-50),
            seriesData: prevData.seriesData.slice(-50),
          };
        }
        return prevData;
      });

      setChartData(prevData => ({
        xAxisData: [
          ...prevData.xAxisData,
          prevData.xAxisData[prevData.xAxisData.length - 1] + 1,
        ],
        seriesData: [...prevData.seriesData, randomNumber],
      }));
    }, 200);

    return () => clearInterval(intervalId);
  }, [chartData.seriesData, countNumbers, isPaused]);

  useEffect(() => {
    if (timesGenerated === 20) {
      handlePause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timesGenerated]);

  return (
    <Box sx={{ width: '100%', color: 'black', backgroundColor: 'white' }}>
      <h2>Random Number Chart: 50 numbers generated at 200ms</h2>
      <LineChart
        xAxis={[{ data: chartData.xAxisData }]}
        series={[
          {
            data: chartData.seriesData,
          },
        ]}
        height={300}
      />
      <Box sx={{ gap: 2 }}>
        <Button onClick={() => handlePause()}>
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button
          onClick={() => {
            setChartData({ xAxisData: [1], seriesData: [0] });
            setCountNumbers({ 1: 0, 2: 0, 3: 0, 4: 0 });
            setTimesGenerated(0);
          }}
        >
          Reset
        </Button>
        <Box>
          Frequency of numbers: <b>1</b>: {countNumbers[1]}, <b>2</b>:{' '}
          {countNumbers[2]}, <b>3</b>: {countNumbers[3]}, <b>4</b>:{' '}
          {countNumbers[4]}
        </Box>
        <Box>Times genrated: {timesGenerated}</Box>
      </Box>
    </Box>
  );
};

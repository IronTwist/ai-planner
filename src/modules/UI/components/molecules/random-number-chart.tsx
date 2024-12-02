'use client';

import { Box, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

export const RandomNumberChart = () => {
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
  }, [chartData.seriesData, isPaused]);

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
      <Button onClick={() => handlePause()}>
        {isPaused ? 'Resume' : 'Pause'}
      </Button>
      <Button onClick={() => setChartData({ xAxisData: [1], seriesData: [0] })}>
        Reset
      </Button>
    </Box>
  );
};

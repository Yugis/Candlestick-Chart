import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import axios from 'axios';
import './index.css'

const CandlestickChart = () => {
  const [data, setData] = useState([]);
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleIntervalChange = (event) => {
    setSelectedInterval(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const crumb = 'GL62xnqEJFo';

      const proxyApiUrl = 'http://localhost:5000/api/finance';

      axios.get(proxyApiUrl, {
        params: {
          ticker: 'SPUS',
          fromTimestamp: Math.floor(moment().subtract(1, 'year').valueOf() / 1000),
          toTimestamp: Math.floor(moment().valueOf() / 1000),
          interval: selectedInterval,
          crumb: crumb
        }
      })
        .then((response) => {
          const csvData = response.data;
          const parsedData = parseCsvData(csvData);
          setData(parsedData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });

    };

    fetchData();
  }, [selectedInterval, startDate, endDate]);

  const parseCsvData = (csvData) => {
    const lines = csvData.split('\n').slice(1);
    const parsedData = lines.map((line) => {
      const [date, open, high, low, close] = line.split(',').map((value) => parseFloat(value));
      return [moment(date).valueOf(), open, high, low, close];
    });

    return parsedData;
  };

  const options = {
    chart: {
      type: 'candlestick',
      height: 400,
    },
    series: [
      {
        data: data,
      },
    ],
    xaxis: {
      type: 'datetime',
    },
    title: {
      text: 'Yahoo Finance'
    },
  };

  return (
    <>
      <div style={{ padding: 10 }}>
        <div className='user-input-container'>
          <label className='user-input-label'>Select Interval:</label>
          <select className='user-input-select' value={selectedInterval} onChange={handleIntervalChange}>
            <option value="1d">Day</option>
            <option value="1wk">Week</option>
            <option value="1mo">Month</option>
          </select>

          <div className='user-input-date-container'>
            <label className='user-input-label'>Select Start Date:</label>
            <input type="date" className='user-input-date user-input-start-date' value={startDate} onChange={handleStartDateChange} />

            <label className='user-input-label'>Select End Date:</label>
            <input type="date" className='user-input-date user-input-end-date' value={endDate} onChange={handleEndDateChange} />
          </div>
        </div>

        <div>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
      </div>
    </>
  );
};

export default CandlestickChart;

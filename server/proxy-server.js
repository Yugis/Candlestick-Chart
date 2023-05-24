import express from 'express';
import axios from 'axios';

const app = express();
const port = 5000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.get('/api/finance', async (req, res) => {
  const { ticker, fromTimestamp, toTimestamp, interval, crumb } = req.query;
  const apiUrl = `https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=${fromTimestamp}&period2=${toTimestamp}&interval=${interval}&events=history&crumb=${crumb}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'text' });
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});

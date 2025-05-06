require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Basic middleware
app.use(express.json());

// Proxy endpoint for Smoobu availability check
app.post('/api/check-availability', async (req, res) => {
  try {
    const response = await axios.post(
      'https://login.smoobu.com/booking/checkApartmentAvailability',
      req.body,
      {
        headers: {
          'Api-Key': process.env.SMOOBU_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Proxy endpoint for Smoobu apartment details
app.get('/api/room-details/:apartmentId', async (req, res) => {
  try {
    const { apartmentId } = req.params;
    if (!Number.isInteger(Number(apartmentId))) {
      return res.status(400).json({ error: 'Invalid apartment ID' });
    }

    const response = await axios.get(
      `https://login.smoobu.com/api/apartments/${apartmentId}`,
      {
        headers: {
          'Api-Key': process.env.SMOOBU_API_KEY
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://*.vercel.app',
    'https://bokoboko.org',
    'https://www.bokoboko.org'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
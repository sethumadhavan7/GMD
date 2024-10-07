const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string (Updated)
const mongoURI = 'mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/gasmonitoring?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB Atlas connected!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define a schema for gas data
const gasDataSchema = new mongoose.Schema({
  co2: { type: Number, required: true },
  so2: { type: Number, required: true },
  nox: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create a model for gas data
const GasData = mongoose.model('GasData', gasDataSchema);

// Endpoint to receive gas data from ESP8266
app.post('/api/gas-data', async (req, res) => {
  try {
    const gasData = new GasData(req.body);
    await gasData.save();
    console.log('Received gas data:', gasData);
    res.status(200).send('Data received and stored');
  } catch (error) {
    console.error('Error saving gas data:', error);
    res.status(500).send('Error saving data');
  }
});

// Endpoint to send gas data to the frontend
app.get('/api/gas-data', async (req, res) => {
  try {
    const data = await GasData.findOne().sort({ timestamp: -1 }); // Get the most recent data
    res.json(data);
  } catch (error) {
    console.error('Error fetching gas data:', error);
    res.status(500).send('Error fetching data');
  }
});

// Start the server (Handle for Vercel)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;  // Use the port from environment variables or default to 5000

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection (Using your connection string)
mongoose.connect('mongodb+srv://sethu:1234@cluster0.dbntwx8.mongodb.net/gasmonitoring?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Define the gas data schema
const gasDataSchema = new mongoose.Schema({
    co2: { type: Number, required: true },
    so2: { type: Number, required: true },
    nox: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

// Create the GasData model
const GasData = mongoose.model('GasData', gasDataSchema);

// Define a root route for the backend (Optional)
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Gas Monitoring API</h1><p>Use /api/gas-data to get or post gas data.</p>');
});

// Route to receive gas data from the client (e.g., ESP8266 or IoT device)
app.post('/api/gas-data', async (req, res) => {
    try {
        const gasData = new GasData(req.body);
        await gasData.save(); // Save the data to MongoDB
        console.log('Received gas data:', gasData);
        res.status(200).send('Data received and stored successfully');
    } catch (error) {
        console.error('Error saving gas data:', error);
        res.status(500).send('Error saving gas data');
    }
});

// Route to fetch the most recent gas data
app.get('/api/gas-data', async (req, res) => {
    try {
        const data = await GasData.findOne().sort({ timestamp: -1 }); // Get the latest gas data
        if (data) {
            res.json(data);
        } else {
            res.status(404).send('No gas data found');
        }
    } catch (error) {
        console.error('Error fetching gas data:', error);
        res.status(500).send('Error fetching gas data');
    }
});

// Catch-all route for undefined paths
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

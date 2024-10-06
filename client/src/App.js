import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the necessary components from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [data, setData] = useState({
    co2: 0,
    so2: 0,
    nox: 0,
  });

  const [alerts, setAlerts] = useState({
    co2: '',
    so2: '',
    nox: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use your deployed backend URL
        const response = await axios.get('https://gmd-serverapi.vercel.app/api/gas-data');
        const { co2, so2, nox } = response.data;
        setData({ co2, so2, nox });

        const newAlerts = {
          co2: co2 > 1000 ? 'CO2 concentration is HIGH!' : 'CO2 concentration is NORMAL.',
          so2: so2 > 5 ? 'SO2 concentration is HIGH!' : 'SO2 concentration is NORMAL.',
          nox: nox > 10 ? 'NOx concentration is HIGH!' : 'NOx concentration is NORMAL.',
        };

        setAlerts(newAlerts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const generateChartData = (label, value) => {
    return {
      labels: ['Time 1', 'Time 2', 'Time 3'], // Example time data
      datasets: [
        {
          label,
          data: [value - 5, value, value + 3], // Example data for the graph
          fill: true,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
        },
      ],
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gas Monitoring Dashboard</h1>
        <div className="data-container">
          {/* CO2 Section */}
          <div className="data-item">
            <h2>CO2 Concentration</h2>
            <p>{data.co2.toFixed(2)} ppm</p>
            <p className={`alert ${alerts.co2.includes('HIGH') ? 'alert-high' : 'alert-normal'}`}>
              {alerts.co2}
            </p>
            <div className="chart-container">
              <Line data={generateChartData('CO2', data.co2)} />
            </div>
          </div>

          {/* SO2 Section */}
          <div className="data-item">
            <h2>SO2 Concentration</h2>
            <p>{data.so2.toFixed(2)} ppm</p>
            <p className={`alert ${alerts.so2.includes('HIGH') ? 'alert-high' : 'alert-normal'}`}>
              {alerts.so2}
            </p>
            <div className="chart-container">
              <Line data={generateChartData('SO2', data.so2)} />
            </div>
          </div>

          {/* NOx Section */}
          <div className="data-item">
            <h2>NOx Concentration</h2>
            <p>{data.nox.toFixed(2)} ppm</p>
            <p className={`alert ${alerts.nox.includes('HIGH') ? 'alert-high' : 'alert-normal'}`}>
              {alerts.nox}
            </p>
            <div className="chart-container">
              <Line data={generateChartData('NOx', data.nox)} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

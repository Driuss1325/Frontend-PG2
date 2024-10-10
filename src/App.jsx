// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { AppBar, Toolbar, Typography, Box, Container, Paper, Button } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');
    
    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      setTemperatureData(prevData => [...prevData, data.temperature]);
      setHumidityData(prevData => [...prevData, data.humidity]);
      setTimestamps(prevData => [...prevData, data.timestamp]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const data = {
    labels: timestamps,
    datasets: [
      {
        label: 'Temperatura Ambiente',
        data: temperatureData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Humedad',
        data: humidityData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperatura Ambiente y Humedad',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Monitoreo Ambiental
          </Typography>
          <Button color="inherit">Inicio</Button>
          <Button color="inherit">Alertas</Button>
          <Button color="inherit">Gestion</Button>
          <Button color="inherit">Contacto</Button>
          <Button color="inherit">Analisis</Button>
          <Button color="inherit">Monitoreo</Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Monitoreo de Calidad del Aire e Incendios
            </Typography>
            <Line data={data} options={options} />
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default App;

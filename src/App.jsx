import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { AppBar, Toolbar, Typography, Box, Container, Paper, Button, Grid } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const App = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [pm25Data, setPm25Data] = useState([]);
  const [pm10Data, setPm10Data] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3000/events');

    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      setTemperatureData(prevData => [...prevData, data.temperature]);
      setHumidityData(prevData => [...prevData, data.humidity]);
      setPm25Data(prevData => [...prevData, data.pm25]);
      setPm10Data(prevData => [...prevData, data.pm10]);
      setTimestamps(prevData => [...prevData, data.timestamp]);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Función para crear la estructura de datos para los gráficos
  const createChartData = (label, data, borderColor, backgroundColor) => ({
    labels: timestamps,
    datasets: [
      {
        label,
        data,
        borderColor,
        backgroundColor,
        fill: true,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monitoreo de Sensores',
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
          <Typography variant="h4" align="center" gutterBottom>
            Monitoreo de Calidad del Aire e Incendios
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" align="center">
                  Temperatura Ambiente
                </Typography>
                <Line data={createChartData('Temperatura', temperatureData, 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)')} options={options} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" align="center">
                  Humedad Relativa
                </Typography>
                <Line data={createChartData('Humedad', humidityData, 'rgba(255, 99, 132, 1)', 'rgba(255, 99, 132, 0.2)')} options={options} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" align="center">
                  Partículas PM2.5
                </Typography>
                <Line data={createChartData('PM2.5', pm25Data, 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)')} options={options} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h6" align="center">
                  Partículas PM10
                </Typography>
                <Line data={createChartData('PM10', pm10Data, 'rgba(255, 159, 64, 1)', 'rgba(255, 159, 64, 0.2)')} options={options} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default App;

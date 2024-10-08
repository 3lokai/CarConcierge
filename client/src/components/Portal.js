import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, CardMedia } from '@material-ui/core';
import axios from 'axios';

function Portal() {
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    interior: ''
  });
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/cars/search', searchParams, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
    fetchCars();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Car Search Portal</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Object.keys(searchParams).map((param) => (
            <Grid item xs={12} sm={6} key={param}>
              <TextField
                fullWidth
                label={param.charAt(0).toUpperCase() + param.slice(1)}
                name={param}
                value={searchParams[param]}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Search
        </Button>
      </form>

      <Typography variant="h5" style={{ marginTop: '2rem' }}>Results</Typography>
      <Grid container spacing={3}>
        {results.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={car.image}
                alt={`${car.year} ${car.make} ${car.model}`}
              />
              <CardContent>
                <Typography variant="h6">{car.year} {car.make} {car.model}</Typography>
                <Typography>Color: {car.color}</Typography>
                <Typography>Interior: {car.interior}</Typography>
                <Typography>Price: ${car.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Portal;
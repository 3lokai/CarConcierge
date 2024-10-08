import React from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@material-ui/core';

function LandingPage() {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Welcome to Car Concierge Service
      </Typography>
      
      {/* Hero Section */}
      <div style={{ height: '400px', background: 'url(https://source.unsplash.com/random/1600x900?car) center/cover', marginBottom: '2rem' }} />

      {/* Benefits Section */}
      <Typography variant="h4" gutterBottom>Benefits</Typography>
      <Grid container spacing={3}>
        {['Expert Guidance', 'Time Saving', 'Best Deals'].map((benefit) => (
          <Grid item xs={12} sm={4} key={benefit}>
            <Card>
              <CardContent>
                <Typography variant="h6">{benefit}</Typography>
                <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Testimonials Section */}
      <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>Testimonials</Typography>
      <Grid container spacing={3}>
        {['John D.', 'Jane S.', 'Mike R.'].map((name) => (
          <Grid item xs={12} sm={4} key={name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
                <Typography>"Great service! Found my dream car at an amazing price."</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* How It Works Section */}
      <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>How It Works</Typography>
      <ol>
        <li>Sign up and tell us about your dream car</li>
        <li>Our experts search through auctions</li>
        <li>We present you with the best options</li>
        <li>You choose, we handle the rest</li>
      </ol>

      {/* Talk to Us Section */}
      <Typography variant="h4" gutterBottom style={{ marginTop: '2rem' }}>Talk to Us</Typography>
      <Typography>
        Have questions? Contact us at info@carconcierge.com or call 1-800-CAR-FIND
      </Typography>
    </Container>
  );
}

export default LandingPage;
import React from 'react';
import { Typography, Container } from '@material-ui/core';

function Footer() {
  return (
    <footer style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
      <Container>
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} Car Concierge Service. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}

export default Footer;
import React from "react";
import { Button, Box, Typography, Container, Stack } from "@mui/material";

export default function Home({ onStart, onHistory, onUserDetails }) {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Welcome
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please choose an option below:
        </Typography>
        <Stack spacing={3} direction="column" sx={{ mt: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={onStart}
          >
            Start New Calculation
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            size="large" 
            onClick={onHistory}
          >
            Check History
          </Button>
          <Button 
            variant="outlined" 
            color="info" 
            size="large" 
            onClick={onUserDetails}
          >
            User Details
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

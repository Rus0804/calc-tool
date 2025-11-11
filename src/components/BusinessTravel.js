import React, { useState } from "react";
import { businessTravelFactors } from "../data/emissionFactors";
import { TextField, MenuItem, Button, Box, Typography, Alert } from "@mui/material";

export default function BusinessTravel({ onResult }) {
  const [mode, setMode] = useState(Object.keys(businessTravelFactors)[0]);
  const [distance, setDistance] = useState("");
  const [error, setError] = useState("");

  function handleCalculate() {
    if (distance === "" || isNaN(distance) || Number(distance) < 0) return setError("Enter valid distance in miles");
    setError("");
    const co2e = (Number(distance) * businessTravelFactors[mode]) / 1000; // to metric tons
    onResult({ co2e });
  }

  return (
    <Box sx={{ p:2 }}>
      <Typography variant="h6">Business Travel</Typography>
      <TextField select value={mode} onChange={e => setMode(e.target.value)} sx={{ mr:2, mb:2 }}>
        {Object.keys(businessTravelFactors).map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </TextField>
      <TextField label="Distance (miles)" type="number" value={distance} onChange={e => setDistance(e.target.value)} sx={{ mr:2, mb:2 }}/>
      <Button variant="contained" onClick={handleCalculate}>Calculate</Button>
      {error && <Alert sx={{ mt:2 }} severity="error">{error}</Alert>}
    </Box>
  );
}

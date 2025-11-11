import React, { useState } from "react";
import { steamFactors } from "../data/emissionFactors";
import { TextField, MenuItem, Button, Box, Typography, Alert } from "@mui/material";

export default function Steam({ onResult }) {
  const [source, setSource] = useState(Object.keys(steamFactors)[0]);
  const [qty, setQty] = useState("");
  const [error, setError] = useState("");

  function handleCalculate() {
    if (qty === "" || isNaN(qty) || Number(qty) < 0) return setError("Enter valid consumption in MMBtu");
    setError("");
    const co2e = Number(qty) * steamFactors[source];
    onResult({ co2e });
  }

  return (
    <Box sx={{ p:2 }}>
      <Typography variant="h6">Steam Purchases</Typography>
      <TextField select value={source} onChange={e => setSource(e.target.value)} sx={{ mr:2, mb:2 }}>
        {Object.keys(steamFactors).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
      </TextField>
      <TextField label="Consumption (MMBtu)" type="number" value={qty} onChange={e => setQty(e.target.value)} sx={{ mr:2, mb:2 }}/>
      <Button variant="contained" onClick={handleCalculate}>Calculate</Button>
      {error && <Alert sx={{ mt:2 }} severity="error">{error}</Alert>}
    </Box>
  );
}

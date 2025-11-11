import React, { useState } from "react";
import { offsetFactors } from "../data/emissionFactors";
import { TextField, MenuItem, Button, Box, Typography, Alert } from "@mui/material";

export default function Offsets({ onResult }) {
  const [type, setType] = useState(Object.keys(offsetFactors)[0]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleCalculate() {
    if (amount === "" || isNaN(amount) || Number(amount) < 0) return setError("Enter valid tCO2e amount");
    setError("");
    const co2e = Number(amount) * offsetFactors[type]; // negative factor
    onResult({ co2e });
  }

  return (
    <Box sx={{ p:2 }}>
      <Typography variant="h6">Offsets</Typography>
      <TextField select value={type} onChange={e => setType(e.target.value)} sx={{ mr:2, mb:2 }}>
        {Object.keys(offsetFactors).map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
      </TextField>
      <TextField label="Amount (tCO₂e)" type="number" value={amount} onChange={e => setAmount(e.target.value)} sx={{ mr:2, mb:2 }} />
      <Button variant="contained" onClick={handleCalculate}>Apply Offset</Button>
      {error && <Alert sx={{ mt:2 }} severity="error">{error}</Alert>}
    </Box>
  );
}

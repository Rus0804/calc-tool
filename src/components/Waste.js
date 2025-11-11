import React, { useState } from "react";
import { wasteFactors } from "../data/emissionFactors";
import { TextField, MenuItem, Button, Box, Typography, Alert } from "@mui/material";

export default function Waste({ onResult }) {
  const [material, setMaterial] = useState(Object.keys(wasteFactors)[0]);
  const [disposal, setDisposal] = useState(Object.keys(wasteFactors[material]).filter(k => k !== "unit")[0]);
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");

  const mat = wasteFactors[material];

  function handleCalculate() {
    if (weight === "" || isNaN(weight) || Number(weight) < 0) return setError("Enter valid weight");
    setError("");
    const co2e = Number(weight) * mat[disposal];
    onResult({ co2e });
  }

  return (
    <Box sx={{ p:2 }}>
      <Typography variant="h6">Waste Disposal</Typography>
      <TextField select value={material} onChange={e => setMaterial(e.target.value)} sx={{ mr:2, mb:2 }}>
        {Object.keys(wasteFactors).map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </TextField>
      <TextField select value={disposal} onChange={e => setDisposal(e.target.value)} sx={{ mr:2, mb:2 }}>
        {Object.keys(mat).filter(k => k !== "unit").map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
      </TextField>
      <TextField label={`Weight (${mat.unit})`} type="number" value={weight} onChange={e => setWeight(e.target.value)} sx={{ mr:2, mb:2 }} />
      <Button variant="contained" onClick={handleCalculate}>Calculate</Button>
      {error && <Alert sx={{ mt:2 }} severity="error">{error}</Alert>}
    </Box>
  );
}

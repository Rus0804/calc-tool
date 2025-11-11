export function calcFuelCO2e(qty, factors, GWP) {
  const co2 = qty * factors.co2;
  const ch4_kg = (qty * factors.ch4) / 1000;
  const n2o_kg = (qty * factors.n2o) / 1000;
  return (co2 * GWP.CO2 + ch4_kg * GWP.CH4 + n2o_kg * GWP.N2O) / 1000;
}

export function calcSimpleCO2e(qty, factor) {
  return qty * factor / 1000;
}

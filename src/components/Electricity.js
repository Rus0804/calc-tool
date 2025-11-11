import React, { useState } from "react";
import { electricityEmissionFactors } from "../data/emissionFactors";
import "./Electricity.css";

const eGridRegions = [
  "ASCC Alaska Grid", "ASCC Miscellaneous", "WECC Southwest", "WECC California", "WECC Northwest", "WECC Rockies",
  "ERCOT All", "FRCC All", "HICC Miscellaneous", "HICC Oahu", "MRO East", "MRO West", "NPCC New England",
  "NPCC NYCWestchester", "NPCC Long Island", "NPCC Upstate NY", "Puerto Rico Miscellaneous", "RFC East",
  "RFC Michigan", "RFC West", "SERC Mississippi Valley", "SERC Midwest", "SERC South", "SERC Tennessee Valley",
  "SERC Virginia/Carolina", "SPP North", "SPP South", "US Average"
];

const units = ["kWh", "MWh"];

function createEmptyRow() {
  return {
    region: eGridRegions[0],
    unit: units[0],
    amount: "",
    error: ""
  };
}

function calcEmissions(factor, amount, unit) {
  const MWh = unit === "kWh" ? Number(amount) / 1000 : Number(amount);
  return factor.co2 * MWh * 0.4536;
}

export default function Electricity({ onResult }) {
  const [rows, setRows] = useState([createEmptyRow()]);
  const [results, setResults] = useState([]);

  function updateRow(idx, field, value) {
    const newRows = [...rows];
    newRows[idx][field] = value;
    setRows(newRows);
  }

  function addRow() {
    setRows([...rows, createEmptyRow()]);
  }

  function removeRow(idx) {
    setRows(rows.length === 1 ? [createEmptyRow()] : rows.filter((_, i) => i !== idx));
  }

  function validateRow(row) {
    if (!row.region || !row.unit) return "Select all options";
    if (row.amount === "" || isNaN(row.amount) || Number(row.amount) <= 0) return "Enter valid amount";
    return "";
  }

  function handleCalculate(e) {
    e.preventDefault();
    const newResults = [];
    const checkedRows = rows.map(row => {
      const error = validateRow(row);
      if (error) {
        newResults.push({ ...row, co2_kg: null, error });
        return { ...row, error };
      }
      const factor = electricityEmissionFactors[row.region] || { co2: 0 };
      const co2_kg = calcEmissions(factor, row.amount, row.unit);
      newResults.push({ ...row, co2_kg, error: "" });
      return { ...row, error: "" };
    });
    setRows(checkedRows);
    setResults(newResults);
    if (onResult) onResult(newResults);
  }

  function sumTotal() {
    return results.reduce((sum, r) => sum + (r.co2_kg || 0), 0);
  }

  return (
    <section className="section">
      <h2 className="section-title">Electricity Emissions</h2>
      <form className="batch-form" onSubmit={handleCalculate}>
        <table className="input-table">
          <thead>
            <tr>
              <th>Region</th>
              <th>Unit</th>
              <th>Amount Used</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td>
                  <select value={row.region} onChange={e => updateRow(idx, "region", e.target.value)}>
                    {eGridRegions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
                <td>
                  <select value={row.unit} onChange={e => updateRow(idx, "unit", e.target.value)}>
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={row.amount}
                    min="0"
                    onChange={e => updateRow(idx, "amount", e.target.value)}
                  />
                  {row.error && <div className="error-text">{row.error}</div>}
                </td>
                <td>
                  <button type="button" onClick={() => removeRow(idx)} className="btn-delete">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button type="button" onClick={addRow} className="btn btn-add">
            Add Row
          </button>
          <button type="submit" className="btn btn-calc">
            Calculate Emissions
          </button>
        </div>
      </form>
      {results.length > 0 && (
        <div>
          <h3>Results</h3>
          <table className="results-table" border="1" cellPadding="6" cellSpacing="0" style={{ width: "100%", background: "#fbfbfb" }}>
            <thead>
              <tr>
                <th>Region</th>
                <th>Unit</th>
                <th>Amount</th>
                <th>CO₂ (kg)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.region}</td>
                  <td>{r.unit}</td>
                  <td>{r.amount}</td>
                  <td>{r.co2_kg != null ? r.co2_kg.toLocaleString(undefined, { maximumFractionDigits: 2 }) : <span className="error-text">Invalid</span>}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ textAlign: "right" }}><strong>Total</strong></td>
                <td><strong>{sumTotal().toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { purchasedGasesFactors } from "../data/emissionFactors";
import { logInputsBatchToSupabase } from '../data/db';
import "./PurchasedGases.css";

const createEmptyRow = () => {
  const firstGas = Object.keys(purchasedGasesFactors)[0];
  return {
    gas: firstGas,
    qty: "",
    unit: Object.keys(purchasedGasesFactors[firstGas].units)[0],
    error: ""
  };
};

export default function PurchasedGases({ data = [], onResult, setData }) {
  const [rows, setRows] = useState(data.length > 0 ? data : [createEmptyRow()]);
  const [error, setError] = useState("");

  // Load data prop only once on mount
  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update parent only after calculation success
  function updateParent() {
    if (setData) {
      setData(rows);
    }
  }

  function handleGasChange(index, gas) {
    setRows((prev) => {
      const newRows = [...prev];
      const newUnit = Object.keys(purchasedGasesFactors[gas].units)[0];
      newRows[index] = { gas, qty: "", unit: newUnit };
      return newRows;
    });
    setError("");
  }

  function handleQtyChange(index, qty) {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[index].qty = qty;
      return newRows;
    });
    setError("");
  }

  function handleUnitChange(index, unit) {
    setRows((prev) => {
      const newRows = [...prev];
      newRows[index].unit = unit;
      return newRows;
    });
    setError("");
  }

  function addRow() {
    setRows((prev) => [...prev, createEmptyRow()]);
  }

  function removeRow(index) {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
    setError("");
  }

  async function handleCalculate() {
    let totalCo2e = 0;
    const newRows = rows.map(row => {
      let error = "";
      if (!row.qty || isNaN(row.qty) || Number(row.qty) < 0) {
        error = "All quantities must be valid positive numbers";
      } else if (!purchasedGasesFactors[row.gas].units[row.unit]) {
        error = `Unit ${row.unit} is not valid for gas ${row.gas}. Allowed units: ${Object.keys(
          purchasedGasesFactors[row.gas].units
        ).join(", ")}`;
      }
      return { ...row, error };
    });
    setRows(newRows);

    if (newRows.some(r => r.error)) return;

    newRows.forEach(row => {
      const { gas, qty, unit } = row;
      const qtyInBaseUnit = Number(qty) * (1 / purchasedGasesFactors[gas].units[unit]);
      totalCo2e += qtyInBaseUnit * purchasedGasesFactors[gas].co2eFactor * 0.000453592;
    });

    setError("");

    // Log inputs to Supabase table 'purchased_gases'
    await logInputsBatchToSupabase('purchased_gases', newRows);

    // Update parent with current rows after successful calculation
    updateParent();

    onResult({ co2e: totalCo2e });
  }

  return (
    <div className="purchased-gases">
      <h2 className="title">Purchased Gases</h2>

      {rows.map((row, index) => (
        <div key={index} className="input-row">
          <div className="form-group">
            <label htmlFor={`gas-select-${index}`}>Gas</label>
            <select
              id={`gas-select-${index}`}
              value={row.gas}
              onChange={(e) => handleGasChange(index, e.target.value)}
              className="select-input"
            >
              {Object.keys(purchasedGasesFactors).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor={`qty-input-${index}`}>Quantity</label>
            <input
              id={`qty-input-${index}`}
              type="number"
              min="0"
              step="any"
              value={row.qty}
              onChange={(e) => handleQtyChange(index, e.target.value)}
              placeholder={`Enter quantity in ${row.unit}`}
              className="text-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor={`unit-select-${index}`}>Unit</label>
            <select
              id={`unit-select-${index}`}
              value={row.unit}
              onChange={(e) => handleUnitChange(index, e.target.value)}
              className="select-input"
            >
              {Object.keys(purchasedGasesFactors[row.gas].units).map((unitOption) => (
                <option key={unitOption} value={unitOption}>
                  {unitOption}
                </option>
              ))}
            </select>
          </div>

          {rows.length > 1 && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeRow(index)}
              title="Remove this row"
            >
              &times;
            </button>
          )}

          {row.error && <p className="error-message">{row.error}</p>}
        </div>
      ))}

      <div className="actions">
        <button type="button" className="add-btn" onClick={addRow}>
          Add Row
        </button>
        <button type="button" className="calculate-btn" onClick={handleCalculate}>
          Calculate
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

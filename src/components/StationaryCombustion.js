import React, { useState, useEffect } from "react";
import { stationaryCombustion } from "../data/emissionFactors";
import { GWP } from "../data/gwpTable";
import { convertUnit, fuelUnitOptions, fuelTypeCategoryMap } from "../data/unitConversions";
import { logInputsBatchToSupabase } from '../data/db';
import './StationaryCombustion.css';

export default function StationaryCombustion({ data = [], onResult, setData }) {
  const fuelOptions = Object.keys(stationaryCombustion);

  // Create an empty row with default fuel and unit
  const createEmptyRow = () => ({
    fuel: fuelOptions[0],
    qty: "",
    unit: stationaryCombustion[fuelOptions[0]].unit,
    error: ""
  });

  // Initialize rows either from passed data or default single empty row
  const [rows, setRows] = useState(data.length > 0 ? data : [createEmptyRow()]);

  // Load data prop only once on mount
  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update parent only after successful calculation
  function updateParent() {
    if (setData) {
      setData(rows);
    }
  }

  // Get units available for a particular fuel type
  const getAvailableUnits = (fuel) => {
    const category = fuelTypeCategoryMap[fuel];
    return fuelUnitOptions[category] || [stationaryCombustion[fuel].unit];
  };

  // Update a specific field in a row
  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };

    // Reset unit and quantity when fuel changes
    if (field === "fuel") {
      const availableUnits = getAvailableUnits(value);
      newRows[index].unit = availableUnits[0];
      newRows[index].qty = "";
      newRows[index].error = "";
    }

    setRows(newRows);
  };

  // Validate a row entry
  const validateRow = (row) => {
    if (!row.fuel) return "Fuel is required";
    if (row.qty === "" || isNaN(row.qty) || Number(row.qty) <= 0) {
      return "Valid quantity required";
    }

    const availableUnits = getAvailableUnits(row.fuel);
    if (!availableUnits.includes(row.unit)) {
      return `Unit must be one of: ${availableUnits.join(", ")}`;
    }

    return "";
  };

  // Calculate emissions and save inputs
  const calculateEmissions = async () => {
    const newRows = rows.map(row => {
      const error = validateRow(row);
      return { ...row, error };
    });
    setRows(newRows);

    // Abort if any errors
    if (newRows.some(r => r.error)) return;

    let total_CO2e = 0;
    newRows.forEach(row => {
      const factor = stationaryCombustion[row.fuel];
      const qtyNum = Number(row.qty);

      // Unit conversion to base unit
      const convertedQty = convertUnit(qtyNum, row.unit, factor.unit);

      // Emission calculations
      const co2 = convertedQty * factor.co2;
      const ch4_kg = (convertedQty * factor.ch4) / 1000;
      const n2o_kg = (convertedQty * factor.n2o) / 1000;
      const co2e = (co2 * GWP.CO2 + ch4_kg * GWP.CH4 + n2o_kg * GWP.N2O) / 1000; // metric tons

      total_CO2e += co2e;
      row.CO2e = co2e;
    });

    await logInputsBatchToSupabase('stationary_combustion', newRows);

    // Update parent data after successful calculation
    updateParent();

    onResult({ total_CO2e });
  };

  // Row addition/removal handlers
  const addRow = () => setRows([...rows, createEmptyRow()]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  return (
    <div className="stationary-combustion">
      <h3>Stationary Combustion</h3>

      <div className="rows-container">
        {rows.map((row, index) => (
          <div key={index} className="input-row">
            <div className="fuel-select">
              <label>Fuel Type:</label>
              <select
                value={row.fuel}
                onChange={(e) => updateRow(index, "fuel", e.target.value)}
              >
                {fuelOptions.map(fuel => (
                  <option key={fuel} value={fuel}>{fuel}</option>
                ))}
              </select>
            </div>

            <div className="quantity-input">
              <label>Quantity:</label>
              <input
                type="number"
                value={row.qty}
                onChange={(e) => updateRow(index, "qty", e.target.value)}
                placeholder="Enter quantity"
                min="0"
                step="any"
              />
            </div>

            <div className="unit-select">
              <label>Unit:</label>
              <select
                value={row.unit}
                onChange={(e) => updateRow(index, "unit", e.target.value)}
              >
                {getAvailableUnits(row.fuel).map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="row-actions">
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>

            {row.error && (
              <div className="error-message">
                {row.error}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="actions">
        <button type="button" onClick={addRow} className="add-btn">
          Add Row
        </button>
        <button type="button" onClick={calculateEmissions} className="calculate-btn">
          Calculate Emissions
        </button>
      </div>
    </div>
  );
}

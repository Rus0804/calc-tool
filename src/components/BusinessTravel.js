import React, { useState, useEffect } from "react";
import { businessTravelFactors, isPassengerMileMode } from "../data/emissionFactors";
import {GWP} from "../data/gwpTable";
import { logInputsBatchToSupabase } from "../data/db"; 
import "./BusinessTravel.css";

export default function BusinessTravel({ data = [], onResult, setData }) {
  const createEmptyRow = () => {
    const defMode = Object.keys(businessTravelFactors)[0];
    return {
      mode: defMode,
      distance: "",
      unit: isPassengerMileMode(defMode) ? "passenger-miles" : "vehicle-miles",
      error: ""
    };
  };

  const [rows, setRows] = useState(data.length > 0 ? data : [createEmptyRow()]);

  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateParent(updatedRows) {
    if (setData) {
      setData(updatedRows);
    }
  }

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };

    if (field === "mode") {
      const unit = isPassengerMileMode(value) ? "passenger-miles" : "vehicle-miles";
      newRows[index].unit = unit;
      newRows[index].distance = "";
      newRows[index].error = "";
    }

    setRows(newRows);
    updateParent(newRows);
  };

  const validateRow = (row) => {
    if (!row.mode) return "Select travel mode";
    if (row.distance === "" || isNaN(row.distance) || Number(row.distance) <= 0) {
      return "Enter valid distance";
    }
    return "";
  };

  const calculateEmissions = async () => {
    const newRows = rows.map((row) => ({
      ...row,
      error: validateRow(row)
    }));
    setRows(newRows);
    updateParent(newRows);

    if (newRows.some((r) => r.error)) return;

    let total_CO2e = 0;

    newRows.forEach((row) => {
      const factor = businessTravelFactors[row.mode];
      const distNum = Number(row.distance);
      const co2e_co2 = distNum * factor.co2 / 1000; // metric tons
      const ch4_kg = (distNum * factor.ch4) / 1000 / 1000; // g to kg to metric tons
      const n2o_kg = (distNum * factor.n2o) / 1000 / 1000; // g to kg to metric tons
      const ch4_co2e = ch4_kg * GWP.CH4;
      const n2o_co2e = n2o_kg * GWP.N2O;
      row.co2e = co2e_co2 + ch4_co2e + n2o_co2e;
      total_CO2e += co2e_co2 + ch4_co2e + n2o_co2e;
    });

    try {
      await logInputsBatchToSupabase("business_travel", newRows);
    } catch (error) {
      console.error("Failed to log business travel data:", error);
      // Optionally show user feedback about logging failure
    }

    updateParent(newRows);
    if (onResult) {
      onResult({ total_CO2e });
    }
  };


  const addRow = () => {
    const newRows = [...rows, createEmptyRow()];
    setRows(newRows);
    updateParent(newRows);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows.length > 0 ? newRows : [createEmptyRow()]);
    updateParent(newRows.length > 0 ? newRows : [createEmptyRow()]);
  };

  return (
    <div className="bt-container">
      <h2 className="bt-title">Business Travel</h2>

      <div className="bt-rows">
        {rows.map((row, index) => (
          <div key={index} className="bt-row">
            <div className="bt-field">
              <label className="bt-label">Travel Mode</label>
              <select
                className="bt-select"
                value={row.mode}
                onChange={(e) => updateRow(index, "mode", e.target.value)}
              >
                {Object.keys(businessTravelFactors).map((m) => (
                  <option key={m} value={m}>
                    {m} ({isPassengerMileMode(m) ? "passenger-miles" : "vehicle-miles"})
                  </option>
                ))}
              </select>
            </div>

            <div className="bt-field">
              <label className="bt-label">{`Distance (${row.unit})`}</label>
              <input
                type="number"
                className="bt-input"
                value={row.distance}
                onChange={(e) => updateRow(index, "distance", e.target.value)}
                min="0"
                step="any"
              />
            </div>

            <div className="bt-row-actions">
              {rows.length > 1 && (
                <button
                  type="button"
                  className="bt-remove-btn"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {row.error && <div className="bt-alert">{row.error}</div>}
          </div>
        ))}
      </div>

      <div className="bt-actions">
        <button type="button" className="bt-add-btn" onClick={addRow}>
          Add Row
        </button>
        <button type="button" className="bt-button" onClick={calculateEmissions}>
          Calculate Emissions
        </button>
      </div>

      <p className="bt-note">
        Note: For air travel, enter passenger-miles; factors exclude radiative forcing.
      </p>
    </div>
  );
}

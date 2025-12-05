import React, { useState, useEffect } from "react";
import { wasteFactors } from "../data/emissionFactors";
import { mass } from "../data/unitConversions";
import { logInputsBatchToSupabase } from "../data/db";
import "./Waste.css";

const BASE_UNIT = "metric ton"; // wasteFactors base unit

export default function Waste({ data = [], onResult, setData }) {
  const massUnits = Object.keys(mass); // e.g., ["pounds (lb)", "kilogram (kg)", ...]
  const defaultUnit = massUnits[0];

  const createEmptyRow = () => {
    const defMaterial = Object.keys(wasteFactors)[0];
    const defDisposal = Object.keys(wasteFactors[defMaterial])[0]; // first disposal type
    return {
      material: defMaterial,
      disposal: defDisposal,
      unit: defaultUnit,
      weight: "",
      co2e: 0,
      error: ""
    };
  };

  const [rows, setRows] = useState(
    data && data.length > 0 ? data : [createEmptyRow()]
  );

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
    let row = { ...newRows[index], [field]: value };

    if (field === "material") {
      const defDisposal = Object.keys(wasteFactors[value])[0];
      row.disposal = defDisposal;
      row.weight = "";
      row.co2e = 0;
      row.error = "";
    }

    newRows[index] = row;
    setRows(newRows);
    updateParent(newRows);
  };

  const validateRow = (row) => {
    if (!row.material) return "Select material";
    if (!row.disposal) return "Select disposal method";
    if (!row.unit) return "Select unit";
    if (row.weight === "" || isNaN(row.weight) || Number(row.weight) <= 0) {
      return "Enter valid weight";
    }
    if (!mass[row.unit] || mass[row.unit][BASE_UNIT] == null) {
      return "Unit conversion not available";
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
      const factor = wasteFactors[row.material][row.disposal]; // tCO2e / metric ton
      const wNum = Number(row.weight);
      const toMetricTon = mass[row.unit][BASE_UNIT]; // multiplier to metric ton
      const materialTons = wNum * toMetricTon;
      const co2e = materialTons * factor; // metric tons CO2e
      row.co2e = co2e;
      total_CO2e += co2e;
    });

    try {
      await logInputsBatchToSupabase("waste", newRows);
    } catch (error) {
      console.error("Failed to log waste data:", error);
    }

    setRows([...newRows]);
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
    const finalRows = newRows.length > 0 ? newRows : [createEmptyRow()];
    setRows(finalRows);
    updateParent(finalRows);
  };

  return (
    <div className="waste-container">
      <h2 className="waste-title">Waste Disposal</h2>

      <div className="waste-rows">
        {rows.map((row, index) => (
          <div key={index} className="waste-row">
            <div className="waste-field">
              <label className="waste-label">Material</label>
              <select
                className="waste-select"
                value={row.material}
                onChange={(e) => updateRow(index, "material", e.target.value)}
              >
                {Object.keys(wasteFactors).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="waste-field">
              <label className="waste-label">Disposal Method</label>
              <select
                className="waste-select"
                value={row.disposal}
                onChange={(e) => updateRow(index, "disposal", e.target.value)}
              >
                {Object.keys(wasteFactors[row.material]).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="waste-field">
              <label className="waste-label">Unit</label>
              <select
                className="waste-select"
                value={row.unit}
                onChange={(e) => updateRow(index, "unit", e.target.value)}
              >
                {massUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="waste-field">
              <label className="waste-label">{`Weight (${row.unit})`}</label>
              <input
                type="number"
                className="waste-input"
                value={row.weight}
                onChange={(e) => updateRow(index, "weight", e.target.value)}
                min="0"
                step="any"
              />
            </div>

            <div className="waste-row-actions">
              {rows.length > 1 && (
                <button
                  type="button"
                  className="waste-remove-btn"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {row.error && <div className="waste-alert">{row.error}</div>}
          </div>
        ))}
      </div>

      <div className="waste-actions">
        <button type="button" className="waste-add-btn" onClick={addRow}>
          Add Row
        </button>
        <button
          type="button"
          className="waste-button"
          onClick={calculateEmissions}
        >
          Calculate Emissions
        </button>
      </div>

      <p className="waste-note">
        Note: Waste emission factors are applied per metric ton of material, with
        your input converted from the selected mass unit.
      </p>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { fireSuppressionGWP } from "../data/emissionFactors";
import { logInputsBatchToSupabase } from "../data/db";
import "./FireSuppression.css";

const calculationOptions = [
  "Material Balance Method",
  "Simplified Material Balance Method",
  "Screening Method",
];

const equipmentTypes = [
  "Fixed fire suppression",
  "Portable fire suppression",
];

function createEmptyRow() {
  return {
    agent: Object.keys(fireSuppressionGWP)[0],
    // Option 1
    inventoryChange: "",
    transferred: "",
    capacityChange: "",
    // Option 2
    newUnitsCharge: "",
    existingUnitsRecharge: "",
    disposedUnitsCharge: "",
    capacityNewUnits: "",
    capacityExistingUnits: "",
    capacityDisposedUnits: "",
    recoveredAmount: "",
    // Option 3
    equipmentType: equipmentTypes[0],
    equipmentCount: "",
    recoveryEfficiency: "",
    massReleased: "", // added since used in calculation but missing in emptyRow
  };
}

export default function FireSuppression({ data = [], onResult, setData }) {
  const [calculationOption, setCalculationOption] = useState(calculationOptions[0]);
  const [rows, setRows] = useState(data.length > 0 ? data : [createEmptyRow()]);
  const [error, setError] = useState("");

  // Load incoming data only once on mount
  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update parent data only after successful calculation
  function updateParent() {
    if (setData) {
      setData(rows);
    }
  }

  function handleRowChange(index, field, value) {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
    // defer parent update until calculation
  }

  function addRow() {
    setRows([...rows, createEmptyRow()]);
  }

  function removeRow(index) {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== index));
  }

  const validationFieldsMap = {
    "Material Balance Method": ["inventoryChange", "transferred", "capacityChange"],
    "Simplified Material Balance Method": [
      "newUnitsCharge",
      "existingUnitsRecharge",
      "disposedUnitsCharge",
      "capacityNewUnits",
      "capacityExistingUnits",
      "capacityDisposedUnits",
      "recoveredAmount",
    ],
    "Screening Method": ["equipmentCount", "massReleased", "recoveryEfficiency"],
  };

  function validateInputs() {
    const relevantFields = validationFieldsMap[calculationOption];
    for (const row of rows) {
      for (const field of relevantFields) {
        const value = row[field];
        if (value === "") continue;
        if (
          isNaN(value) ||
          (field === "recoveryEfficiency" && (Number(value) < 0 || Number(value) > 100)) ||
          Number(value) < 0
        ) {
          setError("Enter valid non-negative numbers and recovery efficiency between 0 and 100");
          return false;
        }
      }
    }
    setError("");
    return true;
  }

  async function calculateEmissions() {
    if (!validateInputs()) return;

    let totalCo2e = 0;
    rows.forEach((row) => {
      const GWP = fireSuppressionGWP[row.agent] || 0;

      let emissions = 0;
      if (calculationOption === "Material Balance Method") {
        emissions =
          ((Number(row.inventoryChange) || 0) +
            (Number(row.transferred) || 0) +
            (Number(row.capacityChange) || 0)) *
          GWP /
          1000;
      } else if (calculationOption === "Simplified Material Balance Method") {
        const netCharge =
          (Number(row.newUnitsCharge) || 0) +
          (Number(row.existingUnitsRecharge) || 0) +
          (Number(row.disposedUnitsCharge) || 0);
        const netCapacity =
          (Number(row.capacityNewUnits) || 0) +
          (Number(row.capacityExistingUnits) || 0) +
          (Number(row.capacityDisposedUnits) || 0);
        const recovered = Number(row.recoveredAmount) || 0;
        emissions = ((netCharge + netCapacity - recovered) * GWP) / 1000;
      } else if (calculationOption === "Screening Method") {
        const equipmentCount = Number(row.equipmentCount) || 0;
        const massPerUnit = Number(row.massReleased || 0);
        const recoveryEff = (Number(row.recoveryEfficiency) || 0) / 100;
        const netEmissionMass = equipmentCount * massPerUnit * (1 - recoveryEff);
        emissions = (netEmissionMass * GWP) / 1000;
      }
      totalCo2e += emissions;
    });

    await logInputsBatchToSupabase("fire_suppression", rows);

    // Update parent only after successful calculation
    updateParent();

    onResult({ co2e: totalCo2e });
  }

  return (
    <div className="fire-suppression">
      <h2>Fire Suppression Emissions Calculator</h2>

      <label>
        Calculation Method:
        <select
          value={calculationOption}
          onChange={(e) => setCalculationOption(e.target.value)}
          className="calculation-method-select"
        >
          {calculationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {rows.map((row, idx) => (
        <div key={idx} className="input-row">
          <label>
            Agent:
            <select value={row.agent} onChange={(e) => handleRowChange(idx, "agent", e.target.value)}>
              {Object.keys(fireSuppressionGWP).map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </label>

          {calculationOption === "Material Balance Method" && (
            <>
              <label>
                Inventory Change (kg):
                <input
                  type="number"
                  min="0"
                  value={row.inventoryChange}
                  onChange={(e) => handleRowChange(idx, "inventoryChange", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Transferred (kg):
                <input
                  type="number"
                  min="0"
                  value={row.transferred}
                  onChange={(e) => handleRowChange(idx, "transferred", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Capacity Change (kg):
                <input
                  type="number"
                  min="0"
                  value={row.capacityChange}
                  onChange={(e) => handleRowChange(idx, "capacityChange", e.target.value)}
                  placeholder="0"
                />
              </label>
            </>
          )}

          {calculationOption === "Simplified Material Balance Method" && (
            <>
              <label>
                New Units Charge (kg):
                <input
                  type="number"
                  min="0"
                  value={row.newUnitsCharge}
                  onChange={(e) => handleRowChange(idx, "newUnitsCharge", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Existing Units Recharge (kg):
                <input
                  type="number"
                  min="0"
                  value={row.existingUnitsRecharge}
                  onChange={(e) => handleRowChange(idx, "existingUnitsRecharge", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Disposed Units Charge (kg):
                <input
                  type="number"
                  min="0"
                  value={row.disposedUnitsCharge}
                  onChange={(e) => handleRowChange(idx, "disposedUnitsCharge", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Capacity New Units (kg):
                <input
                  type="number"
                  min="0"
                  value={row.capacityNewUnits}
                  onChange={(e) => handleRowChange(idx, "capacityNewUnits", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Capacity Existing Units (kg):
                <input
                  type="number"
                  min="0"
                  value={row.capacityExistingUnits}
                  onChange={(e) => handleRowChange(idx, "capacityExistingUnits", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Capacity Disposed Units (kg):
                <input
                  type="number"
                  min="0"
                  value={row.capacityDisposedUnits}
                  onChange={(e) => handleRowChange(idx, "capacityDisposedUnits", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Recovered Amount (kg):
                <input
                  type="number"
                  min="0"
                  value={row.recoveredAmount}
                  onChange={(e) => handleRowChange(idx, "recoveredAmount", e.target.value)}
                  placeholder="0"
                />
              </label>
            </>
          )}

          {calculationOption === "Screening Method" && (
            <>
              <label>
                Equipment Type:
                <select
                  value={row.equipmentType}
                  onChange={(e) => handleRowChange(idx, "equipmentType", e.target.value)}
                >
                  {equipmentTypes.map((et) => (
                    <option key={et} value={et}>
                      {et}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Equipment Count:
                <input
                  type="number"
                  min="0"
                  value={row.equipmentCount}
                  onChange={(e) => handleRowChange(idx, "equipmentCount", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Recovery Efficiency (%):
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={row.recoveryEfficiency}
                  onChange={(e) => handleRowChange(idx, "recoveryEfficiency", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Mass Released (kg):
                <input
                  type="number"
                  min="0"
                  value={row.massReleased}
                  onChange={(e) => handleRowChange(idx, "massReleased", e.target.value)}
                  placeholder="0"
                />
              </label>
            </>
          )}

          {rows.length > 1 && (
            <button type="button" className="remove-btn" onClick={() => removeRow(idx)}>
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="actions">
        <button type="button" className="add-btn" onClick={addRow}>
          Add Row
        </button>
        <button type="button" className="calculate-btn" onClick={calculateEmissions}>
          Calculate Emissions
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

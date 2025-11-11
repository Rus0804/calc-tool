import React, { useState, useEffect } from "react";
import { refrigerantGWP } from "../data/emissionFactors";
import { logInputsBatchToSupabase } from "../data/db";
import "./RefrigerationAC.css";

const equipmentTypes = [
  "Domestic refrigeration",
  "Stand-alone commercial refrigeration",
  "Medium/large commercial refrigeration",
  "Transport refrigeration",
  "Industrial refrigeration",
  "Chillers",
  "Residential HVAC",
  "Commercial HVAC",
  "Maritime AC",
  "Railway AC",
  "Bus AC",
  "Other mobile AC",
];

const calculationOptions = [
  "Material Balance Method",
  "Simplified Material Balance Method",
  "Screening Method",
];

function createEmptyRow() {
  return {
    equipmentType: equipmentTypes[0],
    gas: Object.keys(refrigerantGWP)[0],
    inventoryChange: "",
    transferred: "",
    capacityChange: "",
    newUnitsCharge: "",
    servicedUnitsCharge: "",
    disposedUnitsCharge: "",
    monthsInOperation: "12",
    operatingCapacity: "",
    disposedCapacity: "",
  };
}

export default function RefrigerationAC({ data = [], onResult, setData }) {
  const [calculationOption, setCalculationOption] = useState(
    calculationOptions[0]
  );
  const [rows, setRows] = useState(data.length > 0 ? data : [createEmptyRow()]);
  const [error, setError] = useState("");

  // Load initial data prop only once on mount
  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update parent only after calculation is successful
  function updateParent() {
    if (setData) {
      setData(rows);
    }
  }

  function handleRowChange(index, field, value) {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
    // Do not update parent immediately, only after calculation
  }

  function addRow() {
    setRows((prev) => {
      const newRows = [...prev, createEmptyRow()];
      return newRows;
    });
  }

  function removeRow(index) {
    setRows((prev) => {
      if (prev.length === 1) return prev; // keep minimum one row
      const newRows = prev.filter((_, i) => i !== index);
      return newRows;
    });
  }

  function validateInputs() {
    for (let row of rows) {
      for (const [key, value] of Object.entries(row)) {
        if (
          [
            "inventoryChange",
            "transferred",
            "capacityChange",
            "newUnitsCharge",
            "servicedUnitsCharge",
            "disposedUnitsCharge",
            "monthsInOperation",
            "operatingCapacity",
            "disposedCapacity",
          ].includes(key)
        ) {
          if (value === "") continue;
          if (isNaN(value) || Number(value) < 0) {
            setError(
              `Enter valid non-negative number for ${key.replace(
                /([A-Z])/g,
                " $1"
              )}`
            );
            return false;
          }
        }
      }
    }
    setError("");
    return true;
  }

  async function calculateEmissions() {
    if (!validateInputs()) return;

    await logInputsBatchToSupabase("refrigeration_ac", rows);

    // Update parent data after successful calculation
    updateParent();

    let totalCo2e = 0;
    rows.forEach((row) => {
      const GWP = refrigerantGWP[row.gas] || 0;
      let emissionMass = 0;

      if (calculationOption === "Material Balance Method") {
        emissionMass =
          (Number(row.inventoryChange) || 0) +
          (Number(row.transferred) || 0) +
          (Number(row.capacityChange) || 0);
      } else if (calculationOption === "Simplified Material Balance Method") {
        emissionMass =
          (Number(row.newUnitsCharge) || 0) +
          (Number(row.servicedUnitsCharge) || 0) +
          (Number(row.disposedUnitsCharge) || 0);
      } else if (calculationOption === "Screening Method") {
        emissionMass =
          ((Number(row.operatingCapacity) || 0) *
            (Number(row.monthsInOperation) || 0)) /
          12;
      }

      totalCo2e += (emissionMass * GWP) / 1000;
    });

    onResult({ co2e: totalCo2e });
  }

  return (
    <div className="refrigeration-ac">
      <h2>Refrigeration / AC Emissions Calculator</h2>

      <label>
        Calculation Method:
        <select
          value={calculationOption}
          onChange={(e) => setCalculationOption(e.target.value)}
          className="calculation-option-select"
        >
          {calculationOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {rows.map((row, i) => (
        <div key={i} className="input-row">
          <label>
            Equipment Type:
            <select
              value={row.equipmentType}
              onChange={(e) =>
                handleRowChange(i, "equipmentType", e.target.value)
              }
            >
              {equipmentTypes.map((et) => (
                <option key={et} value={et}>
                  {et}
                </option>
              ))}
            </select>
          </label>

          <label>
            Refrigerant Gas:
            <select
              value={row.gas}
              onChange={(e) => handleRowChange(i, "gas", e.target.value)}
            >
              {Object.keys(refrigerantGWP).map((g) => (
                <option key={g} value={g}>
                  {g}
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
                  value={row.inventoryChange}
                  onChange={(e) =>
                    handleRowChange(i, "inventoryChange", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
              <label>
                Transferred (kg):
                <input
                  type="number"
                  value={row.transferred}
                  onChange={(e) =>
                    handleRowChange(i, "transferred", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
              <label>
                Capacity Change (kg):
                <input
                  type="number"
                  value={row.capacityChange}
                  onChange={(e) =>
                    handleRowChange(i, "capacityChange", e.target.value)
                  }
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
                  value={row.newUnitsCharge}
                  onChange={(e) =>
                    handleRowChange(i, "newUnitsCharge", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
              <label>
                Serviced Units Charge (kg):
                <input
                  type="number"
                  value={row.servicedUnitsCharge}
                  onChange={(e) =>
                    handleRowChange(i, "servicedUnitsCharge", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
              <label>
                Disposed Units Charge (kg):
                <input
                  type="number"
                  value={row.disposedUnitsCharge}
                  onChange={(e) =>
                    handleRowChange(i, "disposedUnitsCharge", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
            </>
          )}

          {calculationOption === "Screening Method" && (
            <>
              <label>
                Months in Operation:
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={row.monthsInOperation}
                  onChange={(e) =>
                    handleRowChange(i, "monthsInOperation", e.target.value)
                  }
                  placeholder="12"
                />
              </label>
              <label>
                Operating Capacity (kg refrigerant):
                <input
                  type="number"
                  value={row.operatingCapacity}
                  onChange={(e) =>
                    handleRowChange(i, "operatingCapacity", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
              <label>
                Disposed Capacity (kg refrigerant):
                <input
                  type="number"
                  value={row.disposedCapacity}
                  onChange={(e) =>
                    handleRowChange(i, "disposedCapacity", e.target.value)
                  }
                  placeholder="0"
                />
              </label>
            </>
          )}

          {rows.length > 1 && (
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeRow(i)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="actions">
        <button type="button" className="add-btn" onClick={addRow}>
          Add Row
        </button>
        <button
          type="button"
          className="calculate-btn"
          onClick={calculateEmissions}
        >
          Calculate Emissions
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { logInputsBatchToSupabase } from "../data/db";
import "./Offsets.css";

const scopeOptions = [
  "Scope 1",
  "Scope 2 - Location-Based",
  "Scope 2 - Market-Based",
  "Scope 3 - Business Travel",
  "Scope 3 - Employee Commuting",
  "Scope 3 - Upstream Transportation and Distribution",
  "Scope 3 - Waste"
];

// Sheet uses: Project Description, Offset Scope/Category, Offsets Purchased (metric tons CO2e).
const createEmptyRow = () => ({
  description: "",
  scope: scopeOptions[0],
  amount: "",
  error: ""
});

export default function Offsets({ data = [], onResult, setData }) {
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
    const row = { ...newRows[index], [field]: value };

    if (field === "amount") {
      row.error = "";
    }

    newRows[index] = row;
    setRows(newRows);
    updateParent(newRows);
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

  const validateRow = (row) => {
    if (row.amount === "" || isNaN(row.amount) || Number(row.amount) < 0) {
      return "Enter valid offsets (metric tons CO2e)";
    }
    return "";
  };

  const getScopeBuckets = (rows) => {
    let scope1 = 0;
    let scope2loc = 0;
    let scope2mkt = 0;
    let scope3 = 0;

    rows.forEach((r) => {
      const amt = Number(r.amount) || 0;
      if (!amt) return;

      if (r.scope === "Scope 1") {
        scope1 += amt;
      } else if ( r.scope === "Scope 2 - Location-Based" ){
          scope2loc += amt;
      } else if ( r.scope === "Scope 2 - Market-Based" ){
          scope2mkt += amt;
      } else {
        scope3 += amt;
      }
    });

    return { scope1, scope2loc, scope2mkt, scope3 };
  };

  const calculateOffsets = async() => {
    const newRows = rows.map((row) => {
      const error = validateRow(row);
      if (error) {
        return { ...row, error };
      }
      return { ...row, error: "" };
    });

    setRows(newRows);
    updateParent(newRows);

    if (newRows.some((r) => r.error)) return;

    const { scope1, scope2loc, scope2mkt, scope3 } = getScopeBuckets(newRows);

    try {
      await logInputsBatchToSupabase(
        "offsets",
        newRows
      );
    } catch (err) {
      console.error("Failed to log offsets data:", err);
    }

    if (onResult) {
      onResult({
        scope1Offsets: scope1,   // t CO2e
        scope2locOffsets: scope2loc,
        scope2mktOffsets: scope2mkt,   // t CO2e
        scope3Offsets: scope3,   // t CO2e
        rows: newRows
      });
    }
  };

  return (
    <div className="offsets-container">
      <h2 className="offsets-title">Offsets</h2>

      <div className="offsets-rows">
        {rows.map((row, index) => (
          <div key={index} className="offsets-row">
            <div className="offsets-field">
              <label className="offsets-label">Project Description</label>
              <input
                type="text"
                className="offsets-input"
                value={row.description}
                onChange={(e) =>
                  updateRow(index, "description", e.target.value)
                }
              />
            </div>

            <div className="offsets-field">
              <label className="offsets-label">Scope / Category</label>
              <select
                className="offsets-select"
                value={row.scope}
                onChange={(e) => updateRow(index, "scope", e.target.value)}
              >
                {scopeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="offsets-field">
              <label className="offsets-label">
                Offsets Purchased (metric tons CO2e)
              </label>
              <input
                type="number"
                className="offsets-input"
                value={row.amount}
                onChange={(e) => updateRow(index, "amount", e.target.value)}
                min="0"
                step="any"
              />
            </div>

            <div className="offsets-row-actions">
              {rows.length > 1 && (
                <button
                  type="button"
                  className="offsets-remove-btn"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {row.error && <div className="offsets-alert">{row.error}</div>}
          </div>
        ))}
      </div>

      <div className="offsets-actions">
        <button
          type="button"
          className="offsets-add-btn"
          onClick={addRow}
        >
          Add Row
        </button>
        <button
          type="button"
          className="offsets-button"
          onClick={calculateOffsets}
        >
          Apply Offsets
        </button>
      </div>

      <p className="offsets-note">
        Enter the quantity of offsets purchased for each project in metric tons CO2e, by scope or category.
      </p>

    </div>
  );
}

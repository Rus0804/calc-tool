import React, { useState, useEffect } from "react";
import { upstreamTransportFactors } from "../data/emissionFactors";
import { GWP } from "../data/gwpTable";
import { logInputsBatchToSupabase } from "../data/db";
import "./UpstreamTransportation.css";

export default function UpstreamTransportation({ data = [], onResult, setData }) {
  const modeKeys = Object.keys(upstreamTransportFactors);

  const createEmptyRow = () => {
    const defMode = modeKeys[0];
    return {
      mode: defMode,
      // For vehicle-mile: use distanceOnly; for ton-mile: allow either tonMiles or tons+miles
      distanceOrTonMiles: "",
      productShortTons: "",
      miles: "",
      co2e: 0,
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
    const row = { ...newRows[index], [field]: value };

    if (field === "mode") {
      row.distanceOrTonMiles = "";
      row.productShortTons = "";
      row.miles = "";
      row.co2e = 0;
      row.error = "";
    }

    newRows[index] = row;
    setRows(newRows);
    updateParent(newRows);
  };

  const validateRow = (row) => {
    if (!row.mode) return "Select transport mode";

    const factor = upstreamTransportFactors[row.mode];
    if (!factor) return "Emission factor not found";

    if (factor.basis === "vehicle-mile") {
      if (
        row.distanceOrTonMiles === "" ||
        isNaN(row.distanceOrTonMiles) ||
        Number(row.distanceOrTonMiles) <= 0
      ) {
        return "Enter valid vehicle-miles";
      }
    } else if (factor.basis === "ton-mile") {
      const directOK =
        row.distanceOrTonMiles !== "" &&
        !isNaN(row.distanceOrTonMiles) &&
        Number(row.distanceOrTonMiles) > 0;

      const tonsOK =
        row.productShortTons !== "" &&
        !isNaN(row.productShortTons) &&
        Number(row.productShortTons) > 0;

      const milesOK =
        row.miles !== "" &&
        !isNaN(row.miles) &&
        Number(row.miles) > 0;

      if (!directOK && !(tonsOK && milesOK)) {
        return "Enter ton-miles or product short tons and miles";
      }
    }

    return "";
  };

  const computeTonMiles = (row) => {
    const direct = Number(row.distanceOrTonMiles);
    if (!isNaN(direct) && direct > 0) return direct;

    const tons = Number(row.productShortTons);
    const miles = Number(row.miles);
    if (!isNaN(tons) && tons > 0 && !isNaN(miles) && miles > 0) {
      return tons * miles;
    }

    return 0;
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
      const factor = upstreamTransportFactors[row.mode];
      const basis = factor.basis; // "vehicle-mile" or "ton-mile"

      let activity = 0;
      if (basis === "vehicle-mile") {
        activity = Number(row.distanceOrTonMiles); // miles
      } else {
        activity = computeTonMiles(row); // short ton-miles
      }

      // Factors are per mile or per short ton-mile: CO2 kg, CH4 g, N2O g.[file:1]
      const co2_kg = activity * factor.co2;
      const ch4_kg = (activity * factor.ch4) / 1000;
      const n2o_kg = (activity * factor.n2o) / 1000;

      const co2e_metric_tons =
        co2_kg / 1000 +
        (ch4_kg * GWP.CH4) / 1000 +
        (n2o_kg * GWP.N2O) / 1000;

      row.co2e = co2e_metric_tons;
      total_CO2e += co2e_metric_tons;
    });

    try {
      await logInputsBatchToSupabase("upstream_transportation", newRows);
    } catch (error) {
      console.error("Failed to log upstream transport data:", error);
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
    <div className="upstream-container">
      <h2 className="upstream-title">Upstream Transportation &amp; Distribution</h2>

      <div className="upstream-rows">
        {rows.map((row, index) => {
          const factor = upstreamTransportFactors[row.mode];
          const basis = factor.basis;

          return (
            <div key={index} className="upstream-row">
              <div className="upstream-field">
                <label className="upstream-label">Transport Mode</label>
                <select
                  className="upstream-select"
                  value={row.mode}
                  onChange={(e) => updateRow(index, "mode", e.target.value)}
                >
                  {modeKeys.map((m) => (
                    <option key={m} value={m}>
                      {m} ({upstreamTransportFactors[m].basis})
                    </option>
                  ))}
                </select>
              </div>

              {basis === "vehicle-mile" && (
                <div className="upstream-field">
                  <label className="upstream-label">Vehicle-Miles</label>
                  <input
                    type="number"
                    className="upstream-input"
                    value={row.distanceOrTonMiles}
                    onChange={(e) =>
                      updateRow(index, "distanceOrTonMiles", e.target.value)
                    }
                    min="0"
                    step="any"
                  />
                </div>
              )}

              {basis === "ton-mile" && (
                <>
                  <div className="upstream-field">
                    <label className="upstream-label">Short Ton-Miles</label>
                    <input
                      type="number"
                      className="upstream-input"
                      value={row.distanceOrTonMiles}
                      onChange={(e) =>
                        updateRow(index, "distanceOrTonMiles", e.target.value)
                      }
                      placeholder="Optional if tons × miles provided"
                      min="0"
                      step="any"
                    />
                  </div>

                  <div className="upstream-field">
                    <label className="upstream-label">Product Weight (short tons)</label>
                    <input
                      type="number"
                      className="upstream-input"
                      value={row.productShortTons}
                      onChange={(e) =>
                        updateRow(index, "productShortTons", e.target.value)
                      }
                      placeholder="Alternative to direct ton-miles"
                      min="0"
                      step="any"
                    />
                  </div>

                  <div className="upstream-field">
                    <label className="upstream-label">Distance (miles)</label>
                    <input
                      type="number"
                      className="upstream-input"
                      value={row.miles}
                      onChange={(e) =>
                        updateRow(index, "miles", e.target.value)
                      }
                      placeholder="Alternative to direct ton-miles"
                      min="0"
                      step="any"
                    />
                  </div>
                </>
              )}

              <div className="upstream-row-actions">
                {rows.length > 1 && (
                  <button
                    type="button"
                    className="upstream-remove-btn"
                    onClick={() => removeRow(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              {row.error && <div className="upstream-alert">{row.error}</div>}
            </div>
          );
        })}
      </div>

      <div className="upstream-actions">
        <button type="button" className="upstream-add-btn" onClick={addRow}>
          Add Row
        </button>
        <button
          type="button"
          className="upstream-button"
          onClick={calculateEmissions}
        >
          Calculate Emissions
        </button>
      </div>

      <p className="upstream-note">
        For on-road full truckload, enter vehicle-miles. For rail, water, air, or LTL road shipments, enter short ton-miles directly, or product weight in short tons and distance in miles to calculate ton-miles.[file:1]
      </p>
    </div>
  );
}

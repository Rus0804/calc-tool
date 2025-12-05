import React, { useState, useEffect } from "react";
import { electricityEmissionFactors } from "../data/emissionFactors";
import { GWP } from "../data/gwpTable";
import { logInputsBatchToSupabase } from "../data/db";
import "./Electricity.css";

const eGridRegions = [
  "ASCC Alaska Grid", "ASCC Miscellaneous", "WECC Southwest", "WECC California",
  "ERCOT All", "FRCC All", "HICC Miscellaneous", "HICC Oahu", "MRO East",
  "MRO West", "NPCC New England", "WECC Northwest", "NPCC NYC/Westchester",
  "NPCC Long Island", "NPCC Upstate NY", "Puerto Rico Miscellaneous", "RFC East",
  "RFC Michigan", "RFC West", "WECC Rockies", "SPP North", "SPP South",
  "SERC Mississippi Valley", "SERC Midwest", "SERC South",
  "SERC Tennessee Valley", "SERC Virginia/Carolina", "US Average"
];

const units = ["kWh", "MWh"];

// lb -> kg
const LB_TO_KG = 0.453592;

const createEmptyRow = () => ({
  region: eGridRegions[0],
  unit: units[0],
  method: "location", // "location" or "market"
  amount: "",
  // market-based custom factors (lb/MWh)
  mb_co2: "",
  mb_ch4: "",
  mb_n2o: "",
  loc_co2e: 0,
  mkt_co2e: 0,
  error: ""
});

export default function Electricity({ data = [], onResult, setData }) {
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

    if (field === "region" || field === "unit" || field === "method") {
      row.error = "";
      row.loc_co2e = 0;
      row.mkt_co2e = 0;
    }

    // if switching to location-based, clear custom factors
    if (field === "method" && value === "location") {
      row.mb_co2 = "";
      row.mb_ch4 = "";
      row.mb_n2o = "";
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
    if (!row.region || !row.unit) return "Select region and unit";
    if (!row.method) return "Select method";
    if (row.amount === "" || isNaN(row.amount) || Number(row.amount) <= 0) {
      return "Enter valid amount";
    }

    // location-based factors must exist
    if (!electricityEmissionFactors[row.region]) {
      return "Emission factor not found for region";
    }

    // market-based factors required only if method is market
    if (row.method === "market") {
      if (
        row.mb_co2 === "" || isNaN(row.mb_co2) || Number(row.mb_co2) < 0 ||
        row.mb_ch4 === "" || isNaN(row.mb_ch4) || Number(row.mb_ch4) < 0 ||
        row.mb_n2o === "" || isNaN(row.mb_n2o) || Number(row.mb_n2o) < 0
      ) {
        return "Enter valid market-based factors (lb/MWh)";
      }
    }

    return "";
  };

  const calcCO2eFromFactors = (row, factor) => {
    const amountNum = Number(row.amount);
    const mwh = row.unit === "kWh" ? amountNum / 1000 : amountNum;

    // factors in lb/MWh
    const co2_lb = factor.co2 * mwh;
    const ch4_lb = factor.ch4 * mwh;
    const n2o_lb = factor.n2o * mwh;

    const co2_kg = co2_lb * LB_TO_KG;
    const ch4_kg = ch4_lb * LB_TO_KG;
    const n2o_kg = n2o_lb * LB_TO_KG;

    const co2e_tons =
      co2_kg / 1000 +
      (ch4_kg * GWP.CH4) / 1000 +
      (n2o_kg * GWP.N2O) / 1000;

    return co2e_tons;
  };

  const calculateEmissions = async () => {
    const newRows = rows.map((row) => {
      const error = validateRow(row);
      if (error) {
        return { ...row, error, loc_co2e: 0, mkt_co2e: 0 };
      }

      // location-based (always calculated)
      const locFactor = electricityEmissionFactors[row.region];
      const loc_co2e = calcCO2eFromFactors(row, locFactor);

      // market-based (only if method is market)
      let mkt_co2e = 0;
      if (row.method === "market") {
        const mktFactor = {
          co2: Number(row.mb_co2),
          ch4: Number(row.mb_ch4),
          n2o: Number(row.mb_n2o)
        };
        mkt_co2e = calcCO2eFromFactors(row, mktFactor);
      }

      return { ...row, error: "", loc_co2e, mkt_co2e };
    });

    setRows(newRows);
    updateParent(newRows);

    if (newRows.some((r) => r.error)) return;

    const total_loc_CO2e = newRows.reduce(
      (sum, r) => sum + (r.loc_co2e || 0),
      0
    );
    const total_mkt_CO2e = newRows.reduce(
      (sum, r) => sum + (r.mkt_co2e || 0),
      0
    );

    try {
      await logInputsBatchToSupabase("electricity", newRows);
    } catch (err) {
      console.error("Failed to log electricity data:", err);
    }

    if (onResult) {
      onResult({
        total_loc_CO2e,
        total_mkt_CO2e,
        rows: newRows
      });
    }
  };

  const total_loc_CO2e = rows.reduce(
    (sum, r) => sum + (r.loc_co2e || 0),
    0
  );
  const total_mkt_CO2e = rows.reduce(
    (sum, r) => sum + (r.mkt_co2e || 0),
    0
  );

  return (
    <div className="electricity-container">
      <h2 className="electricity-title">Electricity Emissions</h2>

      <div className="electricity-rows">
        {rows.map((row, index) => (
          <div key={index} className="electricity-row">
            <div className="electricity-field">
              <label className="electricity-label">Method</label>
              <select
                className="electricity-select"
                value={row.method}
                onChange={(e) => updateRow(index, "method", e.target.value)}
              >
                <option value="location">Location-based (eGRID)</option>
                <option value="market">Market-based (custom factors)</option>
              </select>
            </div>

            <div className="electricity-field">
              <label className="electricity-label">eGRID Subregion</label>
              <select
                className="electricity-select"
                value={row.region}
                onChange={(e) => updateRow(index, "region", e.target.value)}
              >
                {eGridRegions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="electricity-field">
              <label className="electricity-label">Unit</label>
              <select
                className="electricity-select"
                value={row.unit}
                onChange={(e) => updateRow(index, "unit", e.target.value)}
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="electricity-field">
              <label className="electricity-label">
                Amount ({row.unit})
              </label>
              <input
                type="number"
                className="electricity-input"
                value={row.amount}
                onChange={(e) => updateRow(index, "amount", e.target.value)}
                min="0"
                step="any"
              />
            </div>

            {row.method === "market" && (
              <>
                <div className="electricity-field">
                  <label className="electricity-label">
                    CO2 factor (lb/MWh)
                  </label>
                  <input
                    type="number"
                    className="electricity-input"
                    value={row.mb_co2}
                    onChange={(e) => updateRow(index, "mb_co2", e.target.value)}
                    min="0"
                    step="any"
                  />
                </div>
                <div className="electricity-field">
                  <label className="electricity-label">
                    CH4 factor (lb/MWh)
                  </label>
                  <input
                    type="number"
                    className="electricity-input"
                    value={row.mb_ch4}
                    onChange={(e) => updateRow(index, "mb_ch4", e.target.value)}
                    min="0"
                    step="any"
                  />
                </div>
                <div className="electricity-field">
                  <label className="electricity-label">
                    N2O factor (lb/MWh)
                  </label>
                  <input
                    type="number"
                    className="electricity-input"
                    value={row.mb_n2o}
                    onChange={(e) => updateRow(index, "mb_n2o", e.target.value)}
                    min="0"
                    step="any"
                  />
                </div>
              </>
            )}

            <div className="electricity-row-actions">
              {rows.length > 1 && (
                <button
                  type="button"
                  className="electricity-remove-btn"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {row.error && <div className="electricity-alert">{row.error}</div>}
          </div>
        ))}
      </div>

      <div className="electricity-actions">
        <button
          type="button"
          className="electricity-add-btn"
          onClick={addRow}
        >
          Add Row
        </button>
        <button
          type="button"
          className="electricity-button"
          onClick={calculateEmissions}
        >
          Calculate Emissions
        </button>
      </div>

      <p className="electricity-note">
        Location-based results use fixed eGRID factors (lb/MWh). Market-based results use custom CO2, CH4, and N2O factors per MWh, with all gases converted to CO2e in metric tons.
      </p>

      <div className="electricity-total">
        Location-based CO2e:{" "}
        <strong>
          {total_loc_CO2e.toLocaleString(undefined, {
            maximumFractionDigits: 3
          })}{" "}
          t
        </strong>
      </div>
      <div className="electricity-total">
        Market-based CO2e:{" "}
        <strong>
          {total_mkt_CO2e.toLocaleString(undefined, {
            maximumFractionDigits: 3
          })}{" "}
          t
        </strong>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { steamFactors } from "../data/emissionFactors";
import { GWP } from "../data/gwpTable";
import { logInputsBatchToSupabase } from "../data/db";
import "./Steam.css";

// Fuel types used in the Steam sheet; must exist in steamFactors
const fuelTypes = [
  "Natural Gas",
  "Distillate Fuel Oil No. 2",
  "Residual Fuel Oil No. 6",
  "Kerosene",
  "Liquefied Petroleum Gases (LPG)",
  "Anthracite Coal",
  "Bituminous Coal",
  "Sub-bituminous Coal",
  "Lignite Coal",
  "Mixed (Commercial Sector)",
  "Mixed (Electric Power Sector)",
  "Mixed (Industrial Coking)",
  "Mixed (Industrial Sector)",
  "Coal Coke",
  "Municipal Solid Waste",
  "Petroleum Coke (Solid)",
  "Plastics",
  "Tires",
  "Agricultural Byproducts",
  "Peat",
  "Solid Byproducts",
  "Wood and Wood Residuals",
  "Propane Gas",
  "Landfill Gas",
  "Biodiesel (100%)",
  "Ethanol (100%)",
  "Rendered Animal Fat",
  "Vegetable Oil"
];

const units = ["MMBtu"]; // steam purchased in MMBtu

const createEmptyRow = () => ({
  method: "location",          // "location" or "market"
  fuelType: fuelTypes[0],
  boilerEfficiency: 80,        
  unit: units[0],
  steamPurchased: "",
  co2_kg: "",
  ch4_g: "",
  n2o_g: "",
  loc_co2e: 0,
  mkt_co2e: 0,
  error: ""
});

export default function Steam({ data = [], onResult, setData }) {
  const [rows, setRows] = useState(
    data && data.length > 0 ? data : [createEmptyRow()]
  );

  // Seed location-based factors from default steamFactors on first load
  useEffect(() => {
    setRows((prev) =>
      prev.map((row) => {
        const f = steamFactors[row.fuelType];
        if (!f) return row;
        return {
          ...row,
          co2_kg: f.co2.toString(),
          ch4_g: f.ch4.toString(),
          n2o_g: f.n2o.toString()
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParent = (updatedRows) => {
    if (setData) setData(updatedRows);
  };

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    const row = { ...newRows[index], [field]: value };

    if (
      field === "method" ||
      field === "fuelType" ||
      field === "steamPurchased" ||
      field === "boilerEfficiency"
    ) {
      row.error = "";
      row.loc_co2e = 0;
      row.mkt_co2e = 0;
    }

    // When fuel type changes, reset location-based defaults for that fuel
    if (field === "fuelType") {
      const f = steamFactors[value];
      if (f) {
        row.co2_kg = f.co2.toString();
        row.ch4_g = f.ch4.toString();
        row.n2o_g = f.n2o.toString();
      }
    }

    // When switching method, just clear market factors if going back to location
    if (field === "method" && value === "location") {
      row.co2_kg = "";
      row.ch4_g = "";
      row.n2o_g = "";
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
    if (!row.fuelType) return "Select fuel type";
    if (row.steamPurchased === "" || isNaN(row.steamPurchased) || Number(row.steamPurchased) <= 0) {
      return "Enter valid steam purchased (MMBtu)";
    }
    if (!steamFactors[row.fuelType]) return "Default emission factor not found for fuel";

    if (
      row.boilerEfficiency === "" ||
      isNaN(row.boilerEfficiency) ||
      Number(row.boilerEfficiency) <= 0 ||
      Number(row.boilerEfficiency) > 100
    ) {
      return "Enter boiler efficiency between 0 and 100";
    }

    if (row.method === "market") {
      if (
        row.co2_kg === "" || isNaN(row.co2_kg) ||
        row.ch4_g === "" || isNaN(row.ch4_g) ||
        row.n2o_g === "" || isNaN(row.n2o_g)
      ) {
        return "Enter market-based CO2 (kg), CH4 (g), and N2O (g) per MMBtu fuel";
      }
    }

    return "";
  };

  const calcCO2eFromPerSteam = (steamMmBtu, perSteam) => {
    const co2_kg = perSteam.co2_kg * steamMmBtu;
    const ch4_kg = (perSteam.ch4_g / 1000) * steamMmBtu;
    const n2o_kg = (perSteam.n2o_g / 1000) * steamMmBtu;

    return (
      co2_kg / 1000 +
      (ch4_kg * GWP.CH4) / 1000 +
      (n2o_kg * GWP.N2O) / 1000
    );
  };

  // Convert per‑fuel factors to per‑steam using boiler efficiency
  const fuelPerSteam = (fuelFctrs, effFrac) => ({
    co2_kg: fuelFctrs.co2 / effFrac,
    ch4_g: fuelFctrs.ch4 / effFrac,
    n2o_g: fuelFctrs.n2o / effFrac
  });

  const getFactorsPerSteam = (row) => {
    const eff = Number(row.boilerEfficiency) / 100;

    const fuelFctrs = {
      co2: Number(row.co2_kg || 0), // kg/MMBtu fuel
      ch4: Number(row.ch4_g || 0),  // g/MMBtu fuel
      n2o: Number(row.n2o_g || 0)   // g/MMBtu fuel
    };

    return fuelPerSteam(fuelFctrs, eff);
  };

  const calculateEmissions = async () => {
    const newRows = rows.map((row) => {
      const error = validateRow(row);
      if (error) return { ...row, error, loc_co2e: 0, mkt_co2e: 0 };

      const steamMmBtu = Number(row.steamPurchased);
      let loc_co2e = 0;
      let mkt_co2e = 0;

      if (row.method === "location") {
        const perSteam = getFactorsPerSteam(row);
        loc_co2e = calcCO2eFromPerSteam(steamMmBtu, perSteam);
      } else {
        const perSteam = getFactorsPerSteam(row);
        mkt_co2e = calcCO2eFromPerSteam(steamMmBtu, perSteam);
      }

      return { ...row, error: "", loc_co2e, mkt_co2e };
    });

    setRows(newRows);
    updateParent(newRows);

    if (newRows.some((r) => r.error)) return;

    const total_loc_CO2e = newRows.reduce((s, r) => s + (r.loc_co2e || 0), 0);
    const total_mkt_CO2e = newRows.reduce((s, r) => s + (r.mkt_co2e || 0), 0);

    try {
      await logInputsBatchToSupabase(
        "steam",
        newRows
      );
    } catch (err) {
      console.error("Failed to log steam data:", err);
    }

    if (onResult) {
      onResult({ total_loc_CO2e, total_mkt_CO2e });
    }
  };

  const total_loc_CO2e = rows.reduce((s, r) => s + (r.loc_co2e || 0), 0);
  const total_mkt_CO2e = rows.reduce((s, r) => s + (r.mkt_co2e || 0), 0);

  return (
    <div className="steam-container">
      <h2 className="steam-title">Steam Purchases</h2>

      <div className="steam-rows">
        {rows.map((row, index) => (
          <div key={index} className="steam-row">
            <div className="steam-field">
              <label className="steam-label">Method</label>
              <select
                className="steam-select"
                value={row.method}
                onChange={(e) => updateRow(index, "method", e.target.value)}
              >
                <option value="location">Location-based</option>
                <option value="market">Market-based</option>
              </select>
            </div>

            <div className="steam-field">
              <label className="steam-label">Fuel Type</label>
              <select
                className="steam-select"
                value={row.fuelType}
                onChange={(e) => updateRow(index, "fuelType", e.target.value)}
              >
                {fuelTypes.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="steam-field">
              <label className="steam-label">Boiler Efficiency (%)</label>
              <input
                type="number"
                className="steam-input"
                value={row.boilerEfficiency}
                onChange={(e) =>
                  updateRow(index, "boilerEfficiency", e.target.value)
                }
                min="1"
                max="100"
                step="any"
              />
            </div>

            <div className="steam-field">
              <label className="steam-label">Steam Purchased (MMBtu)</label>
              <input
                type="number"
                className="steam-input"
                value={row.steamPurchased}
                onChange={(e) =>
                  updateRow(index, "steamPurchased", e.target.value)
                }
                min="0"
                step="any"
              />
            </div>

            {/* Location-based inputs (always shown, defaulted from steamFactors) */}
            <div className="steam-field">
              <label className="steam-label">
                CO2 (kg/MMBtu fuel)
              </label>
              <input
                type="number"
                className="steam-input"
                value={row.co2_kg}
                onChange={(e) =>
                  updateRow(index, "co2_kg", e.target.value)
                }
                min="0"
                step="any"
              />
            </div>
            <div className="steam-field">
              <label className="steam-label">
                CH4 (g/MMBtu fuel)
              </label>
              <input
                type="number"
                className="steam-input"
                value={row.ch4_g}
                onChange={(e) =>
                  updateRow(index, "ch4_g", e.target.value)
                }
                min="0"
                step="any"
              />
            </div>
            <div className="steam-field">
              <label className="steam-label">
                N2O (g/MMBtu fuel)
              </label>
              <input
                type="number"
                className="steam-input"
                value={row.n2o_g}
                onChange={(e) =>
                  updateRow(index, "n2o_g", e.target.value)
                }
                min="0"
                step="any"
              />
            </div>

            <div className="steam-row-actions">
              {rows.length > 1 && (
                <button
                  type="button"
                  className="steam-remove-btn"
                  onClick={() => removeRow(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {row.error && <div className="steam-alert">{row.error}</div>}
          </div>
        ))}
      </div>

      <div className="steam-actions">
        <button
          type="button"
          className="steam-add-btn"
          onClick={addRow}
        >
          Add Row
        </button>
        <button
          type="button"
          className="steam-button"
          onClick={calculateEmissions}
        >
          Calculate Emissions
        </button>
      </div>

      <p className="steam-note">
        Emission factors are entered in kg CO2 and g CH4/N2O per MMBtu of fuel.
        Boiler efficiency converts these fuel-based factors to steam-based
        factors before CO2e is calculated.
      </p>

      <div className="steam-total">
        Location-based CO2e:{" "}
        <strong>
          {total_loc_CO2e.toLocaleString(undefined, {
            maximumFractionDigits: 3
          })}{" "}
          t
        </strong>
      </div>
      <div className="steam-total">
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

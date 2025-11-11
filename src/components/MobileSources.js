import React, { useState, useEffect } from "react";
import { mobileCombustion } from "../data/emissionFactors";
import { convertUnit } from "../data/unitConversions";
import { logInputsBatchToSupabase } from '../data/db';
import { GWP } from "../data/gwpTable";
import './MobileSources.css';

const onRoadVehicles = [
  "Passenger Cars - Gasoline",
  "Light Duty Trucks - Gasoline",
  "Heavy Duty Trucks - Diesel",
  "Motorcycles",
  "Buses",
];

const nonRoadVehicles = [
  "Ships and Boats",
  "Locomotives",
  "Aircraft",
  "Agricultural Equipment",
  "Construction Equipment",
  "Lawn and Garden Equipment",
  "Airport Equipment",
  "Industrial Equipment",
  "Logging Equipment",
  "Railroad Equipment",
  "Recreational Equipment",
];

const vehicleYearRanges = {
  "Passenger Cars - Gasoline": Array.from({ length: 2024 - 1984 + 1 }, (_, i) => 1984 + i),
  "Light Duty Trucks - Gasoline": Array.from({ length: 2024 - 1987 + 1 }, (_, i) => 1987 + i),
  "Heavy Duty Trucks - Diesel": Array.from({ length: 2024 - 1985 + 1 }, (_, i) => 1985 + i),
  "Motorcycles": Array.from({ length: 2024 - 1960 + 1 }, (_, i) => 1960 + i),
  "Buses": Array.from({ length: 2024 - 1980 + 1 }, (_, i) => 1980 + i),
};

const vehicleToFuelTypeMap = {
  "Passenger Cars - Gasoline": "Motor Gasoline",
  "Light Duty Trucks - Gasoline": "Motor Gasoline",
  "Heavy Duty Trucks - Diesel": "Diesel Fuel",
  "Motorcycles": "Motor Gasoline",
  "Buses": "Diesel Fuel",
};

function findEmission(obj, vehicleType, year) {
  const data = obj[vehicleType];
  if (!data) return { CH4: 0, N2O: 0 };
  for (const yearRange in data) {
    const [start, end] = yearRange.split("-").map(Number);
    if (year >= start && year <= end) return data[yearRange];
  }
  return { CH4: 0, N2O: 0 };
}

export default function MobileSources({ data = [], onResult, setData }) {
  const createEmptyRow = () => {
    const defVeh = onRoadVehicles[0];
    const defFuel = vehicleToFuelTypeMap[defVeh];
    return {
      onRoadStatus: "On-Road",
      vehicle: defVeh,
      vehicleYear: vehicleYearRanges[defVeh][0],
      qty: "",
      unit: mobileCombustion.fuelTypes[defFuel].usageUnit,
      fuel: defFuel,
      milesDriven: "",
      error: "",
    };
  };

  const [rows, setRows] = useState(data.length > 0 ? data : [createEmptyRow()]);

  useEffect(() => {
    if (data && data.length > 0) {
      setRows([...data]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateParent() {
    if (setData) {
      setData(rows);
    }
  }

  const getVehicleOptions = (onRoadStatus) =>
    onRoadStatus === "On-Road" ? onRoadVehicles : nonRoadVehicles;

  const getAvailableUnits = (vehicle, onRoadStatus) => {
    if (onRoadStatus === "On-Road") {
      const fuel = vehicleToFuelTypeMap[vehicle];
      const fuelType = mobileCombustion.fuelTypes[fuel];
      if (fuelType) {
        return [fuelType.usageUnit];
      }
    } else if (onRoadStatus === "Non-Road") {
      const fuelsObj = mobileCombustion.offRoadEmissions[vehicle];
      if (fuelsObj) {
        return [...new Set(Object.values(fuelsObj).map(f => f.unit))];
      }
    }
    return [];
  };

  const getVehicleYears = (vehicle, onRoadStatus) =>
    onRoadStatus === "On-Road" && vehicleYearRanges[vehicle]
      ? vehicleYearRanges[vehicle]
      : [];

  const updateRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };

    const getNonRoadFuels = (vehicle) =>
      mobileCombustion.offRoadEmissions[vehicle]
        ? Object.keys(mobileCombustion.offRoadEmissions[vehicle])
        : [];

    if (field === "onRoadStatus") {
      const vehicles = getVehicleOptions(value);
      const newVehicle = vehicles[0];
      const years = getVehicleYears(newVehicle, value);

      if (value === "On-Road") {
        const newFuel = vehicleToFuelTypeMap[newVehicle];
        const usageUnit = mobileCombustion.fuelTypes[newFuel]?.usageUnit || "";
        newRows[index] = {
          ...newRows[index],
          vehicle: newVehicle,
          vehicleYear: years.length > 0 ? years[0] : "",
          fuel: newFuel,
          unit: usageUnit,
          qty: "",
          milesDriven: "",
          error: "",
        };
      } else if (value === "Non-Road") {
        const allowedFuels = getNonRoadFuels(newVehicle);
        const newFuel = allowedFuels[0] || "";
        const unit = (newFuel && mobileCombustion.offRoadEmissions[newVehicle]?.[newFuel]?.unit) || "";
        newRows[index] = {
          ...newRows[index],
          vehicle: newVehicle,
          vehicleYear: "",
          fuel: newFuel,
          unit,
          qty: "",
          milesDriven: "",
          error: "",
        };
      }
    }

    if (field === "vehicle") {
      const years = getVehicleYears(value, newRows[index].onRoadStatus);
      if (newRows[index].onRoadStatus === "On-Road") {
        const newFuel = vehicleToFuelTypeMap[value];
        const usageUnit = mobileCombustion.fuelTypes[newFuel]?.usageUnit || "";
        newRows[index] = {
          ...newRows[index],
          vehicleYear: years.length > 0 ? years[0] : "",
          fuel: newFuel,
          unit: usageUnit,
          qty: "",
          milesDriven: "",
          error: "",
        };
      } else if (newRows[index].onRoadStatus === "Non-Road") {
        const allowedFuels = getNonRoadFuels(value);
        const newFuel = allowedFuels[0] || "";
        const unit = (newFuel && mobileCombustion.offRoadEmissions[value]?.[newFuel]?.unit) || "";
        newRows[index] = {
          ...newRows[index],
          fuel: newFuel,
          unit,
          vehicleYear: "",
          qty: "",
          milesDriven: "",
          error: "",
        };
      }
    }

    if (field === "fuel" && newRows[index].onRoadStatus === "Non-Road") {
      const vehicle = newRows[index].vehicle;
      const unit = (value && mobileCombustion.offRoadEmissions[vehicle]?.[value]?.unit) || "";
      newRows[index].unit = unit;
      newRows[index].qty = "";
      newRows[index].error = "";
    }

    setRows(newRows);
  };

  const validateRow = (row) => {
    if (!row.onRoadStatus) return "Select On-Road or Non-Road status";
    if (!row.vehicle) return "Vehicle Type is required";
    if (row.onRoadStatus === "On-Road" && !row.vehicleYear) return "Select vehicle year";
    if (row.qty === "" || isNaN(row.qty) || Number(row.qty) <= 0) return "Enter valid quantity";
    if (row.onRoadStatus === "On-Road" && (row.milesDriven === "" || isNaN(row.milesDriven) || Number(row.milesDriven) <= 0))
      return "Enter valid miles driven";
    const availableUnits = getAvailableUnits(row.vehicle, row.onRoadStatus);
    if (!availableUnits.includes(row.unit)) return `Unit must be one of: ${availableUnits.join(", ")}`;
    return "";
  };

  const calculateEmissions = async () => {
    const newRows = rows.map(row => ({ ...row, error: validateRow(row) }));
    setRows(newRows);

    if (newRows.some(r => r.error)) return;

    let total_CO2e = 0;
    newRows.forEach(row => {
      const fuelFactor = mobileCombustion.fuelTypes[row.fuel];
      const qtyNum = Number(row.qty);
      const convertedQty = convertUnit(qtyNum, row.unit, fuelFactor.usageUnit);
      const co2 = convertedQty * (fuelFactor.CO2 / 1000);

      let ch4 = 0, n2o = 0, miles = Number(row.milesDriven);
      if (row.onRoadStatus === "On-Road") {
        if (["Passenger Cars - Gasoline", "Light Duty Trucks - Gasoline", "Motorcycles"].includes(row.vehicle)) {
          const emission = findEmission(mobileCombustion.onRoadGasolineEmissions, row.vehicle, row.vehicleYear);
          ch4 = (emission.CH4 * miles) / 1000;
          n2o = (emission.N2O * miles) / 1000;
        } else if (["Heavy Duty Trucks - Diesel", "Buses"].includes(row.vehicle)) {
          const emission = findEmission(mobileCombustion.onRoadDieselEmissions, row.vehicle, row.vehicleYear);
          ch4 = (emission.CH4 * miles) / 1000;
          n2o = (emission.N2O * miles) / 1000;
        }
      }
      const co2e = (co2 * GWP.CO2 + ch4 * GWP.CH4 + n2o * GWP.N2O) / 1000;
      total_CO2e += co2e;
      row.CO2e = co2e;
    });
    await logInputsBatchToSupabase('mobile_sources', newRows);
    updateParent();
    onResult({ total_CO2e });
  };

  const addRow = () => setRows([...rows, createEmptyRow()]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  return (
    <div className="mobile-sources">
      <h3>Mobile/Vehicle Emissions</h3>
      <div className="rows-container">
        {rows.map((row, index) => {
          const vehicles = getVehicleOptions(row.onRoadStatus);
          const years = getVehicleYears(row.vehicle, row.onRoadStatus);
          return (
            <div key={index} className="input-row">
              <div className="onroad-select">
                <label>On-Road or Non-Road:</label>
                <select value={row.onRoadStatus} onChange={e => updateRow(index, "onRoadStatus", e.target.value)}>
                  <option value="On-Road">On-Road</option>
                  <option value="Non-Road">Non-Road</option>
                </select>
              </div>
              <div className="vehicle-select">
                <label>Vehicle Type:</label>
                <select value={row.vehicle} onChange={e => updateRow(index, "vehicle", e.target.value)}>
                  {vehicles.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              {row.onRoadStatus === "On-Road" && years.length > 0 && (
                <div className="year-select">
                  <label>Vehicle Year:</label>
                  <select value={row.vehicleYear} onChange={e => updateRow(index, "vehicleYear", e.target.value)}>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                </div>
              )}
              <div className="quantity-input">
                <label>Fuel Used:</label>
                <input type="number" value={row.qty} onChange={e => updateRow(index, "qty", e.target.value)} min="0" step="any" />
              </div>
              <div className="unit-select">
                <label>Unit:</label>
                <select value={row.unit} onChange={e => updateRow(index, "unit", e.target.value)}>
                  {getAvailableUnits(row.vehicle, row.onRoadStatus).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                </select>
              </div>
              {row.onRoadStatus === "On-Road" && (
                <div className="miles-input">
                  <label>Miles Driven:</label>
                  <input type="number" value={row.milesDriven} onChange={e => updateRow(index, "milesDriven", e.target.value)} min="0" step="any" />
                </div>
              )}
              <div className="row-actions">
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(index)} className="remove-btn">Remove</button>
                )}
              </div>
              {row.error && (
                <div className="error-message">{row.error}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="actions">
        <button type="button" onClick={addRow} className="add-btn">Add Row</button>
        <button type="button" onClick={calculateEmissions} className="calculate-btn">Calculate Emissions</button>
      </div>
    </div>
  );
}

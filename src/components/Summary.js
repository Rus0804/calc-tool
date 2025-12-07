import React from "react";
import "./Summary.css";

function sumValues(values) {
  return values.reduce((acc, val) => acc + (val || 0), 0);
}

export default function Summary({ data, meta }) {
  console.log(data)
  function getCO2e(sectionKey) {
    const sectionData = data?.[sectionKey];
    if (!sectionData) return 0;

    if (Array.isArray(sectionData)) {
      return sectionData.reduce((sum, row) => sum + (row.CO2e || 0), 0);
    }

    if (sectionData.rows && Array.isArray(sectionData.rows)) {
      return sectionData.rows.reduce((sum, row) => sum + (row.CO2e || 0), 0);
    }

    return sectionData.total_CO2e ?? sectionData.co2e ?? 0;
  }

  const grossScope1 = sumValues([
    getCO2e("stationary"),
    getCO2e("mobile"),
    getCO2e("refrig"),
    getCO2e("fireSuppression"),
    getCO2e("purchasedGases"),
  ]);

  const grossScope2Loc = (data?.elec?.total_loc_CO2e || 0) + (data?.steam?.total_loc_CO2e || 0);
  const grossScope2Mkt = (data?.elec?.total_mkt_CO2e || 0) + (data?.steam?.total_mkt_CO2e || 0);

  const grossScope3 = sumValues([
    getCO2e("busTravel"),
    getCO2e("commuting"),
    getCO2e("upstream"),
    getCO2e("waste"),
  ]);

  const offsetsScope1 = data?.offsets?.scope1Offsets || 0;
  const offsetsScope2Loc = data?.offsets?.scope2locOffsets || 0;
  const offsetsScope2Mkt = data?.offsets?.scope2mktOffsets || 0;
  const offsetsScope3 = data?.offsets?.scope3Offsets || 0;

  const total =
    grossScope1 - Math.abs(offsetsScope1) +
    grossScope2Loc - Math.abs(offsetsScope2Loc) +
    grossScope2Mkt - Math.abs(offsetsScope2Mkt) +
    grossScope3 - Math.abs(offsetsScope3);

  const rows = [
    {
      section: "Metadata", items: [
        ["Organization Name", meta?.orgName || "-"],
        ["Reporting Period", meta?.reportingPeriod || "-"],
        ["Preparer Name", meta?.preparer || "-"],
        ["Contact Info", meta?.contact || "-"],
      ]
    },
    {
      section: "Scope 1 Emissions", items: [
        ["Stationary Combustion", getCO2e("stationary")],
        ["Mobile Sources", getCO2e("mobile")],
        ["Refrigeration/AC", getCO2e("refrig")],
        ["Fire Suppression", getCO2e("fireSuppression")],
        ["Purchased Gases", getCO2e("purchasedGases")],
        ["Gross Scope 1", grossScope1],
        ["Offsets", offsetsScope1 ? -Math.abs(offsetsScope1) : 0],
        ["Net Scope 1", (grossScope1 - Math.abs(offsetsScope1)) > 0? grossScope1 - Math.abs(offsetsScope1): 0],
      ]
    },
    {
      section: "Scope 2 (Location-Based)", items: [
        ["Electricity", data?.elec?.total_loc_CO2e || 0],
        ["Steam", data?.steam?.total_loc_CO2e || 0],
        ["Gross Scope 2 (Loc)", grossScope2Loc],
        ["Offsets", offsetsScope2Loc ? -Math.abs(offsetsScope2Loc) : 0],
        ["Net Scope 2 (Loc)", (grossScope2Loc - Math.abs(offsetsScope2Loc)) > 0? grossScope2Loc - Math.abs(offsetsScope2Loc): 0],
      ]
    },
    {
      section: "Scope 2 (Market-Based)", items: [
        ["Electricity", data?.elec?.total_mkt_CO2e || 0],
        ["Steam", data?.steam?.total_mkt_CO2e || 0],
        ["Gross Scope 2 (Mkt)", grossScope2Mkt],
        ["Offsets", offsetsScope2Mkt ? -Math.abs(offsetsScope2Mkt) : 0],
        ["Net Scope 2 (Mkt)", (grossScope2Mkt - Math.abs(offsetsScope2Mkt)) > 0? grossScope2Mkt - Math.abs(offsetsScope2Mkt): 0],
      ]
    },
    {
      section: "Scope 3 Emissions", items: [
        ["Business Travel", getCO2e("busTravel")],
        ["Commuting", getCO2e("commuting")],
        ["Upstream Transportation", getCO2e("upstream")],
        ["Waste", getCO2e("waste")],
        ["Gross Scope 3", grossScope3],
        ["Offsets", offsetsScope3 ? -Math.abs(offsetsScope3) : 0],
        ["Net Scope 3", (grossScope3 - Math.abs(offsetsScope3)) > 0? grossScope3 - Math.abs(offsetsScope3): 0],
      ]
    },
    {
      section: "Supplemental Information", items: [
        ["Biomass CO₂ from Stationary", data?.stationary?.biomass_CO2e || 0],
        ["Biomass CO₂ from Mobile", data?.mobile?.biomass_CO2e || 0],
      ]
    }
  ];

  return (
    <div className="summary-card">
      <h2>Annual GHG Emissions Summary</h2>
      
      {rows.map(({ section, items }) => (
        <div key={section} className="summary-section">
          <h3>{section}</h3>
          {items.map(([label, value]) => {
            const isMetadata = section === "Metadata";
            const displayValue =
              value === undefined || value === null
                ? ""
                : isMetadata
                ? value
                : `${Number(value).toLocaleString()} metric tons CO₂e`;

            return (
              <p key={label}>
                <strong>{label}:</strong> {displayValue}
              </p>
            );
          })}
          <hr />
        </div>
      ))}

      <div className="summary-total">
        <h3>
          Total Net Annual GHG Emissions: {(total > 0)?(total.toLocaleString()): '0'} metric tons CO₂e
        </h3>
      </div>
    </div>
  );
}

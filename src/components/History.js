import React, { useEffect, useState } from "react";
import { supabase } from "../data/db";
import { logInputsBatchToSupabase } from "../data/db";
import "./History.css";

const SECTION_LABELS = {
  stationary_combustion: "Stationary Combustion",
  mobile_sources: "Mobile Sources",
  electricity: "Electricity",
  refrigeration_ac: "RefrigerationAC",
  waste: "Waste",
  steam: "Steam",
  business_travel: "Business Travel",
  commuting: "Commuting",
  upstream_transportation: "Upstream Transportation",
  purchased_gases: "Purchased Gases",
  fire_suppression: "Fire Suppression",
  offsets: "Offsets",
  summary: "Summary",
};

function renderItemDetails(item, section) {
  if (section === "stationary_combustion") {
    return (
      <div className="value-row">
        <div><strong>Quantity:</strong> {item.qty}</div>
        <div><strong>Fuel:</strong> {item.fuel}</div>
        <div><strong>Unit:</strong> {item.unit}</div>
        <div><strong>CO₂e:</strong> {Number(item.CO2e).toLocaleString()}</div>
        {item.error && <div className="error-text">Error: {item.error}</div>}
      </div>
    );
  }
  if (section === "mobile_sources") {
    return (
      <div className="value-row">
        <div><strong>Vehicle:</strong> {item.vehicle}</div>
        <div><strong>Vehicle Year:</strong> {item.vehicleYear}</div>
        <div><strong>On-Road Status:</strong> {item.onRoadStatus}</div>
        <div><strong>Quantity:</strong> {item.qty}</div>
        <div><strong>Unit:</strong> {item.unit}</div>
        <div><strong>Fuel:</strong> {item.fuel}</div>
        <div><strong>Miles Driven:</strong> {item.milesDriven}</div>
        <div><strong>CO₂e:</strong> {Number(item.CO2e).toLocaleString()}</div>
        {item.error && <div className="error-text">Error: {item.error}</div>}
      </div>
    );
  }
  if (typeof item === "object" && item !== null) {
    return (
      <ul className="section-item-list">
        {Object.entries(item).map(([key, value]) =>
          key !== "error" ? (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          ) : ""
        )}
      </ul>
    );
  }
  return <span>{String(item)}</span>;
}

export default function History({
  setStationaryCombustion,
  setMobileSources,
  setElectricity,
  setRefrigeration,
  setWaste,
  setSteam,
  setBusinessTravel,
  setCommuting,
  setUpstreamTransportation,
  setPurchasedGases,
  setFireSuppression,
  setOffsets,
  setPage,
  setNav
}) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    async function fetchHistory() {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("Inputs")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch history:", error);
        setHistory([]);
      } else {
        setHistory(data);
      }
      setLoading(false);
    }
    fetchHistory();
  }, []);

  const toggleSection = (recordId, section) => {
    setOpenSections((prev) => {
      const current = prev[recordId]?.includes(section);
      let updatedSections;
      if (current) {
        updatedSections = prev[recordId].filter((s) => s !== section);
      } else {
        updatedSections = prev[recordId]
          ? [...prev[recordId], section]
          : [section];
      }
      return { ...prev, [recordId]: updatedSections };
    });
  };

  async function handleLoadData(recordId) {
    const { data, error } = await supabase
      .from("Inputs")
      .select("*")
      .eq("id", recordId)
      .single();

    if (error) {
      console.error("Failed to load record:", error.message);
      alert("Failed to load data record.");
      return;
    }

    localStorage.setItem("rowID", recordId);

    setStationaryCombustion(data.stationary_combustion || []);
    setMobileSources(data.mobile_sources || []);
    setElectricity(data.electricity || []);
    setRefrigeration(data.refrigeration_ac || []);
    setWaste(data.waste || []);
    setSteam(data.steam || []);
    setBusinessTravel(data.business_travel || []);
    setCommuting(data.commuting || []);
    setUpstreamTransportation(data.upstream_transportation || []);
    setPurchasedGases(data.purchased_gases || []);
    setFireSuppression(data.fire_suppression || []);
    setOffsets(data.offsets || []);

    setPage("calculation");
    setNav(0);
  }

  // NEW: rename handler
  async function handleRename(record) {
    const currentName = record.project_name || "";
    const newName = window.prompt("Enter new project name:", currentName);

    if (newName === null) return; // user cancelled
    if (!newName.trim()) {
      alert("Project name cannot be empty.");
      return;
    }

    // Ensure logInputs updates this specific record
    localStorage.setItem("rowID", record.id.toString());

    // Update only project_name in this row
    await logInputsBatchToSupabase("", { project_name: newName.trim() });

    // Reflect change in local state
    setHistory((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, project_name: newName.trim() } : r
      )
    );
  }

  if (loading) {
    return <p>Loading history...</p>;
  }

  return (
    <div className="history-container">
      <h2>Submission History</h2>
      {history.length === 0 ? (
        <p>No history records found.</p>
      ) : (
        <ul className="history-list">
          {history.map((record) => {
            const sectionsWithData = Object.entries(SECTION_LABELS).filter(
              ([section]) => record[section]
            );
            return (
              <li key={record.id}>
                <div className="history-list-header">
                  <span>{record.project_name} </span>
                  <span>
                    Submitted on:{" "}
                    {new Date(record.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleLoadData(record.id)}
                    className="load-data-button"
                    aria-label={`Load data from record submitted on ${new Date(
                      record.created_at
                    ).toLocaleString()}`}
                  >
                    Load Data
                  </button>
                  <button
                    className="rename-project-button"
                    onClick={() => handleRename(record)}
                  >
                    Rename
                  </button>
                </div>
                <div>
                  {sectionsWithData.length === 0 && <em>No tab data found</em>}
                  {sectionsWithData.map(([section, label]) => {
                    const isOpen = openSections[record.id]?.includes(section);
                    const sectionData = record[section];

                    let totalCO2e = 0;
                    if (Array.isArray(sectionData)) {
                      totalCO2e = sectionData.reduce(
                        (sum, row) => sum + (row.CO2e || 0),
                        0
                      );
                    }

                    return (
                      <div className="section-container" key={section}>
                        <button
                          onClick={() => toggleSection(record.id, section)}
                          className="section-button"
                          aria-expanded={isOpen}
                          aria-controls={`${record.id}-${section}`}
                        >
                          {label} {isOpen ? "▲" : "▼"}
                        </button>

                        {totalCO2e > 0 && (
                          <div className="total-co2e">
                            Total CO₂e: {totalCO2e.toLocaleString()}
                          </div>
                        )}

                        {isOpen && (
                          <div
                            id={`${record.id}-${section}`}
                            className="section-details"
                          >
                            {Array.isArray(sectionData)
                              ? sectionData.map((item, index) => (
                                  <div className="section-row" key={index}>
                                    <strong>{index + 1}.</strong>{" "}
                                    {renderItemDetails(item, section)}
                                  </div>
                                ))
                              : renderItemDetails(sectionData, section)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

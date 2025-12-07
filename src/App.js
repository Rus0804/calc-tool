import React, { useState, useEffect } from "react";
import Home from "./components/Home.js";
import Login from "./components/Login";
import { supabase } from "./data/db";
import StationaryCombustion from "./components/StationaryCombustion";
import MobileSources from "./components/MobileSources";
import Electricity from "./components/Electricity";
import RefrigerationAC from "./components/RefrigerationAC";
import Waste from "./components/Waste";
import Summary from "./components/Summary";
// import Navigation from "./components/Navigation"; // no longer used
import Steam from "./components/Steam";
import BusinessTravel from "./components/BusinessTravel";
import Commuting from "./components/Commuting";
import UpstreamTransportation from "./components/UpstreamTransportation";
import PurchasedGases from "./components/PurchasedGases";
import FireSuppression from "./components/FireSuppression";
import Offsets from "./components/Offsets";
import History from "./components/History";
import UserDetails from "./components/UserDetails";
import { CssBaseline, Container, Box, Button } from "@mui/material";

const SCOPE_SECTIONS = {
  "Scope 1": [
    { key: "stationary", label: "Stationary Combustion" },
    { key: "mobile", label: "Mobile Sources" },
    { key: "purchasedGases", label: "Purchased Gases" },
    { key: "fireSuppression", label: "Fire Suppression" },
    { key: "refrig", label: "Refrigeration" }
  ],
  "Scope 2": [
    { key: "elec", label: "Electricity" },
    { key: "steam", label: "Steam" }
  ],
  "Scope 3": [
    { key: "waste", label: "Waste" },
    { key: "busTravel", label: "Business Travel" },
    { key: "commuting", label: "Commuting" },
    { key: "upstream", label: "Upstream Transportation" }
  ]
  // Offsets and Summary handled separately
};

const FIRST_SECTION_BY_SCOPE = {
  "Scope 1": "stationary",
  "Scope 2": "elec",
  "Scope 3": "waste"
};

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(
    () => localStorage.getItem("currentPage") || "home"
  );

  // Scope + section selection for calculation view
  const [currentScope, setCurrentScope] = useState("Scope 1");
  const [currentSection, setCurrentSection] = useState(
    FIRST_SECTION_BY_SCOPE["Scope 1"]
  );

  // State for each input section
  const [stationaryCombustion, setStationaryCombustion] = useState([]);
  const [mobileSources, setMobileSources] = useState([]);
  const [electricity, setElectricity] = useState([]);
  const [refrigeration, setRefrigeration] = useState([]);
  const [waste, setWaste] = useState([]);
  const [steam, setSteam] = useState([]);
  const [businessTravel, setBusinessTravel] = useState([]);
  const [commuting, setCommuting] = useState([]);
  const [upstreamTransportation, setUpstreamTransportation] = useState([]);
  const [purchasedGases, setPurchasedGases] = useState([]);
  const [fireSuppression, setFireSuppression] = useState([]);
  const [offsets, setOffsets] = useState([]);

  // Aggregated results for final summary or other use
  const [results, setResults] = useState({});

  function handleResult(tab, val) {
    setResults((r) => ({ ...r, [tab]: val }));
  }

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPage("home");
    localStorage.removeItem("currentPage");
  };

  if (!user) {
    return <Login />;
  }

  if (page === "home") {
    return (
      <>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Home
          onStart={() => setPage("calculation")}
          onHistory={() => setPage("history")}
          onUserDetails={() => setPage("userDetails")}
        />
      </>
    );
  }

  if (page === "history") {
    return (
      <>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPage("home")}
          >
            Home
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Container maxWidth="md">
          <History
            setStationaryCombustion={setStationaryCombustion}
            setMobileSources={setMobileSources}
            setPurchasedGases={setPurchasedGases}
            setFireSuppression={setFireSuppression}
            setRefrigeration={setRefrigeration}
            setWaste={setWaste}
            setElectricity={setElectricity}
            setSteam={setSteam}
            setBusinessTravel={setBusinessTravel}
            setCommuting={setCommuting}
            setUpstreamTransportation={setUpstreamTransportation}
            setOffsets={setOffsets}
            setPage={setPage}
            // setNav removed; not needed with dropdowns
          />
        </Container>
      </>
    );
  }

  if (page === "userDetails") {
    return (
      <>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPage("home")}
          >
            Home
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Container maxWidth="md">
          <UserDetails />
        </Container>
      </>
    );
  }

  if (page === "calculation") {
    return (
      <>
        <CssBaseline />
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setPage("home");
              localStorage.setItem("rowID", "0");
              setResults({});
            }}
          >
            Home
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Scope + section selectors */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
          <select
            value={currentScope}
            onChange={(e) => {
              const scope = e.target.value;
              setCurrentScope(scope);
              if (scope === "Offsets" || scope === "Summary") {
                setCurrentSection(scope.toLowerCase()); // "offsets" or "summary"
              } else {
                setCurrentSection(FIRST_SECTION_BY_SCOPE[scope]);
              }
            }}
          >
            <option value="Scope 1">Scope 1</option>
            <option value="Scope 2">Scope 2</option>
            <option value="Scope 3">Scope 3</option>
            <option value="Offsets">Offsets</option>
            <option value="Summary">Summary</option>
          </select>

          {/* Only show section dropdown for scopes 1–3 */}
          {currentScope === "Scope 1" ||
          currentScope === "Scope 2" ||
          currentScope === "Scope 3" ? (
            <select
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
            >
              {SCOPE_SECTIONS[currentScope].map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          ) : null}
        </Box>

        <Container maxWidth="md">
          <Box sx={{ mt: 3 }}>
            {/* Scope 1 */}
            {currentSection === "stationary" && (
              <StationaryCombustion
                data={stationaryCombustion}
                onResult={(val) => handleResult("stationary", val)}
                setData={setStationaryCombustion}
              />
            )}
            {currentSection === "mobile" && (
              <MobileSources
                data={mobileSources}
                onResult={(val) => handleResult("mobile", val)}
                setData={setMobileSources}
              />
            )}
            {currentSection === "purchasedGases" && (
              <PurchasedGases
                data={purchasedGases}
                onResult={(val) => handleResult("purchasedGases", val)}
                setData={setPurchasedGases}
              />
            )}
            {currentSection === "fireSuppression" && (
              <FireSuppression
                data={fireSuppression}
                onResult={(val) => handleResult("fireSuppression", val)}
                setData={setFireSuppression}
              />
            )}
            {currentSection === "refrig" && (
              <RefrigerationAC
                data={refrigeration}
                onResult={(val) => handleResult("refrig", val)}
                setData={setRefrigeration}
              />
            )}

            {/* Scope 3 & 2 */}
            {currentSection === "waste" && (
              <Waste
                data={waste}
                onResult={(val) => handleResult("waste", val)}
              />
            )}
            {currentSection === "elec" && (
              <Electricity
                data={electricity}
                onResult={(val) => handleResult("elec", val)}
              />
            )}
            {currentSection === "steam" && (
              <Steam
                data={steam}
                onResult={(val) => handleResult("steam", val)}
              />
            )}
            {currentSection === "busTravel" && (
              <BusinessTravel
                data={businessTravel}
                onResult={(val) => handleResult("busTravel", val)}
                setData={setBusinessTravel}
              />
            )}
            {currentSection === "commuting" && (
              <Commuting
                data={commuting}
                onResult={(val) => handleResult("commuting", val)}
                setData={setCommuting}
              />
            )}
            {currentSection === "upstream" && (
              <UpstreamTransportation
                data={upstreamTransportation}
                onResult={(val) => handleResult("upstream", val)}
                setData={setUpstreamTransportation}
              />
            )}

            {/* Offsets separate */}
            {currentSection === "offsets" && (
              <Offsets
                data={offsets}
                onResult={(val) => handleResult("offsets", val)}
                setData={setOffsets}
              />
            )}

            {/* Summary */}
            {currentSection === "summary" && <Summary data={results} />}
          </Box>
        </Container>
      </>
    );
  }

  return null;
}

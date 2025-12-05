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
import Navigation from "./components/Navigation";
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

const TABS = [
  "Stationary Combustion",
  "Mobile Sources",
  "Purchased Gases",
  "Fire Suppression",
  "Refrigeration",
  "Waste",
  "Electricity",
  "Steam",
  "Business Travel",
  "Commuting",
  "Upstream Transportation", 
  "Offsets",
  "Summary",
];

export default function App() {
  const [nav, setNav] = useState(0);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState(
    () => localStorage.getItem("currentPage") || "home"
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
    setNav(TABS.length - 1);
  }

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", page);
  }, [page]);

  // Logout handler
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
            setNav={setNav}
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
        <Navigation value={nav} setValue={setNav} tabs={TABS} />
        <Container maxWidth="md">
          <Box sx={{ mt: 3 }}>
            {nav === 0 && (
              <StationaryCombustion
                data={stationaryCombustion}
                onResult={(val) => handleResult("stationary", val)}
                setData={setStationaryCombustion}
              />
            )}
            {nav === 1 && (
              <MobileSources
                data={mobileSources}
                onResult={(val) => handleResult("mobile", val)}
                setData={setMobileSources}
              />
            )}
            {nav === 2 && (
              <PurchasedGases
                data={purchasedGases}
                onResult={(val) => handleResult("purchasedGases", val)}
                setData={setPurchasedGases}
              />
            )}
            {nav === 3 && (
              <FireSuppression
                data={fireSuppression}
                onResult={(val) => handleResult("fireSuppression", val)}
                setData={setFireSuppression}
              />
            )}
            {nav === 4 && (
              <RefrigerationAC
                data={refrigeration}
                onResult={(val) => handleResult("refrig", val)}
                setData={setRefrigeration}
              />
            )}
            {nav === 5 && (
              <Waste
                data={waste}
                onResult={(val) => handleResult("waste", val)}
              />
            )}
            {nav === 6 && (
              <Electricity
                data={electricity}
                onResult={(val) => handleResult("elec", val)}
              />
            )}
            {nav === 7 && (
              <Steam
                data={steam}
                onResult={(val) => handleResult("steam", val)}
              />
            )}
            {nav === 8 && (
              <BusinessTravel
                data={businessTravel}
                onResult={(val) => handleResult("busTravel", val)}
                setData={setBusinessTravel}
              />
            )}
            {nav === 9 && (
              <Commuting
                data={commuting}
                onResult={(val) => handleResult("commuting", val)}
                setData={setCommuting}
              />
            )}
            {nav === 10 && (
              <UpstreamTransportation
                data={upstreamTransportation}
                onResult={(val) => handleResult("upstream", val)}
                setData={setUpstreamTransportation}
              />
            )}
            {nav === 11 && (
              <Offsets
                data={offsets}
                onResult={(val) => handleResult("offsets", val)}
                setData={setOffsets}
              />
            )}
            {nav === 12 && <Summary data={results} />}

            
          </Box>
        </Container>
      </>
    );
  }

  return null;
}

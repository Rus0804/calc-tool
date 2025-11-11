import React from "react";
import { Tabs, Tab, AppBar } from "@mui/material";

export default function Navigation({ value, setValue, tabs }) {
  return (
    <AppBar position="static" color="default">
      <Tabs
        value={value}
        onChange={(e, v) => setValue(v)}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map(tab => <Tab key={tab} label={tab} />)}
      </Tabs>
    </AppBar>
  );
}

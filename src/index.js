import React from "react";
import { createRoot } from "react-dom/client";  // Note the new import!
import App from "./App";

const root = createRoot(document.getElementById('root'));
root.render(<App />);

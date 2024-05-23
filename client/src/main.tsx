import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Nav } from "./components/nav.tsx";
import { Footer } from "./components/footer.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <App />
      {/* <Footer /> */}
    </Router>
  </React.StrictMode>
);

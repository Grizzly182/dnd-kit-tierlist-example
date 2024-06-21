import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import TierList from "./TierList";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <TierList />
  </StrictMode>
);

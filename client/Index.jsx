import * as ReactDOMClient from "react-dom/client";
import { logger } from "@/Services/Logger/Index";
import App from "./App";

logger.init({});

const root = ReactDOMClient.createRoot(document.getElementById("shopify-app"));
root.render(<App />);

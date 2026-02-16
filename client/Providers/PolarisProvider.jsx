import { AppProvider, Frame } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";

export function PolarisProvider({ children }) {
  return (
    <AppProvider i18n={translations}>
      <Frame>{children}</Frame>
    </AppProvider>
  );
}

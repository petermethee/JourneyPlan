import { useMemo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  primaryColor,
  goldenColor,
  defaultWhite,
  primErrorColor,
  secErrorColor,
  primValidColor,
  secValidColor,
  lightSecondaryBlue,
  darkSecondaryBlue,
} from "./style/cssGlobalStyle";
import { ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";

function Index() {
  const theme = useMemo(() => {
    document.documentElement.style.setProperty("--primaryColor", primaryColor);
    document.documentElement.style.setProperty("--goldenColor", goldenColor);
    document.documentElement.style.setProperty("--defaultWhite", defaultWhite);

    document.documentElement.style.setProperty(
      "--primErrorColor",
      primErrorColor
    );
    document.documentElement.style.setProperty(
      "--secErrorColor",
      secErrorColor
    );
    document.documentElement.style.setProperty(
      "--primValidColor",
      primValidColor
    );
    document.documentElement.style.setProperty(
      "--secValidColor",
      secValidColor
    );

    document.documentElement.style.setProperty(
      "--lightSecondaryBlue",
      lightSecondaryBlue
    );
    document.documentElement.style.setProperty(
      "--darkSecondaryBlue",
      darkSecondaryBlue
    );
    return createTheme({
      typography: { fontFamily: "Garamond, serif" },
      palette: {
        primary: {
          main: primaryColor,
        },
        secondary: {
          main: goldenColor,
        },
        success: {
          main: primValidColor,
        },
        error: {
          main: primErrorColor,
        },
      },
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Index />);

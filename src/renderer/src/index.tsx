import { useMemo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  primaryColor,
  goldenColor,
  primErrorColor,
  primValidColor,
  colorArray,
} from "./style/cssGlobalStyle";
import { ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./app/store";
import dayjs from "dayjs";

dayjs.locale("fr");

function Index() {
  const theme = useMemo(() => {
    Object.entries(colorArray).forEach(([colorName, hex]) =>
      document.documentElement.style.setProperty("--" + colorName, hex),
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
  document.getElementById("root") as HTMLElement,
);
root.render(<Index />);

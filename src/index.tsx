import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  primaryColor,
  secondaryColor,
  defaultWhite,
  depenseColor,
  depenseSecondaryColor,
  revenuColor,
  revenuSecondaryColor,
  beneficeColor,
  beneficeSecondaryColor,
  lightSecondaryBlue,
  darkSecondaryBlue,
} from "./MuiStyle/MuiStyle";
import { ThemeProvider, createTheme } from "@mui/material";

function Index() {
  const theme = useMemo(() => {
    document.documentElement.style.setProperty("--primaryColor", primaryColor);
    document.documentElement.style.setProperty(
      "--secondaryColor",
      secondaryColor
    );
    document.documentElement.style.setProperty("--defaultWhite", defaultWhite);

    document.documentElement.style.setProperty("--depense", depenseColor);
    document.documentElement.style.setProperty(
      "--depenseSecondary",
      depenseSecondaryColor
    );
    document.documentElement.style.setProperty("--revenu", revenuColor);
    document.documentElement.style.setProperty(
      "--revenuSecondary",
      revenuSecondaryColor
    );
    document.documentElement.style.setProperty("--benefice", beneficeColor);
    document.documentElement.style.setProperty(
      "--beneficeSecondary",
      beneficeSecondaryColor
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
          main: secondaryColor,
        },
        success: {
          main: revenuColor,
        },
        error: {
          main: depenseColor,
        },
      },
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div>Coucou</div>
    </ThemeProvider>
  );
}
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Index />);

import { frFR } from "@material-ui/core/locale";
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme(
  {
    palette: {
      primary: {
        main: "#4c3ed9",
      },
      secondary: {
        main: "#80cbc4",
      },
      background: {
        default: "#f5f5f5",
      },
      error: {
        main: "#d93939",
      },
      success: {
        main: "#008000",
      },
    },
    typography: {
      fontFamily: ["Roboto", "Arial", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontSize: "1.8rem",
        fontWeight: 600,
        margin: "1.2rem 0 1rem 0",
      },
      h2: {
        fontSize: "1.357rem",
        fontWeight: 600,
        margin: 0,
      },
      h3: {
        fontSize: "1.07rem",
        fontWeight: "normal",
        margin: 500,
      },
      button: {
        fontSize: "1rem",
      },
    },
    overrides: {
      MuiButton: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
        },
      },
      MuiInputLabel: {
        shrink: {
          transform: "translate(0, 1.5px) scale(0.9)",
        },
      },
    },
  },
  frFR,
);

export default theme;

import {createTheme} from "@mui/material";

import '@fontsource/quicksand/300.css';
import '@fontsource/quicksand/400.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/700.css';

export default createTheme({
  palette: {
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#ff9100',
    },
  },
  typography: {
    fontFamily: '"Quicksand", "Helvetica", "Arial", sans-serif',
  },
});
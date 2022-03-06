import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../styles/theme";
import LeftDrawer from "../components/LeftDrawer";
import Loading from "../components/Loading";
import ResetScroll from "../components/ResetScroll";

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <RecoilNexus />
        <CssBaseline />
        <LeftDrawer />
        <ResetScroll />
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </RecoilRoot>
    </ThemeProvider>
  );
}

export default Root;

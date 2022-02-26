import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import CssBaseline from "@mui/material/CssBaseline";

import LeftDrawer from "../components/LeftDrawer";
import Loading from "../components/Loading";

function Root() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <CssBaseline />
      <LeftDrawer />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </RecoilRoot>
  );
}

export default Root;

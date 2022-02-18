import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";

import LeftDrawer from "./LeftDrawer";
import Loading from "./Loading";


function Root() {
  return (
    <RecoilRoot>
      <CssBaseline />
      <LeftDrawer />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </RecoilRoot>
  );
}

export default Root;

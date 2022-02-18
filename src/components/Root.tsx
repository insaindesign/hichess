import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";

import Loading from "./Loading";

function Root() {
  return (
    <RecoilRoot>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </RecoilRoot>
  );
}

export default Root;

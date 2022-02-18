import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";

function Root() {
  return (
    <RecoilRoot>
      <CssBaseline />
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>s
    </RecoilRoot>
  );
}

export default Root;

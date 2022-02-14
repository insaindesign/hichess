import { Outlet } from "react-router-dom";
import { RecoilRoot } from "recoil";
import CssBaseline from "@mui/material/CssBaseline";

function Root() {
  return (
    <RecoilRoot>
      <CssBaseline />
      <Outlet />
    </RecoilRoot>
  );
}

export default Root;

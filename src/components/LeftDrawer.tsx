import { useCallback } from "react";
import Drawer from "@mui/material/Drawer";
import { useRecoilState } from "recoil";

import MainMenu from "./MainMenu";
import { menuOpenState } from "../state/app";

function LeftDrawer() {
  const [drawerOpen, setDrawerOpen] = useRecoilState(menuOpenState);
  const closeDrawer = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);
  return (
    <Drawer anchor="left" open={drawerOpen} onClose={closeDrawer}>
      <MainMenu />
    </Drawer>
  );
}

export default LeftDrawer;

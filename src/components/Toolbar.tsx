import { useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import MuiToolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useSetRecoilState } from "recoil";

import { menuOpenState } from "../state/app";

type Props = {
  children?: any;
};

function Toolbar({ children }: Props) {
  const setDrawerOpen = useSetRecoilState(menuOpenState);
  const openDrawer = useCallback(() => setDrawerOpen(true), [setDrawerOpen]);
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <MuiToolbar>
        <IconButton
          onClick={openDrawer}
          size="large"
          edge="start"
          color="inherit"
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </MuiToolbar>
    </AppBar>
  );
}

export default Toolbar;

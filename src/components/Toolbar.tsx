import { useCallback, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import MuiToolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MainMenu from "./MainMenu";

type Props = {
  children: any;
};

function Toolbar({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  return (
    <>
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
          <div style={{ flexGrow: 1 }}>{children}</div>
        </MuiToolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={closeDrawer}>
        <div style={{ width: '95vw' }}><MainMenu onClick={closeDrawer} /></div>
      </Drawer>
    </>
  );
}

export default Toolbar;

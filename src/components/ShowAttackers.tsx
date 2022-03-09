import ToggleButton from "@mui/material/ToggleButton";
import FlashOffIcon from "@mui/icons-material/FlashOff";
import FlashIcon from "@mui/icons-material/FlashOn";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import Filter1Icon from "@mui/icons-material/Filter1";

import ToggleButtonGroup from "./ToggleButtonGroup";

import type { ToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";

function ShowAttackers(props: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup color="error" exclusive fullWidth size="small" {...props}>
      <ToggleButton value="none">
        <FlashOffIcon />
      </ToggleButton>
      <ToggleButton value="counts">
        <FlashIcon />
        <Filter1Icon />
      </ToggleButton>
      <ToggleButton value="both">
        <FlashIcon />
        <AltRouteIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ShowAttackers;
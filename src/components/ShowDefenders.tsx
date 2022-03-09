import ToggleButton from "@mui/material/ToggleButton";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import Filter1Icon from "@mui/icons-material/Filter1";
import ShieldIcon from '@mui/icons-material/Shield';
import RemoveModeratorIcon from "@mui/icons-material/RemoveModerator";

import ToggleButtonGroup from "./ToggleButtonGroup";

import type { ToggleButtonGroupProps } from "@mui/material/ToggleButtonGroup";

function ShowDefenders(props: ToggleButtonGroupProps) {
  return (
    <ToggleButtonGroup color="success" exclusive fullWidth size="small" {...props}>
      <ToggleButton value="none" size="small">
        <RemoveModeratorIcon />
      </ToggleButton>
      <ToggleButton value="counts">
        <ShieldIcon />
        <Filter1Icon />
      </ToggleButton>
      <ToggleButton value="both">
        <ShieldIcon />
        <AltRouteIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ShowDefenders;

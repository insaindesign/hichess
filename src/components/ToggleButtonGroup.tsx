import { styled } from '@mui/material/styles';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  border: '1px solid #ccc',
  '& .MuiToggleButton-sizeSmall': {
    padding: '3px 9px'
  },
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    borderColor: "transparent",
    "&.Mui-disabled": {
      borderColor: "transparent",
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default StyledToggleButtonGroup;
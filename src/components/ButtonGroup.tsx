import { styled } from "@mui/material/styles";
import ButtonGroup from "@mui/material/ButtonGroup";

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  border: "1px solid #ccc",
  "& .MuiButtonGroup-grouped": {
    margin: theme.spacing(0.5),
    padding: '11px',
    borderColor: "transparent",
    "&:hover": {
      borderColor: "transparent",
    },
    "&.Mui-disabled": {
      borderColor: "transparent",
    },
    "&:not(:first-of-type)": {
      borderRadius: theme.shape.borderRadius,
    },
    "&:first-of-type": {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

export default StyledButtonGroup;

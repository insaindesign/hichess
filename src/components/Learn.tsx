import { Link } from "react-router-dom";
import { useState, Fragment } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

import categories from "../data/learn";

type Props = {
  category?: string;
  stage?: string;
};

function Learn({ category, stage }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(category || "");

  const handleClick = (key: string) => () => setOpen(key !== open ? key : "");

  return (
    <List>
      {categories.map((c) => (
        <Fragment key={c.key}>
          <ListItemButton
            divider
            onClick={handleClick(c.key)}
            selected={c.key === category}
          >
            <ListItemText primary={t("learn." + c.name)} />
            {open === c.key ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open === c.key} unmountOnExit>
            <List disablePadding>
              {c.stages.map((s) => (
                <ListItemButton
                  sx={{ pl: 4 }}
                  key={s.key}
                  selected={s.key === stage}
                  component={Link}
                  to={`/learn/${c.key}/${s.key}/`}
                >
                  <ListItemText primary={t("learn." + s.key)} />
                </ListItemButton>
              ))}
            </List>
            <Divider />
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
}

export default Learn;

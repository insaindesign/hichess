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
import { useRecoilValue } from "recoil";

import { notEmpty } from "../lib/arrays";
import categories from "../data/learn";
import {
  ProblemAttemptsOfIds,
  problemStateForAccountId,
} from "../state/problems";

import type { Account } from "../state/accounts";
import type { Stage } from "../data/util";

type Props = {
  account: Account;
  category?: string;
  stage?: string;
};

const problemIds: string[] = [];
categories.forEach((c) =>
  c.stages.forEach((s) => {
    s.levels.forEach((l) => problemIds.push(l.id));
  })
);

const secondary = (s: Stage, r: ProblemAttemptsOfIds): string => {
  const size = s.levels.length;
  const completed = s.levels
    .map((l) => r[l.id])
    .filter((r) => r?.success).length;
  return "Completed " + completed + " of " + size;
};

function Learn({ category, stage, account }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(category || "pieces");
  const { problemAttemptsOfIdsState } = problemStateForAccountId(account.id);
  const lessonsAttempts = useRecoilValue(problemAttemptsOfIdsState(problemIds));

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
                  <ListItemText
                    primary={t("learn." + s.key)}
                    secondary={secondary(s, lessonsAttempts)}
                  />
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

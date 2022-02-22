import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { eloStateForAccountId } from "../state/elo";
import { problemStateForAccountId } from "../state/problems";

type Props = {
  accountId: string;
  type: "puzzle" | "learn";
};

function Problem({ accountId, type }: Props) {
  const { t } = useTranslation();
  const { problemsOfTypeState } = problemStateForAccountId(accountId);
  const { eloState } = eloStateForAccountId(accountId);
  const problems = useRecoilValue(problemsOfTypeState(type));
  const elo = useRecoilValue(eloState(type));

  return (
    <div>
      <Typography variant="h4">
        {t('history.'+type)} <Chip label={Math.round(elo)} />
      </Typography>
      {problems.map((p, ii) => (
        <div key={ii}>
          {p.id}, {new Date(p.date).toDateString()}, {t(p.result)}, {p.rating}
        </div>
      ))}
    </div>
  );
}

export default Problem;

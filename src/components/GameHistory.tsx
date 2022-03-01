import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";

import { eloStateForAccountId } from "../state/elo";
import { gameStateForAccountId } from "../state/games";

type Props = {
  accountId: string;
};

function GameHistory({ accountId }: Props) {
  const { t } = useTranslation();
  const { gamesState } = gameStateForAccountId(accountId);
  const { eloState } = eloStateForAccountId(accountId);
  const games = useRecoilValue(gamesState);
  const elo = useRecoilValue(eloState("game"));

  return (
    <div>
      <Typography variant="h4">
        {t("history.games")} <Chip label={Math.round(elo)} />
      </Typography>
      {games.map((g, ii) => (
        <div key={ii}>
          {new Date(g.date).toDateString()}, {g.color},{" "}
          {g.result || "incomplete"}, {g.ratingChange}
        </div>
      ))}
    </div>
  );
}

export default GameHistory;

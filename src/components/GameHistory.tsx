import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
  const { eloState, eloLoadedState } = eloStateForAccountId(accountId);
  const games = useRecoilValue(gamesState);
  const eloLoaded = useRecoilValue(eloLoadedState('game'));
  const elo = useRecoilValue(eloState("game"));

  return (
    <div>
      <Typography variant="h4">
        <Link to="/game">{t("history.games")}</Link>{" "}
        {eloLoaded ? (
          <Chip label={Math.round(elo)} sx={{ fontWeight: 700 }} />
        ) : null}
      </Typography>
      {games.map((g, ii) => (
        <div key={ii}>
          <Link to={`/play/${g.date}`}>{new Date(g.date).toDateString()}</Link>,{" "}
          {!g.result ? "incomplete" : g.color !== 'both' ? `${g.color} ${g.result === g.color ? 'win' : 'loss'} ${g.opponent ? `vs ${g.opponent}` : ''} (${g.ratingChange})` : g.result}
        </div>
      ))}
    </div>
  );
}

export default GameHistory;

import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { promblemStateForAccountId } from "../state/problems";

type Props = {
  accountId: string;
};

function Problem({ accountId }: Props) {
  const { t } = useTranslation();
  const { problemsState } = promblemStateForAccountId(accountId);
  const problems = useRecoilValue(problemsState);

  return (
    <div>
      <h2>Problems</h2>
      {problems.map((p, ii) => {
        return (
          <div key={ii}>
            {p.id}, {new Date(p.date).toDateString()}, {t(p.result)}, {p.rating}
          </div>
        );
      })}
    </div>
  );
}

export default Problem;

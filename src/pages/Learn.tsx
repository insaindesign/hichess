import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import "./LearnLevels"; // preload route
import Learn from "../components/Learn";
import Toolbar from "../components/Toolbar";
import { withRequireAccount } from "../components/RequireAccount";

import type { Account } from "../state/accounts";

type Props = {
  account: Account;
};

function LearnPage({ account }: Props) {
  const { t } = useTranslation();
  const params = useParams<"category">();

  return (
    <>
      <Toolbar>{t("learn.title")}</Toolbar>
      <Learn category={params.category} account={account} />
    </>
  );
}

export default withRequireAccount(LearnPage);

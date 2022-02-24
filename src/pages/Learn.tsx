import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import "./LearnLevels"; // preload route
import Learn from "../components/Learn";
import Toolbar from "../components/Toolbar";
import { withRequireAccount } from "../components/RequireAccount";

type Props = {};

function LearnPage(props: Props) {
  const { t } = useTranslation();
  const params = useParams<'category'>();

  return (
    <>
      <Toolbar>{t("learn.title")}</Toolbar>
      <Learn category={params.category} />
    </>
  );
}

export default withRequireAccount(LearnPage);

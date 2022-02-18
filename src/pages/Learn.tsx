import { useTranslation } from "react-i18next";

import "./LearnLevels";
import Learn from "../components/Learn";
import Toolbar from "../components/Toolbar";

type Props = {};

function LearnPage(props: Props) {
  const { t } = useTranslation();
  return (
    <>
      <Toolbar>{t("learn.title")}</Toolbar>
      <Learn />
    </>
  );
}

export default LearnPage;

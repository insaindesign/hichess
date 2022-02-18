import {useEffect} from "react";
import { useSetRecoilState } from "recoil";

import { menuOpenState } from "../state/app";

function Menu() {
  const setDrawerOpen = useSetRecoilState(menuOpenState);
  useEffect(() => setDrawerOpen(true), [setDrawerOpen]);
  return null;
}

export default Menu;

import { atom } from "recoil";
import { globalPersist } from "./";

import type { IconName } from "../components/AsyncAccountIcon";

export type Account = {
  id: string;
  name: string;
  icon: IconName;
};

export const selectedAccountState = atom<Account|null>({
  key: "selectedAccount",
  default: null,
  effects: [globalPersist],
});

export const accountsState = atom<Account[]>({
  key: "accounts",
  default: [],
  effects: [globalPersist],
});

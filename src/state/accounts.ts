import { atom, selector } from "recoil";
import { globalPersist } from "./";

import type { IconName } from "../components/AccountAvatarAsync";

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

export const accountIdState = selector<string|null>({
  key: "accountId",
  get: ({ get }) => {
    const account = get(selectedAccountState)
    return account ? account.id : null;
  }
});

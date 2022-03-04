import { atom, DefaultValue, selector } from "recoil";
import { appStore } from "../storage";
import { persist } from "./";


import type { IconName } from "../components/AccountAvatarAsync";

export type Account = {
  id: string;
  name: string;
  icon: IconName;
};

// this should have had a better key (e.g., accounts)
const accountPersist = persist({storage: appStore, key: "recoil-persist"});

export const selectedAccountState = atom<Account|null>({
  key: "selectedAccount",
  default: null,
  effects: [accountPersist],
});

export const accountsState = atom<Account[]>({
  key: "accounts",
  default: [],
  effects: [accountPersist],
});

export const addAccountState = selector<Account|null>({
  key: "addAccount",
  get: ({ get }) => get(selectedAccountState),
  set: ({get, set}, newVal) => {
    if (!newVal || newVal instanceof DefaultValue) {
      return;
    }
    set(accountsState, [...get(accountsState), newVal]);
  }
});

import { recoilPersist } from "recoil-persist";
// import { createStore } from "../storage";

// Each state module should have it's own persist,
// Some atoms may have their own persist
export const persist = (key: string) => {
  const { persistAtom } = recoilPersist({
    key,
    // storage: createStore(key) // todo broken
  });
  return persistAtom;
};

export const globalPersist = persist('app');
export const gamesPersist = persist('games');
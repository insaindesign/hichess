import { recoilPersist } from "recoil-persist";
import { createStore } from "../storage";

// Each state module should have it's own persist,
// Some atoms may have their own persist
const persist = (key: string) => {
  const storage = createStore(key);
  const { persistAtom } = recoilPersist({ storage });
  return persistAtom;
};

export const globalPersist = persist("app");
export const puzzlePersist = persist("puzzle");

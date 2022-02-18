import { recoilPersist } from "recoil-persist";
import { appStore } from "../storage";

import type { PersistStorage } from "recoil-persist";

// Each state module should have it's own persist,
// Some atoms may have their own persist
const persist = (storage: PersistStorage) => {
  const { persistAtom } = recoilPersist({ storage });
  return persistAtom;
};

export const globalPersist = persist(appStore);

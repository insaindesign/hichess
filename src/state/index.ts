import { recoilPersist } from "recoil-persist";
import { appStore } from "../storage";

import type { PersistConfiguration } from "recoil-persist";

// Each state module should have it's own persist,
// Some atoms may have their own persist
export const persist = (config: Partial<PersistConfiguration>) => {
  const { persistAtom } = recoilPersist(config);
  return persistAtom;
};

export const globalPersist = persist({storage: appStore});

export const accountKey = (id: string) => (key: string) => id + '-' + key;
